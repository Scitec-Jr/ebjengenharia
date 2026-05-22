"use client";

import { useRouter } from "next/navigation";

export default function AdminPage() {
	const router = useRouter();

	return (
		<div className="space-y-6">
			<div className="bg-(--main-color) rounded-lg shadow-lg p-8 text-(--background)">
				<h1 className="text-3xl font-bold mb-2">Bem-vindo ao Painel de Administração</h1>
				<p className="text-(--light-color)">Gerencie projetos, usuários e conteúdo da EBJ Engenharia de forma centralizada</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<div onClick={() => router.push("/adm/projetos")} className="bg-(--background) rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group">
					<div className="h-2 bg-(--secondary-color)"></div>
					<div className="p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-(--foreground)">Projetos</h3>
							<span className="text-3xl">🏗️</span>
						</div>
						<p className="text-(--foreground) text-sm mb-4 opacity-70">Visualize, crie, edite e delete projetos da empresa</p>
						<div className="flex items-center text-(--main-color) group-hover:text-(--secondary-color) font-medium text-sm">
							Gerenciar
							<span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
						</div>
					</div>
				</div>

				<div onClick={() => router.push("/adm/usuarios")} className="bg-(--background) rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group">
					<div className="h-2 bg-(--main-color)"></div>
					<div className="p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-(--foreground)">Usuários</h3>
							<span className="text-3xl">👥</span>
						</div>
						<p className="text-(--foreground) text-sm mb-4 opacity-70">Controle de acesso e gerenciamento de usuários do sistema</p>
						<div className="flex items-center text-(--main-color) group-hover:text-(--secondary-color) font-medium text-sm">
							Gerenciar
							<span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
