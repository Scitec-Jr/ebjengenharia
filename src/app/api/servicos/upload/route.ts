/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { generateSlug } from "@/lib/slug";
import { corsHeaders, handleCorsPreFlight } from "@/lib/cors";

cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function OPTIONS(request: NextRequest) {
	return handleCorsPreFlight(request);
}

export async function POST(request: NextRequest) {
	try {
		const contentType = request.headers.get('content-type') || '';
		if (!contentType.includes('multipart/form-data')) {
			return NextResponse.json({ error: "Content-Type deve ser multipart/form-data" }, { status: 400 });
		}

		const formData = await request.formData();
		const nome = formData.get("nome") as string;
		const files = formData.getAll("files") as File[];

		if (!nome || files.length === 0) {
			return NextResponse.json({ error: "Nome e pelo menos uma imagem são obrigatórios" }, { status: 400 });
		}

		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
		for (const file of files) {
			if (!allowedTypes.includes(file.type)) {
				return NextResponse.json({ error: `Tipo de arquivo não permitido: ${file.type}` }, { status: 400 });
			}
			if (file.size > 10 * 1024 * 1024) {
				return NextResponse.json({ error: `Arquivo ${file.name} excede 10MB` }, { status: 400 });
			}
		}

		const slug = generateSlug(nome);
		const pastaBase = `ebjengenharia/servicos/${slug}`;

		const uploadPromises = files.map(async (file, index) => {
			const buffer = await file.arrayBuffer();

			return new Promise((resolve, reject) => {
				const uploadStream = cloudinary.uploader.upload_stream(
					{
						folder: pastaBase,
						public_id: (index + 1).toString(),
						resource_type: "auto",
						overwrite: true,
					},
					(error: any, result: any) => {
						if (error) reject(error);
						else resolve(result);
					},
				);

				uploadStream.end(Buffer.from(buffer));
			});
		});

		await Promise.all(uploadPromises);

		const response = NextResponse.json(
			{
				message: "Imagens enviadas com sucesso",
				caminho_imagens: pastaBase,
				quantidade_imagens: files.length,
			},
			{ status: 200 },
		);

		const headers = corsHeaders(request);
		headers.forEach((value, key) => response.headers.set(key, value));

		return response;
	} catch (error) {
		console.error("Erro ao fazer upload:", error);
		return NextResponse.json({ error: "Erro ao fazer upload das imagens" }, { status: 500 });
	}
}
