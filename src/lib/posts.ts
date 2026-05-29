import { getReadingStats, type ReadingStats } from "@/lib/reading-stats";
import { blogs as allBlogs } from "@/source";

export type BlogPost = (typeof allBlogs)[number];

const posts = Array.from(allBlogs);

/** Every post across all locales (used for static param generation). */
export function getAllPosts(): BlogPost[] {
	return posts;
}

/** All posts for a locale, newest first. */
export function getPostsByLocale(locale: string): BlogPost[] {
	return posts
		.filter((post) => post.locale === locale)
		.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getPostBySlug(slug: string, locale: string): BlogPost | null {
	return (
		posts.find((post) => post.slug === slug && post.locale === locale) ?? null
	);
}

export function postStats(post: BlogPost): ReadingStats {
	return getReadingStats(post.structuredData);
}

export interface SearchEntry {
	slug: string;
	title: string;
	description: string;
	tags: string[];
	headings: string[];
	date: string;
}

/** Lightweight, serializable index handed to the client-side search dialog. */
export function getSearchIndex(locale: string): SearchEntry[] {
	return getPostsByLocale(locale).map((post) => ({
		slug: post.slug,
		title: post.title,
		description: post.description,
		tags: post.tags ?? [],
		headings: post.structuredData.headings.map((h) => h.content),
		date: post.createdAt.toISOString(),
	}));
}

/** Distinct tags for a locale with their post counts, busiest first. */
export function getAllTags(locale: string): { tag: string; count: number }[] {
	const counts = new Map<string, number>();
	for (const post of getPostsByLocale(locale)) {
		for (const tag of post.tags ?? []) {
			counts.set(tag, (counts.get(tag) ?? 0) + 1);
		}
	}
	return Array.from(counts, ([tag, count]) => ({ tag, count })).sort(
		(a, b) => b.count - a.count || a.tag.localeCompare(b.tag),
	);
}

export function getPostsByTag(tag: string, locale: string): BlogPost[] {
	return getPostsByLocale(locale).filter((post) => post.tags?.includes(tag));
}

/**
 * Chronological neighbours of a post. `older`/`newer` map cleanly to
 * "previous post" / "next post" in the UI.
 */
export function getAdjacentPosts(
	slug: string,
	locale: string,
): { older: BlogPost | null; newer: BlogPost | null } {
	const list = getPostsByLocale(locale); // newest first
	const idx = list.findIndex((post) => post.slug === slug);
	if (idx === -1) {
		return { older: null, newer: null };
	}
	return {
		newer: idx > 0 ? list[idx - 1] : null,
		older: idx < list.length - 1 ? list[idx + 1] : null,
	};
}

/** Posts sharing the most tags with the given post, newest first as a tiebreak. */
export function getRelatedPosts(
	post: BlogPost,
	locale: string,
	limit = 3,
): BlogPost[] {
	const tags = new Set(post.tags ?? []);
	if (tags.size === 0) {
		return [];
	}
	return getPostsByLocale(locale)
		.filter((candidate) => candidate.slug !== post.slug)
		.map((candidate) => ({
			post: candidate,
			score: (candidate.tags ?? []).filter((tag) => tags.has(tag)).length,
		}))
		.filter((entry) => entry.score > 0)
		.sort(
			(a, b) =>
				b.score - a.score ||
				b.post.createdAt.getTime() - a.post.createdAt.getTime(),
		)
		.slice(0, limit)
		.map((entry) => entry.post);
}

/** Posts grouped by year then month (both descending) for the archive list. */
export function groupPostsByYearMonth(posts: BlogPost[]): {
	year: number;
	months: { month: number; posts: BlogPost[] }[];
}[] {
	const years = new Map<number, Map<number, BlogPost[]>>();
	for (const post of posts) {
		const year = post.createdAt.getFullYear();
		const month = post.createdAt.getMonth();
		let months = years.get(year);
		if (!months) {
			months = new Map();
			years.set(year, months);
		}
		const bucket = months.get(month) ?? [];
		if (bucket.length === 0) {
			months.set(month, bucket);
		}
		bucket.push(post);
	}
	return Array.from(years, ([year, months]) => ({
		year,
		months: Array.from(months, ([month, monthPosts]) => ({
			month,
			posts: monthPosts,
		})).sort((a, b) => b.month - a.month),
	})).sort((a, b) => b.year - a.year);
}
