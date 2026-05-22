"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeaderAdm from "@/components/HeaderAdm";

interface User {
	userId: number;
	nome: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		async function checkAuth() {
			console.log("aqui2");
			try {
				const response = await fetch("/api/user/verify");
				const data = await response.json();

				if (response.ok) {
					setUser(data.user);
				} else {
					router.push("/adm/login");
				}
			} catch (err) {
				console.log(err);
				router.push("/adm/login");
			} finally {
				setLoading(false);
			}
		}

		checkAuth();
	}, [router]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-50">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
					<p className="mt-4 text-gray-600">Carregando...</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<HeaderAdm userName={user.nome} />
			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">{children}</div>
			</main>
		</div>
	);
}
