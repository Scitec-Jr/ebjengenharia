export function getCloudinaryUrl(
	publicId: string,
	options?: {
		width?: number;
		height?: number;
		crop?: string;
		quality?: string;
		format?: string;
		version?: number | string;
	},
): string {
	const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

	if (!cloudName) {
		console.error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME não configurado");
		return "/placeholder.jpg";
	}

	const transformations: string[] = [];
	if (options?.width) transformations.push(`w_${options.width}`);
	if (options?.height) transformations.push(`h_${options.height}`);
	if (options?.crop) transformations.push(`c_${options.crop}`);
	if (options?.quality) transformations.push(`q_${options.quality}`);
	if (options?.format) transformations.push(`f_${options.format}`);

	const transformationString = transformations.length > 0 ? `/${transformations.join(",")}` : "";
	const versionParam = options?.version ? `?v=${options.version}` : "";

	return `https://res.cloudinary.com/${cloudName}/image/upload${transformationString}/${publicId}${versionParam}`;
}

export function getServicoImagensUrls(caminhoPasta: string, quantidade: number, atualizado_em?: string): string[] {
	const urls: string[] = [];
	const version = atualizado_em ? new Date(atualizado_em).getTime() : undefined;

	for (let i = 1; i <= quantidade; i++) {
		const publicId = `${caminhoPasta}/${i}`;
		urls.push(
			getCloudinaryUrl(publicId, {
				quality: "auto",
				format: "auto",
				version,
			}),
		);
	}

	return urls;
}

export function extractPublicId(cloudinaryUrl: string): string {
	const matches = cloudinaryUrl.match(/\/([^/]+)\/([^/]+)$/);
	if (matches) {
		return `${matches[1]}/${matches[2]}`;
	}
	return cloudinaryUrl;
}
