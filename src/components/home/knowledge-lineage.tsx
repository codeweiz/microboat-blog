import { ArrowUpRight } from "lucide-react";
import { Link as I18nLink } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/posts";
import { KnowledgeLineageGraph } from "./knowledge-lineage-graph";

type LineageNode = {
	id: string;
	label: string;
	slug: string;
	image?: string;
	date: string;
	x: number;
	y: number;
};

type LineageEdge = {
	id: string;
	from: string;
	to: string;
	relation: "shared" | "link" | "series";
	weight: number;
};

function postConcepts(post: BlogPost) {
	return Array.from(new Set([...(post.concepts ?? []), ...(post.tags ?? [])]));
}

function nodePosition(index: number, total: number) {
	if (index === 0) {
		return { x: 50, y: 50 };
	}

	const angle = index * 137.508 * (Math.PI / 180);
	const ring = Math.ceil(index / 7);
	const radius = Math.min(10 + ring * 13 + (index % 3) * 2.5, 42);
	const centerPull = total > 14 ? 0.88 : 1;

	return {
		x: 50 + Math.cos(angle) * radius * centerPull,
		y: 50 + Math.sin(angle) * radius * 0.72 * centerPull,
	};
}

export function KnowledgeLineage({
	posts,
	locale,
}: {
	posts: BlogPost[];
	locale: string;
}) {
	const visiblePosts = posts.slice(0, 24);

	if (visiblePosts.length === 0) {
		return null;
	}

	const nodes: LineageNode[] = visiblePosts.map((post, index) => ({
		id: `post:${post.slug}`,
		label: post.title,
		slug: post.slug,
		image: post.image,
		date: post.createdAt.toLocaleDateString(locale, {
			month: "short",
			day: "numeric",
		}),
		...nodePosition(index, visiblePosts.length),
	}));

	const visibleSlugs = new Set(visiblePosts.map((post) => post.slug));
	const edges = new Map<string, LineageEdge>();
	const addEdge = (edge: LineageEdge) => {
		const current = edges.get(edge.id);
		if (!current || current.weight < edge.weight) {
			edges.set(edge.id, edge);
		}
	};

	for (const post of visiblePosts) {
		for (const slug of post.links ?? []) {
			if (!visibleSlugs.has(slug)) {
				continue;
			}
			addEdge({
				id: `post:${post.slug}->post:${slug}:link`,
				from: `post:${post.slug}`,
				to: `post:${slug}`,
				relation: "link",
				weight: 12,
			});
		}
	}

	for (let i = 0; i < visiblePosts.length; i += 1) {
		const source = visiblePosts[i];
		const sourceConcepts = new Set(postConcepts(source));
		for (let j = i + 1; j < visiblePosts.length; j += 1) {
			const target = visiblePosts[j];
			if (source.series && source.series === target.series) {
				addEdge({
					id: `post:${source.slug}->post:${target.slug}:series`,
					from: `post:${source.slug}`,
					to: `post:${target.slug}`,
					relation: "series",
					weight: 9,
				});
			}

			const shared = postConcepts(target).filter((concept) =>
				sourceConcepts.has(concept),
			);
			if (shared.length > 0) {
				addEdge({
					id: `post:${source.slug}->post:${target.slug}:shared`,
					from: `post:${source.slug}`,
					to: `post:${target.slug}`,
					relation: "shared",
					weight: shared.length,
				});
			}
		}
	}

	const copy =
		locale === "zh"
			? { kicker: "知识谱系", title: "文章之间的暗线", all: "全部文章" }
			: {
					kicker: "Knowledge lineage",
					title: "The lines between posts",
					all: "All posts",
				};

	return (
		<section className="px-6 pb-20">
			<div className="mx-auto max-w-6xl">
				<div className="flex items-end justify-between gap-4 border-b pb-4">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
							{copy.kicker}
						</p>
						<h2 className="mt-2 text-2xl font-semibold">{copy.title}</h2>
					</div>
					<I18nLink
						href="/blog"
						className="hidden items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
					>
						{copy.all}
						<ArrowUpRight className="h-3.5 w-3.5" />
					</I18nLink>
				</div>
				<KnowledgeLineageGraph
					nodes={nodes}
					edges={Array.from(edges.values())
						.sort((a, b) => b.weight - a.weight)
						.slice(0, 64)}
				/>
			</div>
		</section>
	);
}
