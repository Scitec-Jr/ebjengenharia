/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/server/db/connection";
import { comparePasswords, generateToken, setAuthCookie } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
	try {
		const contentType = request.headers.get('content-type');
		if (!contentType?.includes('application/json')) {
			return NextResponse.json({ error: "Content-Type deve ser application/json" }, { status: 400 });
		}

		const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
		const rateLimitResult = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000);

		if (!rateLimitResult.success) {
			return NextResponse.json(
				{ error: "Muitas tentativas de login. Tente novamente em alguns minutos." },
				{
					status: 429,
					headers: {
						'Retry-After': rateLimitResult.retryAfter?.toString() || '900',
					},
				},
			);
		}

		const { nome, senha } = await request.json();

		if (!nome || !senha) {
			return NextResponse.json({ error: "Nome e senha são obrigatórios" }, { status: 400 });
		}

		if (typeof nome !== 'string' || typeof senha !== 'string') {
			return NextResponse.json({ error: "Nome e senha devem ser strings" }, { status: 400 });
		}

		const connection = await getConnection();

		try {
			const [rows] = await connection.execute("SELECT id, nome, senha FROM user WHERE nome = ?", [nome]);

			const users = rows as any[];

			if (users.length === 0) {
				return NextResponse.json({ error: "Usuário ou senha inválidos" }, { status: 401 });
			}

			const user = users[0];
			const passwordMatch = await comparePasswords(senha, user.senha);

			if (!passwordMatch) {
				return NextResponse.json({ error: "Usuário ou senha inválidos" }, { status: 401 });
			}

			const token = generateToken(user.id, user.nome);
			await setAuthCookie(token);

			const response = NextResponse.json(
				{
					message: "Login realizado com sucesso",
					user: {
						id: user.id,
						nome: user.nome,
					},
				},
				{ status: 200 },
			);

			return response;
		} finally {
			await connection.end();
		}
	} catch (error) {
		console.error("Erro ao fazer login:", error);
		return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
	}
}
