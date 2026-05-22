/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/server/db/connection";
import { corsHeaders, handleCorsPreFlight } from "@/lib/cors";
import type { ReordenarItem } from "@/types/servico";

export async function OPTIONS(request: NextRequest) {
	return handleCorsPreFlight(request);
}

export async function PUT(request: NextRequest) {
	try {
		const contentType = request.headers.get('content-type');
		if (!contentType?.includes('application/json')) {
			return NextResponse.json({ error: "Content-Type deve ser application/json" }, { status: 400 });
		}

		const { itens }: { itens: ReordenarItem[] } = await request.json();

		if (!Array.isArray(itens) || itens.length === 0) {
			return NextResponse.json({ error: "Array de itens com prioridades é obrigatório" }, { status: 400 });
		}

		const connection = await getConnection();

		try {
			for (const item of itens) {
				const result = await connection.execute("UPDATE servicos SET prioridade = ?, atualizado_em = CURRENT_TIMESTAMP WHERE id = ?", [item.prioridade, item.id]);

				if ((result[0] as any).affectedRows === 0) {
					return NextResponse.json({ error: `Serviço com ID ${item.id} não encontrado` }, { status: 404 });
				}
			}

			const response = NextResponse.json({ message: "Serviços reordenados com sucesso" }, { status: 200 });

			const headers = corsHeaders(request);
			headers.forEach((value, key) => response.headers.set(key, value));

			return response;
		} finally {
			await connection.end();
		}
	} catch (error) {
		console.error("Erro ao reordenar serviços:", error);
		return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
	}
}
