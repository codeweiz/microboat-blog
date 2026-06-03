import { ArrowUpRight } from "lucide-react";
import { Link as I18nLink } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/posts";

const conceptPositions = [
	{ x: 18, y: 24 },
	{ x: 42, y: 16 },
	{ x: 70, y: 24 },
	{ x: 28, y: 74 },
	{ x: 62, y: 80 },
];

const postPositions = [
	{ x: 24, y: 42 },
	{ x: 48, y: 34 },
	{ x: 76, y: 48 },
	{ x: 32, y: 64 },
	{ x: 56, y: 62 },
	{ x: 82, y: 72 },
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
	const visiblePosts = posts.slice(0, postPositions.length);
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
		.slice(0, conceptPositions.length);

	if (visiblePosts.length === 0 || concepts.length === 0) {
		return null;
	}

	const copy =
		locale === "zh"
			? { kicker: "知识谱系", title: "知识谱系", all: "全部文章" }
			: {
					kicker: "Knowledge lineage",
					title: "Knowledge lineage",
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

				<div className="relative mt-5 min-h-[520px] overflow-hidden rounded-lg border bg-card/55 shadow-sm md:min-h-[450px]">
					<div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:48px_48px] text-border/35" />
					<svg
						className="absolute inset-0 h-full w-full text-primary/50"
						viewBox="0 0 100 100"
						preserveAspectRatio="none"
					>
						<title>Knowledge lineage connections</title>
						{visiblePosts.flatMap((post, postIndex) => {
							const matched = concepts.filter(({ concept }) =>
								postConcepts(post).includes(concept),
							);
							const postPosition = postPositions[postIndex];
							return matched.slice(0, 3).map(({ concept }) => {
								const conceptIndex = concepts.findIndex(
									(entry) => entry.concept === concept,
								);
								const conceptPosition = conceptPositions[conceptIndex];
								return (
									<line
										key={`${post.slug}-${concept}`}
										x1={conceptPosition.x}
										y1={conceptPosition.y}
										x2={postPosition.x}
										y2={postPosition.y}
										stroke="currentColor"
										strokeWidth="0.22"
										vectorEffect="non-scaling-stroke"
									/>
								);
							});
						})}
					</svg>

					{concepts.map(({ concept, count }, index) => {
						const position = conceptPositions[index];
						return (
							<div
								key={concept}
								className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border bg-background/90 px-3 py-1.5 text-xs shadow-sm backdrop-blur"
								style={{ left: `${position.x}%`, top: `${position.y}%` }}
							>
								<span>{labelFromSlug(concept)}</span>
								<sup className="ml-1 text-muted-foreground">{count}</sup>
							</div>
						);
					})}

					{visiblePosts.map((post, index) => {
						const position = postPositions[index];
						return (
							<I18nLink
								key={post.slug}
								href={`/blog/${post.slug}`}
								className="group absolute w-[min(16rem,70vw)] -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background/92 p-2.5 shadow-sm backdrop-blur transition-all hover:-translate-y-[calc(50%+2px)] hover:border-primary/50 hover:shadow-md"
								style={{ left: `${position.x}%`, top: `${position.y}%` }}
							>
								<div className="flex gap-3">
									{post.image ? (
										<img
											src={post.image}
											alt=""
											className="h-12 w-16 shrink-0 rounded-md border object-cover"
										/>
									) : null}
									<div className="min-w-0">
										<h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:underline">
											{post.title}
										</h3>
										<time className="mt-1 block text-[11px] text-muted-foreground tabular-nums">
											{post.createdAt.toLocaleDateString(locale, {
												month: "short",
												day: "numeric",
											})}
										</time>
									</div>
								</div>
							</I18nLink>
						);
					})}
				</div>
			</div>
		</section>
	);
}
