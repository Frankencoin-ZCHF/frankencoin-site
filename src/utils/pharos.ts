export type PharosDimensionKey = "pegStability" | "liquidity" | "resilience" | "decentralization" | "dependencyRisk";

export type PharosDimensionRating = {
	grade: string;
	score: number | null;
	detail: string;
};

export type PharosRating = {
	id: string;
	name: string;
	symbol: string;
	overallGrade: string;
	overallScore: number | null;
	methodologyVersion: string | null;
	updatedAt: number | null;
	dimensions: Record<PharosDimensionKey, PharosDimensionRating>;
};

const STABLECOIN_ID = "zchf-frankencoin";
const DIMENSION_KEYS: PharosDimensionKey[] = ["pegStability", "liquidity", "resilience", "decentralization", "dependencyRisk"];

let _cache: { data: PharosRating; expiresAt: number } | null = null;

export async function fetchPharosRating(): Promise<PharosRating | null> {
	const now = Date.now();
	if (_cache && now < _cache.expiresAt) return _cache.data;

	const apiKey = import.meta.env.PHAROS_API_KEY as string | undefined;
	if (!apiKey || apiKey === '...') return null;

	const baseUrl = (import.meta.env.PHAROS_API_URL as string | undefined) ?? 'https://api.pharos.watch';

	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 8000);
		const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/report-cards`, {
			headers: { 'X-API-Key': apiKey, accept: 'application/json' },
			signal: controller.signal,
		});
		clearTimeout(timeout);
		if (!res.ok) return null;
		const body = await res.json() as unknown;
		const rating = parsePharosRating(body);
		if (!rating) return null;
		_cache = { data: rating, expiresAt: now + 60 * 60 * 1000 }; // 1h TTL
		return rating;
	} catch {
		return null;
	}
}

function isRecord(v: unknown): v is Record<string, unknown> {
	return typeof v === 'object' && v !== null;
}

function strOrNull(v: unknown): string | null {
	return typeof v === 'string' && v ? v : null;
}

function numOrNull(v: unknown): number | null {
	return typeof v === 'number' && isFinite(v) ? v : null;
}

function parsePharosRating(body: unknown): PharosRating | null {
	if (!isRecord(body) || !Array.isArray(body.cards)) return null;
	const card = body.cards.find((c: unknown) => isRecord(c) && c.id === STABLECOIN_ID);
	if (!isRecord(card) || !isRecord(card.dimensions)) return null;

	const dimensions = DIMENSION_KEYS.reduce((acc, key) => {
		const d = (card.dimensions as Record<string, unknown>)[key];
		acc[key] = isRecord(d)
			? { grade: strOrNull(d.grade) ?? 'NR', score: numOrNull(d.score), detail: strOrNull(d.detail) ?? 'Dimension unavailable' }
			: { grade: 'NR', score: null, detail: 'Dimension unavailable' };
		return acc;
	}, {} as Record<PharosDimensionKey, PharosDimensionRating>);

	const methodology = isRecord(body.methodology) ? body.methodology : null;

	return {
		id: STABLECOIN_ID,
		name: strOrNull(card.name) ?? 'Frankencoin',
		symbol: strOrNull(card.symbol) ?? 'ZCHF',
		overallGrade: strOrNull(card.overallGrade) ?? 'NR',
		overallScore: numOrNull(card.overallScore),
		methodologyVersion: methodology ? strOrNull(methodology.version) : null,
		updatedAt: numOrNull(body.updatedAt),
		dimensions,
	};
}
