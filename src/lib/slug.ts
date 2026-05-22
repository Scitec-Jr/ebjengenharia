export function generateSlug(nome: string): string {
	return (
		nome
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLowerCase()
			.replace(/[^\w-]+/g, "-")
			.replace(/-+/g, "-")
			.replace(/^-+|-+$/g, "")
	);
}
