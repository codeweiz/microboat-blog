import { ArrowUpRight } from "lucide-react";
import { Link as I18nLink } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/posts";
import { KnowledgeLineageGraph } from "./knowledge-lineage-graph";

type LineageNode = {
	id: string;
	kind: "concept" | "post";
	label: string;
	slug?: string;
	image?: string;
	date?: string;
	count?: number;
	x: number;
	y: number;
};

type LineageEdge = {
	id: string;
	from: string;
	to: string;
	relation: "concept" | "link" | "series";
};

const conceptSlots = [
	{ x: 14, y: 22 },
	{ x: 42, y: 12 },
	{ x: 76, y: 20 },
	{ x: 91, y: 52 },
	{ x: 70, y: 88 },
	{ x: 36, y: 86 },
	{ x: 9, y: 60 },
];

const postSlots = [
	{ x: 25, y: 36 },
	{ x: 51, y: 30 },
	{ x: 76, y: 42 },
	{ x: 33, y: 61 },
	{ x: 57, y: 61 },
	{ x: 82, y: 70 },
	{ x: 18, y: 77 },
];

function labelFromSlug(value: string) {
	return value
		.split(/[-_]/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

function postConcepts(post: BlogPost) {
	return Array.from(new Set([...(post.concepts ?? []), ...(post.tags ?? [])]));
}

export function KnowledgeLineage({
	posts,
	locale,
}: {
	posts: BlogPost[];
	locale: string;
}) {
	const visiblePosts = posts.slice(0, postSlots.length);
	const conceptCounts = new Map<string, number>();

	for (const post of visiblePosts) {
		for (const concept of postConcepts(post)) {
			conceptCounts.set(concept, (conceptCounts.get(concept) ?? 0) + 1);
		}
	}

	const concepts = Array.from(conceptCounts, ([concept, count]) => ({
		concept,
		count,
	}))
		.sort((a, b) => b.count - a.count || a.concept.localeCompare(b.concept))
		.slice(0, conceptSlots.length);

	if (visiblePosts.length === 0 || concepts.length === 0) {
		return null;
	}

	const conceptNodes: LineageNode[] = concepts.map(
		({ concept, count }, index) => ({
			id: `concept:${concept}`,
			kind: "concept",
			label: labelFromSlug(concept),
			count,
			...conceptSlots[index],
		}),
	);
	const postNodes: LineageNode[] = visiblePosts.map((post, index) => ({
		id: `post:${post.slug}`,
		kind: "post",
		label: post.title,
		slug: post.slug,
		image: post.image,
		date: post.createdAt.toLocaleDateString(locale, {
			month: "short",
			day: "numeric",
		}),
		...postSlots[index],
	}));
	const visibleSlugs = new Set(visiblePosts.map((post) => post.slug));
	const conceptEdges: LineageEdge[] = visiblePosts.flatMap((post) =>
		concepts
			.filter(({ concept }) => postConcepts(post).includes(concept))
			.slice(0, 3)
			.map(({ concept }) => ({
				id: `concept:${concept}->post:${post.slug}`,
				from: `concept:${concept}`,
				to: `post:${post.slug}`,
				relation: "concept" as const,
			})),
	);
	const postEdges: LineageEdge[] = visiblePosts.flatMap((post) => {
		const linked = (post.links ?? [])
			.filter((slug) => visibleSlugs.has(slug))
			.map((slug) => ({
				id: `post:${post.slug}->post:${slug}:link`,
				from: `post:${post.slug}`,
				to: `post:${slug}`,
				relation: "link" as const,
			}));
		const sameSeries = visiblePosts
			.filter(
				(candidate) =>
					candidate.slug !== post.slug &&
					post.series &&
					candidate.series === post.series,
			)
			.slice(0, 1)
			.map((candidate) => ({
				id: `post:${post.slug}->post:${candidate.slug}:series`,
				from: `post:${post.slug}`,
				to: `post:${candidate.slug}`,
				relation: "series" as const,
			}));
		return [...linked, ...sameSeries];
	});
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
					nodes={[...conceptNodes, ...postNodes]}
					edges={[...conceptEdges, ...postEdges]}
					locale={locale}
				/>
			</div>
		</section>
	);
}
