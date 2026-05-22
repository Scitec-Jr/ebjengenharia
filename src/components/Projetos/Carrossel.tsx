"use client";

import Image from "next/image";
import { useState } from "react";

interface CarrosselProjetosProps {
	imagens: string[];
}

export default function Carrossel_Projetos({ imagens }: CarrosselProjetosProps) {
	const [imagemAtual, setImagemAtual] = useState(0);
	const [posicaoMiniCarrossel, setPosicaoMiniCarrossel] = useState(0);

	if (!imagens || imagens.length === 0) {
		return (
			<div className="w-full bg-gray-200 rounded-lg flex items-center justify-center h-75">
				<p className="text-gray-600">Nenhuma imagem disponível</p>
			</div>
		);
	}

	const proximaImagem = () => {
		const novaPos = (imagemAtual + 1) % imagens.length;
		setImagemAtual(novaPos);
		atualizarPosicaoMiniCarrossel(novaPos);
	};

	const imagemAnterior = () => {
		const novaPos = (imagemAtual - 1 + imagens.length) % imagens.length;
		setImagemAtual(novaPos);
		atualizarPosicaoMiniCarrossel(novaPos);
	};

	const atualizarPosicaoMiniCarrossel = (indice: number) => {
		const tamMiniCarrossel = 4;
		const novaPos = Math.max(0, Math.min(indice - 1, imagens.length - tamMiniCarrossel));
		setPosicaoMiniCarrossel(novaPos);
	};

	const selecionarImagem = (indice: number) => {
		setImagemAtual(indice);
	};

	return (
		<div className="w-full">
			<div className="mb-6 overflow-hidden rounded-lg">
				<Image
					src={imagens[imagemAtual]}
					alt={`Imagem ${imagemAtual + 1}`}
					width={500}
					height={300}
					className="w-full h-75 object-cover"
					priority
				/>
			</div>

			<div className="flex items-center gap-2">
				<button
					onClick={imagemAnterior}
					className="shrink-0 text-2xl text-gray-600 hover:text-gray-800 transition"
					aria-label="Imagem anterior"
				>
					‹
				</button>

				<div className="flex-1 overflow-hidden rounded-lg">
					<div
						className="flex gap-2 transition-transform duration-300"
						style={{
							transform: `translateX(-${posicaoMiniCarrossel * 160}px)`,
						}}
					>
						{imagens.map((img, indice) => (
							<button
								key={indice}
								onClick={() => {
									selecionarImagem(indice);
									atualizarPosicaoMiniCarrossel(indice);
								}}
								className={`shrink-0 rounded overflow-hidden transition-all border-2 ${
									imagemAtual === indice
										? "border-blue-500 scale-105"
										: "border-transparent opacity-70 hover:opacity-100"
								}`}
							>
								<Image
									src={img}
									alt={`Thumbnail ${indice + 1}`}
									width={150}
									height={100}
									className="w-37.5 h-25 object-cover"
								/>
							</button>
						))}
					</div>
				</div>

				<button
					onClick={proximaImagem}
					className="shrink-0 text-2xl text-gray-600 hover:text-gray-800 transition"
					aria-label="Próxima imagem"
				>
					›
				</button>
			</div>
		</div>
	);
}
