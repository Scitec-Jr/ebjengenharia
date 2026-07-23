import type { Metadata } from "next";
import ProjetoDetail from "@/components/Projetos/ProjetoDetail";
import ProjetoError from "@/components/Projetos/ProjetoError";
import { getServicoImagensUrls } from "@/lib/cloudinary";
import type { Servico } from "@/types/servico";

async function fetchServicos() {
	try {
		const response = await fetch("http://ebjengenharia.com.br/api/servicos", {
			next: {
				revalidate: 60,
				tags: ["servicos"],
			},
		});

		if (!response.ok) {
			throw new Error("Erro ao buscar serviços");
		}

		const data = await response.json();
		return data.servicos || [];
	} catch (error) {
		console.error("Erro ao buscar serviços:", error);
		return [];
	}
}

export async function generateMetadata(
	{ params }: { params: Promise<{ projetos: string }> }
): Promise<Metadata> {
	try {
		const { projetos: slug } = await params;
		const servicos = await fetchServicos();
		const servico = servicos.find((s: Servico) => s.slug === slug);

		if (!servico) {
			return {
				title: "Projeto não encontrado",
				description: "O projeto solicitado não foi encontrado",
			};
		}

		const primeiraImagem =
			getServicoImagensUrls(servico.caminho_imagens, servico.quantidade_imagens, servico.atualizado_em)[0] ||
			"/og-image.jpg";

		return {
			title: `${servico.nome} - Projetos EBJ Engenharia`,
			description:
				servico.resumo || servico.descricao?.substring(0, 160) || "Confira este projeto da EBJ Engenharia",
			metadataBase: new URL("https://ebjengenharia.com.br"),
			openGraph: {
				title: servico.nome,
				description: servico.resumo || servico.descricao,
				url: `https://ebjengenharia.com.br/projetos/${slug}`,
				images: [
					{
						url: primeiraImagem,
						width: 1200,
						height: 630,
						alt: servico.nome,
					},
				],
				type: "article",
			},
			twitter: {
				card: "summary_large_image",
				title: servico.nome,
				description: servico.resumo || servico.descricao,
				images: [primeiraImagem],
			},
		};
	} catch (error) {
		console.error("Erro ao gerar metadados:", error);
		return {
			title: "Projeto - EBJ Engenharia",
			description: "Confira nossos projetos",
		};
	}
}

interface ProjetoPageProps {
	params: Promise<{ projetos: string }>;
}

export default async function Projeto({ params }: ProjetoPageProps) {
	let servico: Servico | undefined;
	let errorMessage: string | null = null;

	try {
		const { projetos: slug } = await params;
		const servicos = await fetchServicos();
		servico = servicos.find((s: Servico) => s.slug === slug);

		if (!servico) {
			errorMessage = "Projeto não encontrado";
		}
	} catch (error) {
		console.error("Erro:", error);
		errorMessage = "Erro ao carregar projeto";
	}

	if (errorMessage || !servico) {
		return (
			<main className="pt-4">
				<section className="max-w-440 mx-auto">
					<div className="px-4 md:px-8 lg:px-16">
						<ProjetoError error={errorMessage || "Erro ao carregar projeto"} />
					</div>
				</section>
			</main>
		);
	}

	return (
		<main className="pt-4">
			<section className="max-w-440 mx-auto">
				<div className="px-4 md:px-8 lg:px-16">
					<ProjetoDetail servico={servico} />
				</div>
			</section>
		</main>
	);
}
