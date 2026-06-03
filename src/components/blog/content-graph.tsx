import { Link as I18nLink } from "@/i18n/navigation";
import { getGraphForPost, type KnowledgePost } from "@/lib/content-graph";
import type { BlogPost } from "@/lib/posts";

const positions = [
	{ x: 50, y: 50 },
	{ x: 18, y: 22 },
	{ x: 82, y: 24 },
	{ x: 20, y: 78 },
	{ x: 80, y: 76 },
	{ x: 50, y: 16 },
	{ x: 50, y: 86 },
];

export function ContentGraph({
	post,
	posts,
}: {
	post: BlogPost;
	posts: BlogPost[];
}) {
	const graph = getGraphForPost(post as KnowledgePost, posts as KnowledgePost[]);
	const visibleNodes = graph.nodes.slice(0, positions.length);
	const nodePositions = new Map(
		visibleNodes.map((node, index) => [node.slug, positions[index]]),
	);
	const visibleEdges = graph.edges.filter(
		(edge) => nodePositions.has(edge.from) && nodePositions.has(edge.to),
	);

	if (visibleNodes.length <= 1) {
		return null;
	}

	return (
		<section className="mt-12 border-t pt-8">
			<p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
				Local graph
			</p>
			<h2 className="mt-2 font-serif text-2xl font-semibold">
				这篇文章在知识网络里的位置
			</h2>
			<div className="mt-5 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
				<div className="relative min-h-[360px] overflow-hidden rounded-lg border bg-muted/20">
					<svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
						{visibleEdges.map((edge) => {
							const from = nodePositions.get(edge.from);
							const to = nodePositions.get(edge.to);
							if (!from || !to) {
								return null;
							}
							return (
								<line
									key={`${edge.from}-${edge.to}-${edge.relation}`}
									x1={from.x}
									y1={from.y}
									x2={to.x}
									y2={to.y}
									stroke="currentColor"
									strokeWidth={edge.relation === "outgoing" ? 0.45 : 0.28}
									className="text-primary/45"
								/>
							);
						})}
					</svg>
					{visibleNodes.map((node, index) => {
						const position = positions[index];
						const current = node.slug === post.slug;
						return (
							<I18nLink
								key={node.slug}
								href={`/blog/${node.slug}`}
								className={`absolute w-40 -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background/90 p-3 text-left shadow-sm transition-colors hover:border-primary/50 ${
									current ? "border-primary bg-primary/5" : ""
								}`}
								style={{ left: `${position.x}%`, top: `${position.y}%` }}
							>
								<span className="line-clamp-2 font-serif text-sm font-semibold leading-snug">
									{node.title}
								</span>
								<span className="mt-1 block text-[11px] text-muted-foreground">
									{node.type} · {node.stage}
								</span>
							</I18nLink>
						);
					})}
				</div>
				<div className="rounded-lg border bg-muted/20 p-4">
					<h3 className="font-serif text-lg font-semibold">Why these nodes?</h3>
					<ul className="mt-3 space-y-3">
						{visibleEdges.slice(0, 8).map((edge) => {
							const target = graph.nodes.find((node) => node.slug === edge.to);
							const source = graph.nodes.find((node) => node.slug === edge.from);
							return (
								<li
									key={`${edge.from}-${edge.to}-${edge.relation}-label`}
									className="text-sm leading-6 text-muted-foreground"
								>
									<span className="font-medium text-foreground">
										{source?.title}
									</span>{" "}
									→ <span className="font-medium text-foreground">{target?.title}</span>
									<br />
									<span>{edge.reason}</span>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</section>
	);
}
