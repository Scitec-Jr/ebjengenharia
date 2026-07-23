"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getServicoImagensUrls } from "@/lib/cloudinary";
import type { Servico } from "@/types/servico";

export default function Nossos_servicos() {
	const [servicos, setServicos] = useState<Servico[]>([]);
	const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);
	const [loading, setLoading] = useState(true);
	const [imagemAtualIndex, setImagemAtualIndex] = useState<Record<number, number>>({});
	const [isHoveringCarrossel, setIsHoveringCarrossel] = useState(false);
	const [imagemTransicionando, setImagemTransicionando] = useState(false);

	useEffect(() => {
		fetchServicos();
	}, []);

	async function fetchServicos() {
		try {
			const response = await fetch("/api/servicos");
			const data = await response.json();

			if (response.ok && data.servicos) {
				setServicos(data.servicos);
				if (data.servicos.length > 0) {
					setServicoSelecionado(data.servicos[0]);
				}
			}
		} catch (error) {
			console.error("Erro ao carregar serviços:", error);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		if (!isHoveringCarrossel || !servicoSelecionado) return;

		const interval = setInterval(() => {
			setImagemTransicionando(true);

			setTimeout(() => {
				setImagemAtualIndex((prev) => {
					const quantidadeImagens = servicoSelecionado.quantidade_imagens;
					const indexAtual = prev[servicoSelecionado.id] || 0;
					return {
						...prev,
						[servicoSelecionado.id]: (indexAtual + 1) % quantidadeImagens,
					};
				});
				setImagemTransicionando(false);
			}, 350);
		}, 1500);

		return () => clearInterval(interval);
	}, [isHoveringCarrossel, servicoSelecionado]);

	function getImagemUrl(caminho_imagens: string, quantidade_imagens: number, servico_id: number, atualizado_em: string): string {
		const index = imagemAtualIndex[servico_id] || 0;
		const urls = getServicoImagensUrls(caminho_imagens, quantidade_imagens, atualizado_em);
		return urls.length > 0 ? urls[index] : "/placeholder.jpg";
	}

	function dividirResumo(resumo: string): string[] {
		return resumo
			.split(";")
			.map((item) => item.trim())
			.filter((item) => item.length > 0);
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-(--main-color) px-4 py-8">
				<p className="text-white">Carregando serviços...</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col md:flex-row gap-8 md:gap-4 bg-(--main-color) px-4 py-8">
			<div className="flex flex-col gap-4 flex-1 max-h-104 text-center overflow-y-scroll">
				{servicos.map((servico) => (
					<button
						key={servico.id}
						onClick={() => setServicoSelecionado(servico)}
						className={`w-full py-4 rounded transition-colors ${
							servicoSelecionado?.id === servico.id
								? "bg-(--secondary-color) text-white"
								: "bg-white text-gray-900 hover:bg-gray-100"
						}`}
					>
						{servico.nome}
					</button>
				))}
			</div>

			{servicoSelecionado && (
				<div className="flex-1 text-white">
					<div
						className="relative overflow-hidden rounded-lg mb-4"
						onMouseEnter={() => setIsHoveringCarrossel(true)}
						onMouseLeave={() => setIsHoveringCarrossel(false)}
					>
						<Image
							src={getImagemUrl(servicoSelecionado.caminho_imagens, servicoSelecionado.quantidade_imagens, servicoSelecionado.id, servicoSelecionado.atualizado_em)}
							alt={servicoSelecionado.nome}
							width={200}
							height={150}
							className={`w-full transition-opacity duration-700 max-h-60 ${
								imagemTransicionando ? "opacity-0" : "opacity-100"
							}`}
						/>
					</div>

					<ul className="mb-4 text-center">
						{servicoSelecionado.resumo &&
							dividirResumo(servicoSelecionado.resumo).map((item, index) => (
								<li key={index}>{item}</li>
							))}
					</ul>

					<Link
						href={`/projetos/${servicoSelecionado.slug}`}
						className="block w-fit mx-auto px-4 py-2 bg-(--secondary-color) rounded-full text-white"
					>
						Saiba mais
					</Link>
				</div>
			)}
		</div>
	);
}
