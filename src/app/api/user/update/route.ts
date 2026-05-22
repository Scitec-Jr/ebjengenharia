/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/server/db/connection";
import { hashPassword } from "@/lib/auth";

export async function PUT(request: NextRequest) {
	try {
		const { id, nome, senha } = await request.json();

		if (!id) {
			return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 });
		}

		if (!nome && !senha) {
			return NextResponse.json({ error: "Pelo menos nome ou senha deve ser fornecido" }, { status: 400 });
		}

		if (nome && nome.length < 3) {
			return NextResponse.json({ error: "Nome deve ter pelo menos 3 caracteres" }, { status: 400 });
		}

		if (senha && senha.length < 6) {
			return NextResponse.json({ error: "Senha deve ter pelo menos 6 caracteres" }, { status: 400 });
		}

		const connection = await getConnection();

		try {
			if (nome && !senha) {
				await connection.execute("UPDATE user SET nome = ? WHERE id = ?", [nome, id]);
			} else if (senha && !nome) {
				const hashedPassword = await hashPassword(senha);
				await connection.execute("UPDATE user SET senha = ? WHERE id = ?", [hashedPassword, id]);
			} else {
				const hashedPassword = await hashPassword(senha!);
				await connection.execute("UPDATE user SET nome = ?, senha = ? WHERE id = ?", [nome, hashedPassword, id]);
			}

			return NextResponse.json({ message: "Usuário atualizado com sucesso" }, { status: 200 });
		} catch (error: any) {
			if (error.code === "ER_DUP_ENTRY") {
				return NextResponse.json({ error: "Usuário com este nome já existe" }, { status: 409 });
			}
			throw error;
		} finally {
			await connection.end();
		}
	} catch (error) {
		console.error("Erro ao atualizar usuário:", error);
		return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
	}
}
