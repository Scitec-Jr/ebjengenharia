import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
	process.env.JWT_SECRET || ""
);

export async function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	const method = request.method;

	if (
		pathname.startsWith("/api/servicos") ||
		pathname.startsWith("/api/user")
	) {
		if (
			pathname.startsWith("/api/servicos") &&
			method === "GET"
		) {
			return NextResponse.next();
		}

		if (
			pathname.startsWith("/api/user/verify") &&
			method === "GET"
		) {
			return NextResponse.next();
		}

		const token = request.cookies.get("auth-token")?.value;

		if (!token) {
			return NextResponse.json(
				{ error: "Token não fornecido" },
				{ status: 401 }
			);
		}

		try {
			await jwtVerify(token, JWT_SECRET);
			return NextResponse.next();
		} catch {
			return NextResponse.json(
				{ error: "Token inválido ou expirado" },
				{ status: 401 }
			);
		}
	}

	if (
		pathname.startsWith("/adm") &&
		!pathname.startsWith("/adm/login")
	) {
		const token = request.cookies.get("auth-token")?.value;

		if (!token) {
			return NextResponse.redirect(
				new URL("/adm/login", request.url)
			);
		}

		try {
			await jwtVerify(token, JWT_SECRET);
		} catch {
			return NextResponse.redirect(
				new URL("/adm/login", request.url)
			);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/api/:path*",
		"/adm/:path*",
	],
};