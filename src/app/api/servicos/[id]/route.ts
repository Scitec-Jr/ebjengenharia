/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/server/db/connection';
import { generateSlug } from '@/lib/slug';
import { corsHeaders, handleCorsPreFlight } from '@/lib/cors';
import { deleteCloudinaryFolder } from '@/lib/cloudinaryUtils';
import type { AtualizarServicoInput } from '@/types/servico';

export async function OPTIONS(request: NextRequest) {
	return handleCorsPreFlight(request);
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const contentType = request.headers.get('content-type');
		if (!contentType?.includes('application/json')) {
			return NextResponse.json({ error: "Content-Type deve ser application/json" }, { status: 400 });
		}

		const { id: idString } = await params;
		const id = parseInt(idString, 10);

		if (isNaN(id)) {
			return NextResponse.json(
				{ error: 'ID inválido' },
				{ status: 400 }
			);
		}

		const data: AtualizarServicoInput = await request.json();

		if (Object.keys(data).length === 0) {
			return NextResponse.json(
				{ error: 'Pelo menos um campo deve ser fornecido' },
				{ status: 400 }
			);
		}

		if (data.nome && data.nome.length < 3) {
			return NextResponse.json(
				{ error: 'Nome deve ter pelo menos 3 caracteres' },
				{ status: 400 }
			);
		}

		if (data.valor !== undefined && data.valor <= 0) {
			return NextResponse.json(
				{ error: 'Valor deve ser maior que 0' },
				{ status: 400 }
			);
		}

		if (data.quantidade_imagens !== undefined && data.quantidade_imagens < 0) {
			return NextResponse.json(
				{ error: 'Quantidade de imagens deve ser não-negativa' },
				{ status: 400 }
			);
		}

		const connection = await getConnection();

		try {
			const updates: string[] = [];
			const values: any[] = [];
			
			// Buscar dados anteriores para deletar pasta antiga do Cloudinary
			const [existingData] = await connection.execute(
				'SELECT caminho_imagens FROM servicos WHERE id = ?',
				[id]
			);

			let caminhoImagensAnterior: string | null = null;
			if ((existingData as any[]).length > 0) {
				caminhoImagensAnterior = (existingData as any[])[0].caminho_imagens;
			}

			if (data.nome) {
				updates.push('nome = ?');
				values.push(data.nome);

				const novoSlug = generateSlug(data.nome);

				const [duplicata] = await connection.execute(
					'SELECT id FROM servicos WHERE slug = ? AND id != ?',
					[novoSlug, id]
				);

				if ((duplicata as any[]).length > 0) {
					return NextResponse.json(
						{ error: 'Já existe um serviço com este nome (slug duplicado)' },
						{ status: 409 }
					);
				}

				updates.push('slug = ?');
				values.push(novoSlug);
			}

			if (data.valor !== undefined) {
				updates.push('valor = ?');
				values.push(data.valor);
			}

			if (data.descricao !== undefined) {
				updates.push('descricao = ?');
				values.push(data.descricao || null);
			}

			if (data.resumo !== undefined) {
				updates.push('resumo = ?');
				values.push(data.resumo || null);
			}

			let pastaParaDeletar: string | null = null;

			if (data.caminho_imagens !== undefined) {
				updates.push('caminho_imagens = ?');
				values.push(data.caminho_imagens);

				// Se o caminho de imagens mudou para algo diferente, deletar a pasta antiga
				if (caminhoImagensAnterior && data.caminho_imagens !== caminhoImagensAnterior) {
					pastaParaDeletar = caminhoImagensAnterior;
				}
			}

			if (data.quantidade_imagens !== undefined) {
				updates.push('quantidade_imagens = ?');
				values.push(data.quantidade_imagens);
			}

			if (data.prioridade !== undefined) {
				updates.push('prioridade = ?');
				values.push(data.prioridade);
			}

			if (data.status_venda !== undefined) {
				updates.push('status_venda = ?');
				values.push(data.status_venda ? 1 : 0);
			}

			updates.push('atualizado_em = CURRENT_TIMESTAMP');

			const query = `UPDATE servicos SET ${updates.join(', ')} WHERE id = ?`;
			values.push(id);

			const result = await connection.execute(query, values);

			if ((result[0] as any).affectedRows === 0) {
				return NextResponse.json(
					{ error: 'Serviço não encontrado' },
					{ status: 404 }
				);
			}

			// Deletar pasta antiga do Cloudinary apenas se caminho_imagens mudou
			// Isso garante que novas imagens já foram uploadadas antes
			if (pastaParaDeletar) {
				deleteCloudinaryFolder(pastaParaDeletar).catch((err) =>
					console.error('Erro ao deletar pasta anterior do Cloudinary:', err)
				);
			}

			const response = NextResponse.json(
				{ message: 'Serviço atualizado com sucesso' },
				{ status: 200 }
			);

			const headers = corsHeaders(request);
			headers.forEach((value, key) => response.headers.set(key, value));

			return response;
		} finally {
			await connection.end();
		}
	} catch (error) {
		console.error('Erro ao atualizar serviço:', error);
		return NextResponse.json(
			{ error: 'Erro interno do servidor' },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id: idString } = await params;
		const id = parseInt(idString, 10);

		if (isNaN(id)) {
			return NextResponse.json(
				{ error: 'ID inválido' },
				{ status: 400 }
			);
		}

		const connection = await getConnection();

		try {
			// Buscar informações do serviço antes de deletar
			const [servicos] = await connection.execute(
				'SELECT caminho_imagens FROM servicos WHERE id = ?',
				[id]
			);

			if ((servicos as any[]).length === 0) {
				return NextResponse.json(
					{ error: 'Serviço não encontrado' },
					{ status: 404 }
				);
			}

			const caminhoImagens = (servicos as any[])[0].caminho_imagens;

			// Deletar serviço do banco de dados
			const result = await connection.execute(
				'DELETE FROM servicos WHERE id = ?',
				[id]
			);

			if ((result[0] as any).affectedRows === 0) {
				return NextResponse.json(
					{ error: 'Serviço não encontrado' },
					{ status: 404 }
				);
			}

			// Reordenar prioridades
			await connection.query(`SET @counter = 0`);

            await connection.query(`
                UPDATE servicos
                SET prioridade = (@counter := @counter + 1)
                ORDER BY prioridade ASC, atualizado_em DESC
            `);

			// Deletar pasta de imagens do Cloudinary (em background, sem bloquear resposta)
			deleteCloudinaryFolder(caminhoImagens).catch((err) =>
				console.error('Erro ao deletar pasta do Cloudinary:', err)
			);

			const response = NextResponse.json(
				{ message: 'Serviço deletado com sucesso' },
				{ status: 200 }
			);

			const headers = corsHeaders(request);
			headers.forEach((value, key) => response.headers.set(key, value));

			return response;
		} finally {
			await connection.end();
		}
	} catch (error) {
		console.error('Erro ao deletar serviço:', error);
		return NextResponse.json(
			{ error: 'Erro interno do servidor' },
			{ status: 500 }
		);
	}
}
