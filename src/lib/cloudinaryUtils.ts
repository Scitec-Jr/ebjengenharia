/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteCloudinaryFolder(pastaPath: string): Promise<void> {
	try {
		const resources = await cloudinary.api.resources({
			type: "upload",
			prefix: pastaPath,
			max_results: 500,
		});


		if (!resources.resources || resources.resources.length === 0) {
			return;
		}

		const deletePromises = resources.resources.map((resource: any) =>
			cloudinary.uploader.destroy(resource.public_id)
		);

		await Promise.all(deletePromises);

		if (resources.next_cursor) {
			const moreResources = await cloudinary.api.resources({
				type: "upload",
				prefix: pastaPath,
				max_results: 500,
				next_cursor: resources.next_cursor,
			});

			if (moreResources.resources && moreResources.resources.length > 0) {
				const deleteMorePromises = moreResources.resources.map((resource: any) =>
					cloudinary.uploader.destroy(resource.public_id)
				);
				await Promise.all(deleteMorePromises);
			}
		}
	} catch (error) {
		console.error(`Erro ao deletar pasta do Cloudinary (${pastaPath}):`, error);
	}
}

export async function deleteCloudinaryFile(publicId: string): Promise<void> {
	try {
		await cloudinary.uploader.destroy(publicId);
	} catch (error) {
		console.error(`Erro ao deletar arquivo do Cloudinary (${publicId}):`, error);
	}
}
