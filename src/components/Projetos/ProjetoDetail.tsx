"use client";

import Image from "next/image";
import Link from "next/link";
import Carrossel_Projetos from "@/components/Projetos/Carrossel";
import { getServicoImagensUrls } from "@/lib/cloudinary";
import type { Servico } from "@/types/servico";

interface ProjetoDetailProps {
	servico: Servico;
}

export default function ProjetoDetail({ servico }: ProjetoDetailProps) {
	function dividirResumo(resumo: string): string[] {
		return resumo
			.split(";")
			.map((item) => item.trim())
			.filter((item) => item.length > 0);
	}

	function getImagensCarrossel(): string[] {
		return getServicoImagensUrls(servico.caminho_imagens, servico.quantidade_imagens, servico.atualizado_em);
	}

	function formatarValor(valor: number): string {
		return new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(valor);
	}

	return (
		<>
			<Link href={"/"} className="flex items-center gap-4">
				<Image src={"/assets/icons/voltar.png"} alt="Voltar" width={30} height={30} />
				<span>Voltar</span>
			</Link>

			<div className="flex flex-col-reverse md:flex-row gap-8 px-4 py-8">
				<div className="flex-1">
					<Carrossel_Projetos imagens={getImagensCarrossel()}></Carrossel_Projetos>
				</div>

				<div className="flex-1">
					<h1 className="w-fit mb-4 p-4 bg-(--secondary-color) text-white text-xl">{servico.nome}</h1>

					<p className="mb-4">{servico.descricao}</p>

					{servico.resumo && (
						<ul className="mb-4 list-disc list-inside">
							{dividirResumo(servico.resumo).map((item, index) => (
								<li key={index}>{item}</li>
							))}
						</ul>
					)}

					<div className="flex items-end justify-between">
						{servico.status_venda && (
							<div>
								<h2 className="mb-4 text-2xl text-(--secondary-color)">
									À venda por:
								</h2>
						
								<span className="block w-fit px-4 py-2 bg-(--secondary-color) text-2xl text-white">
									{formatarValor(servico.valor)}
								</span>
							</div>
						)}

						<p>Entre em contato</p>

						<a href="https://wa.me/5519999576107" target="_blank" rel="noopener noreferrer">
							<Image src={"/assets/icons/whatsapp.png"} alt="Whatsapp" width={30} height={30} />
						</a>

						<a href="mailto:ebjengenharia28@gmail.com" target="_blank" rel="noopener noreferrer">
							<Image src={"/assets/icons/email_colorido.png"} alt="Email" width={30} height={30} />
						</a>
					</div>
				</div>
			</div>
		</>
	);
}
