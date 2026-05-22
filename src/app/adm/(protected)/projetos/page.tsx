/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getServicoImagensUrls } from "@/lib/cloudinary";
import type { Servico } from "@/types/servico";

export default function ProjetosPage() {
	const [servicos, setServicos] = useState<Servico[]>([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [draggedItem, setDraggedItem] = useState<Servico | null>(null);
	const [formData, setFormData] = useState({
		nome: "",
		valor: "",
		descricao: "",
		resumo: "",
		status_venda: true,
	});
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

	useEffect(() => {
		fetchServicos();
	}, []);

	async function fetchServicos() {
		try {
			setLoading(true);
			const response = await fetch("/api/servicos");
			const data = await response.json();

			if (response.ok) {
				setServicos(data.servicos);
			} else {
				setError(data.error || "Erro ao carregar serviços");
			}
		} catch (err) {
			console.error("Erro:", err);
			setError("Erro ao conectar ao servidor");
		} finally {
			setLoading(false);
		}
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (!formData.nome.trim() || !formData.valor) {
			setError("Nome e valor são obrigatórios");
			return;
		}

		try {
			if (editingId) {
				const updateData: any = {
					nome: formData.nome,
					valor: parseFloat(formData.valor),
					descricao: formData.descricao || undefined,
					resumo: formData.resumo || undefined,
					status_venda: formData.status_venda,
				};

				if (selectedFiles.length > 0) {
					const uploadFormData = new FormData();
					uploadFormData.append("nome", formData.nome);
					selectedFiles.forEach((file) => {
						uploadFormData.append("files", file);
					});

					const uploadResponse = await fetch("/api/servicos/upload", {
						method: "POST",
						body: uploadFormData,
					});

					const uploadData = await uploadResponse.json();

					if (!uploadResponse.ok) {
						setError(uploadData.error || "Erro ao fazer upload das imagens");
						return;
					}

					updateData.caminho_imagens = uploadData.caminho_imagens;
					updateData.quantidade_imagens = uploadData.quantidade_imagens;
				}

				const response = await fetch(`/api/servicos/${editingId}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(updateData),
				});

				const data = await response.json();

				if (!response.ok) {
					setError(data.error || "Erro ao atualizar serviço");
					return;
				}

				setSuccess("Serviço atualizado com sucesso");
				setEditingId(null);
			} else {
				let caminho_imagens = `ebjengenharia/servicos/${formData.nome
					.toLowerCase()
					.replace(/[^\w-]/g, "-")
					.replace(/-+/g, "-")}`;
				let quantidade_imagens = 0;

				if (selectedFiles.length > 0) {
					const uploadFormData = new FormData();
					uploadFormData.append("nome", formData.nome);
					selectedFiles.forEach((file) => {
						uploadFormData.append("files", file);
					});

					const uploadResponse = await fetch("/api/servicos/upload", {
						method: "POST",
						body: uploadFormData,
					});

					const uploadData = await uploadResponse.json();

					if (!uploadResponse.ok) {
						setError(uploadData.error || "Erro ao fazer upload das imagens");
						return;
					}

					caminho_imagens = uploadData.caminho_imagens;
					quantidade_imagens = uploadData.quantidade_imagens;
				}

				const response = await fetch("/api/servicos", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						nome: formData.nome,
						valor: parseFloat(formData.valor),
						descricao: formData.descricao || undefined,
						resumo: formData.resumo || undefined,
						caminho_imagens,
						quantidade_imagens,
						status_venda: formData.status_venda,
					}),
				});

				const data = await response.json();

				if (!response.ok) {
					setError(data.error || "Erro ao criar serviço");
					return;
				}

				setSuccess("Serviço criado com sucesso");
			}

			setFormData({
				nome: "",
				valor: "",
				descricao: "",
				resumo: "",
				status_venda: true,
			});
			setSelectedFiles([]);
			setShowForm(false);
			fetchServicos();
		} catch (err) {
			console.error("Erro:", err);
			setError("Erro ao conectar ao servidor");
		}
	}

	async function handleDelete(id: number) {
		if (!confirm("Tem certeza que deseja deletar este serviço?")) {
			return;
		}

		try {
			const response = await fetch(`/api/servicos/${id}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || "Erro ao deletar serviço");
				return;
			}

			setSuccess("Serviço deletado com sucesso");
			fetchServicos();
		} catch (err) {
			console.error("Erro:", err);
			setError("Erro ao conectar ao servidor");
		}
	}

	function handleEdit(servico: Servico) {
		setFormData({
			nome: servico.nome,
			valor: servico.valor.toString(),
			descricao: servico.descricao || "",
			resumo: servico.resumo || "",
			status_venda: servico.status_venda,
		});
		setSelectedFiles([]);
		setEditingId(servico.id);
		setShowForm(true);
	}

	function handleCancel() {
		setShowForm(false);
		setEditingId(null);
		setFormData({
			nome: "",
			valor: "",
			descricao: "",
			resumo: "",
			status_venda: true,
		});
		setSelectedFiles([]);
		setError("");
		setSuccess("");
	}

	async function handleDragStart(e: React.DragEvent, servico: Servico) {
		setDraggedItem(servico);
		e.dataTransfer!.effectAllowed = "move";
	}

	function handleDragOver(e: React.DragEvent) {
		e.preventDefault();
		e.dataTransfer!.dropEffect = "move";
	}

	async function handleDrop(e: React.DragEvent, targetServico: Servico) {
		e.preventDefault();

		if (!draggedItem || draggedItem.id === targetServico.id) {
			setDraggedItem(null);
			return;
		}

		try {
			const novaLista = [...servicos];
			const draggedIndex = novaLista.findIndex((s) => s.id === draggedItem.id);
			const targetIndex = novaLista.findIndex((s) => s.id === targetServico.id);

			if (draggedIndex !== -1 && targetIndex !== -1) {
				const [itemMovido] = novaLista.splice(draggedIndex, 1);

				novaLista.splice(targetIndex, 0, itemMovido);

				const itensParaReordenar = novaLista.map((s, index) => ({
					id: s.id,
					prioridade: index + 1,
				}));

				const response = await fetch("/api/servicos/reorder", {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ itens: itensParaReordenar }),
				});

				if (response.ok) {
					setSuccess("Ordem atualizada com sucesso");
					fetchServicos();
				} else {
					setError("Erro ao reordenar serviços");
				}
			}
		} catch (err) {
			console.error("Erro:", err);
			setError("Erro ao reordenar");
		} finally {
			setDraggedItem(null);
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
					<p className="mt-4 text-gray-600">Carregando serviços...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">🏗️ Projetos</h1>
					<p className="text-gray-600 mt-1 opacity-70">Total de serviços: {servicos.length}</p>
				</div>
				<button onClick={() => setShowForm(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-colors font-medium">
					+ Novo Projeto
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
					<h2 className="text-xl font-semibold text-gray-900 mb-4">{editingId ? "Editar Serviço" : "Novo Serviço"}</h2>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
							<input type="text" required value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Nome do serviço/imóvel" />
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
							<input type="number" step="0.01" min="0" required value={formData.valor} onChange={(e) => setFormData({ ...formData, valor: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0.00" />
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Resumo</label>
							<input type="text" value={formData.resumo} onChange={(e) => setFormData({ ...formData, resumo: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Resumo breve do serviço" />
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
							<textarea value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Descrição detalhada do serviço" rows={3} />
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Imagens</label>
							<input 
								type="file" 
								multiple 
								accept="image/*" 
								onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))} 
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
								placeholder="Selecione as imagens" 
							/>
							<p className="text-xs text-gray-500 mt-1">
								{selectedFiles.length} {selectedFiles.length === 1 ? "imagem selecionada" : "imagens selecionadas"}
							</p>
							{selectedFiles.length > 0 && (
								<div className="grid grid-cols-3 gap-2 mt-3">
									{selectedFiles.map((file, idx) => (
										<div key={idx} className="text-center">
											<div className="bg-gray-100 p-2 rounded text-xs">{file.name.substring(0, 15)}...</div>
										</div>
									))}
								</div>
							)}
						</div>

						<div className="flex items-center">
							<input type="checkbox" id="status_venda" checked={formData.status_venda} onChange={(e) => setFormData({ ...formData, status_venda: e.target.checked })} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
							<label htmlFor="status_venda" className="ml-2 block text-sm text-gray-700">
								Disponível para venda
							</label>
						</div>

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

			{/* Serviços Grid com Drag and Drop */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{servicos.map((servico) => {
					const imagensUrls = getServicoImagensUrls(servico.caminho_imagens, servico.quantidade_imagens);
					const primeiraImagem = imagensUrls[0] || "/placeholder.svg";

					return (
						<div key={servico.id} draggable onDragStart={(e) => handleDragStart(e, servico)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, servico)} className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden cursor-move ${draggedItem?.id === servico.id ? "opacity-50" : ""}`}>
							{/* Imagem */}
							<div className="relative h-48 bg-gray-200 overflow-hidden">
								<Image
									src={primeiraImagem}
									alt={servico.nome}
                                width={400}
                                height={300}
								className="w-full h-full object-cover"
								onError={(e) => {
									(e.target as HTMLImageElement).src = "/placeholder.svg";
									}}
								/>
								<div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">Prioridade: {servico.prioridade}</div>
								{!servico.status_venda && (
									<div className="absolute inset-0 bg-red-600 bg-opacity-30 flex items-center justify-center">
										<span className="text-white font-bold text-lg">VENDIDO</span>
									</div>
								)}
							</div>

							{/* Conteúdo */}
							<div className="p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-2">{servico.nome}</h3>

								{servico.resumo && <p className="text-gray-600 text-sm mb-3">{servico.resumo}</p>}

								<div className="flex items-center justify-between mb-4">
									<span className="text-2xl font-bold text-blue-600">R$ {servico.valor.toLocaleString("pt-BR")}</span>
									<span className={`px-2 py-1 rounded text-xs font-semibold ${servico.status_venda ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{servico.status_venda ? "✓ Disponível" : "✗ Vendido"}</span>
								</div>

								{servico.descricao && <p className="text-gray-600 text-sm mb-4 line-clamp-2">{servico.descricao}</p>}

								{servico.quantidade_imagens > 0 && (
									<p className="text-gray-500 text-xs mb-4">
										📸 {servico.quantidade_imagens} {servico.quantidade_imagens === 1 ? "imagem" : "imagens"}
									</p>
								)}

								{/* Datas */}
								<div className="text-xs text-gray-400 mb-4 space-y-1">
									<p>Criado: {new Date(servico.criado_em).toLocaleDateString("pt-BR")}</p>
									{new Date(servico.atualizado_em).getTime() !== new Date(servico.criado_em).getTime() && <p>Atualizado: {new Date(servico.atualizado_em).toLocaleDateString("pt-BR")}</p>}
								</div>

								{/* Ações */}
								<div className="flex gap-2">
									<button onClick={() => handleEdit(servico)} className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:opacity-80 transition-colors font-medium text-sm">
										✏️ Editar
									</button>
									<button onClick={() => handleDelete(servico.id)} className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded hover:opacity-80 transition-colors font-medium text-sm">
										🗑️ Deletar
									</button>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Estado vazio */}
			{servicos.length === 0 && !showForm && (
				<div className="text-center py-12 bg-gray-50 rounded-lg">
					<span className="text-4xl mb-4 block">📋</span>
					<p className="text-gray-600 mb-4 opacity-70">Nenhum serviço cadastrado ainda</p>
					<button onClick={() => setShowForm(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-colors">
						Criar Primeiro Serviço
					</button>
				</div>
			)}

			{/* Instruções de Drag & Drop */}
			{servicos.length > 0 && <div className="text-center py-4 text-gray-500 text-sm">💡 Dica: Arraste os cards para reorganizar a prioridade</div>}
		</div>
	);
}
