"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getServicoImagensUrls } from "@/lib/cloudinary";
import type { Servico } from "@/types/servico";

interface CarrosselNossosServicosProps {
	leftArrowSrc?: string;
	rightArrowSrc?: string;
	showDots?: boolean;
	align?: "start" | "center" | "end";
}

export default function Carrossel_Nossos_Servicos({
	leftArrowSrc = "/assets/icons/seta_esquerda.png",
	rightArrowSrc = "/assets/icons/seta_direita.png",
	showDots = true,
	align = "center",
}: CarrosselNossosServicosProps) {
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align });
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [servicos, setServicos] = useState<Servico[]>([]);
	const [loading, setLoading] = useState(true);
	const [titulo, setTitulo] = useState("Imóveis a venda");

	useEffect(() => {
		fetchServicos();
	}, []);

	async function fetchServicos() {
		try {
			const response = await fetch("/api/servicos");
			const data = await response.json();

			if (response.ok && data.servicos) {
				const imoveisVenda = data.servicos.filter((s: Servico) => s.status_venda);

				if (imoveisVenda.length > 0) {
					setServicos(imoveisVenda);
					setTitulo("Imóveis a venda");
				} else {
					setServicos(data.servicos);
					setTitulo("Confira nossos imóveis");
				}
			}
		} catch (error) {
			console.error("Erro ao carregar serviços:", error);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		if (!emblaApi) return;

		const onSelect = () => {
			setSelectedIndex(emblaApi.selectedScrollSnap());
		};

		emblaApi.on("select", onSelect);
		onSelect();

		return () => {
			emblaApi.off("select", onSelect);
		};
	}, [emblaApi]);

	function getPrimeiraImagem(servico: Servico): string {
		const urls = getServicoImagensUrls(servico.caminho_imagens, servico.quantidade_imagens, servico.atualizado_em);
		return urls.length > 0 ? urls[0] : "/placeholder.jpg";
	}

	const scrollSnaps = emblaApi?.scrollSnapList() ?? [];

	if (loading) {
		return (
			<div className="relative w-full px-6 h-64 flex items-center justify-center">
				<p className="text-white">Carregando...</p>
			</div>
		);
	}

	if (servicos.length === 0) {
		return (
			<div className="relative w-full px-6 h-64 flex items-center justify-center">
				<p className="text-white">Nenhum imóvel disponível</p>
			</div>
		);
	}

	return (
		<div className="w-full">
			<h2 className="mb-4 text-3xl text-white">{titulo}</h2>

			<div className="relative w-full px-6">
				<div ref={emblaRef} className="overflow-hidden">
					<div className="flex">
						{servicos.map((servico) => (
							<div key={servico.id} className="relative min-w-full">
								<Link href={`/projetos/${servico.slug}`}>
									<Image
										src={getPrimeiraImagem(servico)}
										alt={servico.nome}
										width={1200}
										height={400}
										className="w-full h-full object-cover"
									/>
								</Link>

								<div className="absolute bottom-4 left-2 px-4 py-2 bg-(--secondary-color) text-white">
									<h3>{servico.nome}</h3>
								</div>
							</div>
						))}
					</div>
				</div>

				<button
					onClick={() => emblaApi?.scrollPrev()}
					className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer"
					aria-label="Previous slide"
				>
					<Image src={leftArrowSrc} alt="Previous" width={10} height={10} />
				</button>

				<button
					onClick={() => emblaApi?.scrollNext()}
					className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
					aria-label="Next slide"
				>
					<Image src={rightArrowSrc} alt="Next" width={10} height={10} />
				</button>

				{showDots && (
					<div className="mt-4 flex justify-center gap-2">
						{scrollSnaps.map((_, index) => (
							<button
								key={index}
								onClick={() => emblaApi?.scrollTo(index)}
								className={`
									h-2 w-2 rounded-full transition cursor-pointer
									${index === selectedIndex ? "bg-(--secondary-color)" : "bg-zinc-400"}
								`}
								aria-label={`Go to slide ${index + 1}`}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
