interface RateLimitStore {
	[key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

export function rateLimit(key: string, limit: number = 5, windowMs: number = 15 * 60 * 1000) {
	const now = Date.now();
	const record = store[key];

	if (!record || now > record.resetTime) {
		store[key] = { count: 1, resetTime: now + windowMs };
		return { success: true, remaining: limit - 1 };
	}

	if (record.count >= limit) {
		return { success: false, remaining: 0, retryAfter: Math.ceil((record.resetTime - now) / 1000) };
	}

	record.count++;
	return { success: true, remaining: limit - record.count };
}

setInterval(() => {
	const now = Date.now();
	for (const key in store) {
		if (store[key].resetTime < now) {
			delete store[key];
		}
	}
}, 5 * 60 * 1000);
