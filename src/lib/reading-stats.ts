/**
 * Reading stats derived from a post's structured data (the same text fumadocs
 * extracts for search indexing). Reading `structuredData` keeps this runtime-safe:
 * it works at build time during SSG and on the Cloudflare Worker alike, with no
 * filesystem access.
 *
 * Word count blends CJK characters (1 char ≈ 1 unit) with Latin word groups so a
 * bilingual post reads sensibly. Reading time assumes ~350 CJK chars/min and
 * ~200 Latin words/min.
 */
type StructuredDataLike = {
	headings: { content: string }[];
	contents: { content: string }[];
};

export interface ReadingStats {
	/** Combined word/character count, mirroring the "字" metric on most CJK blogs. */
	words: number;
	/** Estimated reading time in minutes (at least 1). */
	minutes: number;
}

const CJK = /[㐀-鿿豈-﫿぀-ヿ]/g;
const LATIN_WORD = /[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g;

export function getReadingStats(
	structuredData: StructuredDataLike,
): ReadingStats {
	const text = [
		...structuredData.headings.map((h) => h.content),
		...structuredData.contents.map((c) => c.content),
	].join(" ");

	const cjk = (text.match(CJK) ?? []).length;
	const latin = (text.match(LATIN_WORD) ?? []).length;

	return {
		words: cjk + latin,
		minutes: Math.max(1, Math.round(cjk / 350 + latin / 200)),
	};
}
