"use client";

import { useState, useEffect } from "react";

interface Usuario {
	id: number;
	nome: string;
	criado_em: string;
}

export default function UsuariosPage() {
	const [usuarios, setUsuarios] = useState<Usuario[]>([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [formData, setFormData] = useState({ nome: "", senha: "" });
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	useEffect(() => {
		fetchUsuarios();
	}, []);

	async function fetchUsuarios() {
		try {
			setLoading(true);
			const response = await fetch("/api/user/list");
			const data = await response.json();

			if (response.ok) {
				setUsuarios(data.usuarios);
			} else {
				setError(data.error || "Erro ao carregar usuários");
			}
		} catch (err) {
			console.error("Erro:", err);
			setError("Erro ao conectar ao servidor");
		} finally {
			setLoading(false);
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (!formData.nome.trim()) {
			setError("Nome é obrigatório");
			return;
		}

		try {
			if (editingId) {
				const response = await fetch("/api/user/update", {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						id: editingId,
						nome: formData.nome,
						...(formData.senha && { senha: formData.senha }),
					}),
				});

				const data = await response.json();

				if (!response.ok) {
					setError(data.error || "Erro ao atualizar usuário");
					return;
				}

				setSuccess("Usuário atualizado com sucesso");
				setEditingId(null);
			} else {
				if (!formData.senha.trim()) {
					setError("Senha é obrigatória para novo usuário");
					return;
				}

				const response = await fetch("/api/user/create", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				});

				const data = await response.json();

				if (!response.ok) {
					setError(data.error || "Erro ao criar usuário");
					return;
				}

				setSuccess("Usuário criado com sucesso");
			}

			setFormData({ nome: "", senha: "" });
			setShowForm(false);
			fetchUsuarios();
		} catch (err) {
			console.error("Erro:", err);
			setError("Erro ao conectar ao servidor");
		}
	}

	async function handleDelete(id: number) {
		if (!confirm("Tem certeza que deseja deletar este usuário?")) {
			return;
		}

		try {
			const response = await fetch("/api/user/delete", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || "Erro ao deletar usuário");
				return;
			}

			setSuccess("Usuário deletado com sucesso");
			fetchUsuarios();
		} catch (err) {
			console.error("Erro:", err);
			setError("Erro ao conectar ao servidor");
		}
	}

	function handleEdit(usuario: Usuario) {
		setFormData({ nome: usuario.nome, senha: "" });
		setEditingId(usuario.id);
		setShowForm(true);
	}

	function handleCancel() {
		setShowForm(false);
		setEditingId(null);
		setFormData({ nome: "", senha: "" });
		setError("");
		setSuccess("");
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
					<p className="mt-4 text-gray-600">Carregando usuários...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">👥 Usuários</h1>
					<p className="text-gray-600 mt-1 opacity-70">Total de usuários: {usuarios.length}</p>
				</div>
				<button onClick={() => setShowForm(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-colors font-medium">
					+ Novo Usuário
				</button>
			</div>

			{/* Messages */}
			{error && (
				<div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-start">
					<span className="text-red-600 text-lg mr-3">⚠️</span>
					<p className="text-sm text-red-800">{error}</p>
				</div>
			)}

			{success && (
				<div className="rounded-lg bg-green-50 border border-green-200 p-4 flex items-start">
					<span className="text-green-600 text-lg mr-3">✓</span>
					<p className="text-sm text-green-800">{success}</p>
				</div>
			)}

			{/* Form */}
			{showForm && (
				<div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">{editingId ? "Editar Usuário" : "Novo Usuário"}</h2>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Nome de Usuário</label>
							<input type="text" required value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Nome do usuário" />
						</div>

						{!editingId && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Senha (mínimo 6 caracteres)</label>
								<input type="password" required={!editingId} value={formData.senha} onChange={(e) => setFormData({ ...formData, senha: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Digite a senha" />
							</div>
						)}

						{editingId && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha (deixe em branco para manter)</label>
								<input type="password" value={formData.senha} onChange={(e) => setFormData({ ...formData, senha: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Digite a nova senha (opcional)" />
							</div>
						)}

						<div className="flex gap-3 pt-4">
							<button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-colors font-medium">
								{editingId ? "Atualizar" : "Criar"}
							</button>
							<button type="button" onClick={handleCancel} className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:opacity-80 transition-colors font-medium">
								Cancelar
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Usuários Table */}
			<div className="bg-white rounded-lg shadow overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50 border-b border-gray-200">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Usuário</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Criado em</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Ações</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{usuarios.map((usuario) => (
								<tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
									<td className="px-6 py-4 text-sm font-medium text-gray-900">{usuario.nome}</td>
									<td className="px-6 py-4 text-sm text-gray-600">{new Date(usuario.criado_em).toLocaleDateString("pt-BR")}</td>
									<td className="px-6 py-4 text-sm space-x-2 flex">
										<button onClick={() => handleEdit(usuario)} className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:opacity-80 transition-colors font-medium">
											✏️ Editar
										</button>
										<button onClick={() => handleDelete(usuario.id)} className="px-3 py-1 bg-red-50 text-red-600 rounded hover:opacity-80 transition-colors font-medium">
											🗑️ Deletar
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{usuarios.length === 0 && !showForm && (
				<div className="text-center py-12 bg-gray-50 rounded-lg">
					<span className="text-4xl mb-4 block">👥</span>
					<p className="text-gray-600 mb-4 opacity-70">Nenhum usuário cadastrado ainda</p>
					<button onClick={() => setShowForm(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-colors">
						Criar Primeiro Usuário
					</button>
				</div>
			)}
		</div>
	);
}
