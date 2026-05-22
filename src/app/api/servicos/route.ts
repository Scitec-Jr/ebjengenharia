import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/server/db/connection";
import { generateSlug } from "@/lib/slug";
import { corsHeaders, handleCorsPreFlight } from "@/lib/cors";
import type { Servico } from "@/types/servico";

export async function OPTIONS(request: NextRequest) {
	return handleCorsPreFlight(request);
}

export async function GET() {
	try {
		const connection = await getConnection();

		try {
			const [rows] = await connection.execute(`
				SELECT 
					id, nome, slug, valor, descricao, resumo,
					caminho_imagens, quantidade_imagens, prioridade,
					status_venda, criado_em, atualizado_em
				FROM servicos
				ORDER BY prioridade ASC, atualizado_em DESC
			`);

			const response = NextResponse.json(
				{
					servicos: rows as Servico[],
				},
				{ status: 200 },
			);

			const headers = corsHeaders(new NextRequest(new Request('http://localhost')));
			headers.forEach((value, key) => response.headers.set(key, value));

			return response;
		} finally {
			await connection.end();
		}
	} catch (error) {
		console.error("Erro ao listar serviços:", error);
		return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const contentType = request.headers.get('content-type');
		if (!contentType?.includes('application/json')) {
			return NextResponse.json({ error: "Content-Type deve ser application/json" }, { status: 400 });
		}

		const { nome, valor, descricao, resumo, caminho_imagens, quantidade_imagens, prioridade = 999, status_venda = true } = await request.json();

		if (!nome || !valor || !caminho_imagens || quantidade_imagens === undefined) {
			return NextResponse.json(
				{
					error: "Nome, valor, caminho_imagens e quantidade_imagens são obrigatórios",
				},
				{ status: 400 },
			);
		}

		if (nome.length < 3) {
			return NextResponse.json({ error: "Nome deve ter pelo menos 3 caracteres" }, { status: 400 });
		}

		if (valor <= 0) {
			return NextResponse.json({ error: "Valor deve ser maior que 0" }, { status: 400 });
		}

		if (quantidade_imagens < 0) {
			return NextResponse.json({ error: "Quantidade de imagens deve ser não-negativa" }, { status: 400 });
		}

		const slug = generateSlug(nome);

		const connection = await getConnection();

		try {
			const [existing] = await connection.execute("SELECT id FROM servicos WHERE slug = ?", [slug]);

			if ((existing as unknown[]).length > 0) {
				return NextResponse.json({ error: "Já existe um serviço com este nome (slug duplicado)" }, { status: 409 });
			}

			const result = await connection.execute(
				`INSERT INTO servicos 
				(nome, slug, valor, descricao, resumo, caminho_imagens, quantidade_imagens, prioridade, status_venda)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[nome, slug, valor, descricao || null, resumo || null, caminho_imagens, quantidade_imagens, prioridade, status_venda ? 1 : 0],
			);

			const response = NextResponse.json(
				{
					message: "Serviço criado com sucesso",
					id: (result[0] as unknown as { insertId: number }).insertId,
					slug,
				},
				{ status: 201 },
			);

			const headers = corsHeaders(request);
			headers.forEach((value, key) => response.headers.set(key, value));

			return response;
		} finally {
			await connection.end();
		}
	} catch (error) {
		console.error("Erro ao criar serviço:", error);
		return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
	}
}
