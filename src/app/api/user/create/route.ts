/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/server/db/connection";
import { hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
	try {
		const { nome, senha } = await request.json();

		if (!nome || !senha) {
			return NextResponse.json({ error: "Nome e senha são obrigatórios" }, { status: 400 });
		}

		if (nome.length < 3) {
			return NextResponse.json({ error: "Nome deve ter pelo menos 3 caracteres" }, { status: 400 });
		}

		if (senha.length < 6) {
			return NextResponse.json({ error: "Senha deve ter pelo menos 6 caracteres" }, { status: 400 });
		}

		const connection = await getConnection();

		try {
			const hashedPassword = await hashPassword(senha);

			const result = await connection.execute("INSERT INTO user (nome, senha) VALUES (?, ?)", [nome, hashedPassword]);

			return NextResponse.json(
				{
					message: "Usuário criado com sucesso",
					id: (result[0] as any).insertId,
				},
				{ status: 201 },
			);
		} catch (error: any) {
			if (error.code === "ER_DUP_ENTRY") {
				return NextResponse.json({ error: "Usuário com este nome já existe" }, { status: 409 });
			}
			throw error;
		} finally {
			await connection.end();
		}
	} catch (error) {
		console.error("Erro ao criar usuário:", error);
		return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
	}
}
