/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/server/db/connection";

export async function DELETE(request: NextRequest) {
	try {
		const { id } = await request.json();

		if (!id) {
			return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 });
		}

		const connection = await getConnection();

		try {
			const [usuarios] = await connection.execute("SELECT COUNT(*) as count FROM user");

			const count = (usuarios as any[])[0].count;
			if (count <= 1) {
				return NextResponse.json({ error: "Não é possível deletar o último usuário do sistema" }, { status: 400 });
			}

			const result = await connection.execute("DELETE FROM user WHERE id = ?", [id]);

			if ((result[0] as any).affectedRows === 0) {
				return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
			}

			return NextResponse.json({ message: "Usuário deletado com sucesso" }, { status: 200 });
		} finally {
			await connection.end();
		}
	} catch (error) {
		console.error("Erro ao deletar usuário:", error);
		return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
	}
}
