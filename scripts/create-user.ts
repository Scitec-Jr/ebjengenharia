/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "../src/server/db/connection.ts";
import { hashPassword } from "../src/lib/auth.ts";

async function createUser(nome: string, senha: string) {
	try {
		const connection = await getConnection();
		const hashedPassword = await hashPassword(senha);

		const result = await connection.execute("INSERT INTO user (nome, senha) VALUES (?, ?)", [nome, hashedPassword]);

		console.log(`Usuário "${nome}" criado com sucesso!`);
		console.log(`ID: ${(result[0] as any).insertId}`);

		await connection.end();
	} catch (error: any) {
		if (error.code === "ER_DUP_ENTRY") {
			console.error(`Erro: Usuário "${nome}" já existe no banco de dados`);
		} else {
			console.error("Erro ao criar usuário:", error.message);
		}
		process.exit(1);
	}
}

const args = process.argv.slice(2);

if (args.length < 2) {
	console.error("Uso: npm run create-user <nome> <senha>");
	console.error("Exemplo: npm run create-user admin 123456");
	process.exit(1);
}

const [nome, senha] = args;
createUser(nome, senha);
