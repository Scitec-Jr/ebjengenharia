import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [
	'https://ebjengenharia.com.br',
	'https://www.ebjengenharia.com.br',
	'http://localhost:3000',
];

export function corsHeaders(request: NextRequest) {
	const origin = request.headers.get('origin') || '';

	const isAllowedOrigin = ALLOWED_ORIGINS.some(allowed => {
		if (allowed === '*') return true;
		return allowed === origin;
	});

	const headers = new Headers();

	if (isAllowedOrigin) {
		headers.set('Access-Control-Allow-Origin', origin);
	}

	headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	headers.set('Access-Control-Max-Age', '86400');
	headers.set('Access-Control-Allow-Credentials', 'true');

	return headers;
}

export function handleCorsPreFlight(request: NextRequest) {
	if (request.method === 'OPTIONS') {
		const headers = corsHeaders(request);
		return new NextResponse(null, { headers });
	}
}
