"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const [nome, setNome] = useState("");
	const [senha, setSenha] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await fetch("/api/user", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ nome, senha }),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || "Erro ao fazer login");
				setLoading(false);
				return;
			}

			router.push("/adm");
		} catch (err) {
			console.log(err);
			setError("Erro ao conectar ao servidor");
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="relative w-full max-w-md">
				<div className="bg-(--background) rounded-2xl shadow-2xl overflow-hidden">
					<div className="bg-(--main-color) px-6 py-8 sm:px-8">
						<div className="flex items-center justify-center mb-3">
							<span className="text-4xl">🏢</span>
						</div>
						<h1 className="text-center text-2xl font-bold text-(--background) mb-2">EBJ Engenharia</h1>
						<p className="text-center text-(--light-color) text-sm">Painel de Administração</p>
					</div>

					<form className="px-6 py-8 sm:px-8" onSubmit={handleSubmit}>
						{error && (
							<div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 flex items-start">
								<span className="text-red-600 text-lg mr-3">⚠️</span>
								<p className="text-sm text-red-800">{error}</p>
							</div>
						)}

						<div className="mb-5">
							<label htmlFor="nome" className="block text-sm font-medium text-(--foreground) mb-2">
								Usuário
							</label>
							<input id="nome" name="nome" type="text" autoComplete="username" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-(--main-color) focus:ring-2 focus:ring-(--secondary-color) outline-none transition-all placeholder-gray-400" placeholder="Digite seu usuário" value={nome} onChange={(e) => setNome(e.target.value)} />
						</div>

						<div className="mb-6">
							<label htmlFor="senha" className="block text-sm font-medium text-(--foreground) mb-2">
								Senha
							</label>
							<input id="senha" name="senha" type="password" autoComplete="current-password" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-(--main-color) focus:ring-2 focus:ring-(--secondary-color) outline-none transition-all placeholder-gray-400" placeholder="Digite sua senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
						</div>

						<button type="submit" disabled={loading} className="w-full py-3 px-4 bg-(--main-color) text-(--background) font-semibold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-(--secondary-color) focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
							{loading ? (
								<>
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-(--background) mr-2"></div>
									Entrando...
								</>
							) : (
								<>🔐 Entrar</>
							)}
						</button>

						<div className="mt-6 text-center text-xs text-(--foreground)">
							<p>Acesso restrito a administradores</p>
						</div>
					</form>
				</div>

				<div className="mt-6 text-center text-(--main-color) text-xs">
					<p>🔒 Conexão segura e criptografada</p>
				</div>
			</div>
		</div>
	);
}
