import {
	getBacklinks,
	getPostConcepts,
	type KnowledgePost,
} from "./content-graph.ts";

export type NextRead = {
	post: KnowledgePost;
	score: number;
	reasons: string[];
};

function addReason(reasons: Set<string>, reason: string) {
	if (reason) {
		reasons.add(reason);
	}
}

function lexicalSimilarity(
	source: KnowledgePost,
	candidate: KnowledgePost,
): number {
	const sourceTerms = new Set(
		[
			source.title,
			source.description,
			...(source.concepts ?? []),
			...(source.tags ?? []),
		]
			.join(" ")
			.toLowerCase()
			.split(/[^a-z0-9\u4e00-\u9fa5]+/)
			.filter((term) => term.length > 2),
	);
	if (sourceTerms.size === 0) {
		return 0;
	}
	const candidateTerms = new Set(
		[
			candidate.title,
			candidate.description,
			...(candidate.concepts ?? []),
			...(candidate.tags ?? []),
		]
			.join(" ")
			.toLowerCase()
			.split(/[^a-z0-9\u4e00-\u9fa5]+/)
			.filter((term) => term.length > 2),
	);
	let overlap = 0;
	for (const term of sourceTerms) {
		if (candidateTerms.has(term)) {
			overlap += 1;
		}
	}
	return overlap / sourceTerms.size;
}

export function getNextReads(
	post: KnowledgePost,
	posts: KnowledgePost[],
	limit = 4,
): NextRead[] {
	const backlinks = new Set(getBacklinks(post, posts).map((item) => item.slug));
	const postConcepts = new Set(getPostConcepts(post));

	return posts
		.filter((candidate) => candidate.slug !== post.slug)
		.map((candidate) => {
			let score = 0;
			const reasons = new Set<string>();

			if (post.links?.includes(candidate.slug)) {
				score += 40;
				addReason(reasons, "links to this post");
			}
			if (backlinks.has(candidate.slug)) {
				score += 34;
				addReason(reasons, "links back here");
			}
			if (post.series && candidate.series === post.series) {
				score += 30;
				addReason(reasons, "same series");
				if (
					typeof post.seriesOrder === "number" &&
					typeof candidate.seriesOrder === "number"
				) {
					score += Math.max(
						0,
						8 - Math.abs(post.seriesOrder - candidate.seriesOrder),
					);
				}
			}

			const sharedConcepts = getPostConcepts(candidate).filter((concept) =>
				postConcepts.has(concept),
			);
			if (sharedConcepts.length > 0) {
				score += sharedConcepts.length * 12;
				addReason(reasons, `shares concept: ${sharedConcepts[0]}`);
			}

			if (candidate.type && candidate.type === post.type) {
				score += 3;
			}
			if (candidate.stage && candidate.stage === post.stage) {
				score += 2;
			}

			const lexical = lexicalSimilarity(post, candidate);
			if (lexical >= 0.22) {
				score += lexical * 10;
				addReason(reasons, "semantic match");
			}

			return {
				post: candidate,
				score,
				reasons: Array.from(reasons),
			};
		})
		.filter((entry) => entry.score > 0 && entry.reasons.length > 0)
		.sort((a, b) => {
			if (b.score !== a.score) {
				return b.score - a.score;
			}
			return (
				(b.post.updatedAt?.getTime() ?? b.post.createdAt?.getTime() ?? 0) -
				(a.post.updatedAt?.getTime() ?? a.post.createdAt?.getTime() ?? 0)
			);
		})
		.slice(0, limit);
}
