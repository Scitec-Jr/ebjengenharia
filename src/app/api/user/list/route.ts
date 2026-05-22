import { NextResponse } from "next/server";
import { getConnection } from "@/server/db/connection";

export async function GET() {
	try {
		const connection = await getConnection();

		try {
			const [rows] = await connection.execute("SELECT id, nome, criado_em, atualizado_em FROM user ORDER BY criado_em DESC");

			return NextResponse.json(
				{
					usuarios: rows,
				},
				{ status: 200 },
			);
		} finally {
			await connection.end();
		}
	} catch (error) {
		console.error("Erro ao listar usuários:", error);
		return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
	}
}
