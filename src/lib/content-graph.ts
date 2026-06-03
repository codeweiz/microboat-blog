export type KnowledgePost = {
	slug: string;
	title: string;
	description?: string;
	type?: string;
	stage?: string;
	series?: string;
	seriesOrder?: number;
	concepts?: string[];
	links?: string[];
	aliases?: string[];
	tags?: string[];
	createdAt?: Date;
	updatedAt?: Date;
};

export type GraphRelation =
	| "outgoing"
	| "backlink"
	| "series"
	| "concept"
	| "similar";

export type GraphNode = {
	slug: string;
	title: string;
	description: string;
	type: string;
	stage: string;
	concepts: string[];
};

export type GraphEdge = {
	from: string;
	to: string;
	relation: GraphRelation;
	reason: string;
	weight: number;
};

export type ContentGraph = {
	nodes: GraphNode[];
	edges: GraphEdge[];
};

const DEFAULT_TYPE = "essay";
const DEFAULT_STAGE = "budding";

export function normalizeConcept(value: string): string {
	return value
		.trim()
		.toLowerCase()
		.replace(/&/g, "and")
		.replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export function getPostType(post: Partial<KnowledgePost>): string {
	return post.type || DEFAULT_TYPE;
}

export function getPostStage(post: Partial<KnowledgePost>): string {
	return post.stage || DEFAULT_STAGE;
}

export function getPostConcepts(post: Partial<KnowledgePost>): string[] {
	return Array.from(
		new Set((post.concepts ?? []).map(normalizeConcept).filter(Boolean)),
	);
}

export function toGraphNode(post: KnowledgePost): GraphNode {
	return {
		slug: post.slug,
		title: post.title,
		description: post.description ?? "",
		type: getPostType(post),
		stage: getPostStage(post),
		concepts: getPostConcepts(post),
	};
}

function addEdge(edges: Map<string, GraphEdge>, edge: GraphEdge) {
	const key = `${edge.from}->${edge.to}:${edge.relation}`;
	const current = edges.get(key);
	if (!current || current.weight < edge.weight) {
		edges.set(key, edge);
	}
}

export function getBacklinks(
	post: KnowledgePost,
	posts: KnowledgePost[],
): KnowledgePost[] {
	return posts.filter(
		(candidate) =>
			candidate.slug !== post.slug && candidate.links?.includes(post.slug),
	);
}

export function buildContentGraph(posts: KnowledgePost[]): ContentGraph {
	const edges = new Map<string, GraphEdge>();
	const bySlug = new Map(posts.map((post) => [post.slug, post]));

	for (const post of posts) {
		for (const linkedSlug of post.links ?? []) {
			if (!bySlug.has(linkedSlug)) {
				continue;
			}
			addEdge(edges, {
				from: post.slug,
				to: linkedSlug,
				relation: "outgoing",
				reason: "links to this post",
				weight: 12,
			});
		}
	}

	return {
		nodes: posts.map(toGraphNode),
		edges: Array.from(edges.values()),
	};
}

export function getGraphForPost(
	post: KnowledgePost,
	posts: KnowledgePost[],
): ContentGraph {
	const related = new Map<string, KnowledgePost>([[post.slug, post]]);
	const edges = new Map<string, GraphEdge>();
	const postConcepts = new Set(getPostConcepts(post));

	for (const linkedSlug of post.links ?? []) {
		const linked = posts.find((candidate) => candidate.slug === linkedSlug);
		if (!linked) {
			continue;
		}
		related.set(linked.slug, linked);
		addEdge(edges, {
			from: post.slug,
			to: linked.slug,
			relation: "outgoing",
			reason: "links to this post",
			weight: 12,
		});
	}

	for (const backlink of getBacklinks(post, posts)) {
		related.set(backlink.slug, backlink);
		addEdge(edges, {
			from: backlink.slug,
			to: post.slug,
			relation: "backlink",
			reason: "links back to this post",
			weight: 10,
		});
	}

	for (const candidate of posts) {
		if (candidate.slug === post.slug) {
			continue;
		}
		if (post.series && candidate.series === post.series) {
			related.set(candidate.slug, candidate);
			addEdge(edges, {
				from: post.slug,
				to: candidate.slug,
				relation: "series",
				reason: "same series",
				weight: 8,
			});
		}

		const shared = getPostConcepts(candidate).filter((concept) =>
			postConcepts.has(concept),
		);
		if (shared.length > 0) {
			related.set(candidate.slug, candidate);
			addEdge(edges, {
				from: post.slug,
				to: candidate.slug,
				relation: "concept",
				reason: `shares concept: ${shared[0]}`,
				weight: 5 + shared.length,
			});
		}
	}

	return {
		nodes: Array.from(related.values()).map(toGraphNode),
		edges: Array.from(edges.values()).sort((a, b) => b.weight - a.weight),
	};
}
