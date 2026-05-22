import crypto from 'crypto';

const csrfTokens = new Map<string, { token: string; createdAt: number }>();

const TOKEN_EXPIRY = 1 * 60 * 60 * 1000;

setInterval(() => {
	const now = Date.now();
	for (const [key, value] of csrfTokens.entries()) {
		if (now - value.createdAt > TOKEN_EXPIRY) {
			csrfTokens.delete(key);
		}
	}
}, 30 * 60 * 1000);

export function generateCsrfToken(sessionId: string): string {
	const token = crypto.randomBytes(32).toString('hex');
	csrfTokens.set(sessionId, { token, createdAt: Date.now() });
	return token;
}

export function verifyCsrfToken(sessionId: string, token: string): boolean {
	const stored = csrfTokens.get(sessionId);
	
	if (!stored) {
		return false;
	}

	const now = Date.now();
	if (now - stored.createdAt > TOKEN_EXPIRY) {
		csrfTokens.delete(sessionId);
		return false;
	}

	return stored.token === token;
}
