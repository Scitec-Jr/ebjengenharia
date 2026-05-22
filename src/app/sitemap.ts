/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/servicos`);
	const data = await response.json();

	const servicosRoutes = (data.servicos || []).map((servico: any) => ({
		url: `https://ebjengenharia.com.br/projetos/${servico.slug}`,
		lastModified: new Date(servico.atualizado_em),
		changeFrequency: "monthly" as const,
		priority: 0.8,
	}));

	return [
		{
			url: "https://ebjengenharia.com.br",
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 1,
		},
		{
			url: "https://ebjengenharia.com.br/nossa-equipe",
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.8,
		},
		...servicosRoutes,
	];
}
