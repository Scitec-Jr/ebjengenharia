"use client";

import Image from "next/image";
import Link from "next/link";

interface ProjetoErrorProps {
	error: string;
}

export default function ProjetoError({ error }: ProjetoErrorProps) {
	return (
		<>
			<Link href={"/"} className="flex items-center gap-4 mb-4">
				<Image src={"/assets/icons/voltar.png"} alt="Voltar" width={30} height={30} />
				<span>Voltar</span>
			</Link>
			<div className="text-center py-12">
				<p className="text-gray-600 mb-4">{error}</p>
				<Link href={"/"} className="text-blue-600 hover:underline">
					Voltar para home
				</Link>
			</div>
		</>
	);
}
