import { Link as I18nLink } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/posts";

export type KnowledgeCluster = {
	concept: string;
	posts: BlogPost[];
};

const copy = {
	zh: {
		kicker: "Knowledge map",
		title: "按长期问题，而不是按发布日期浏览。",
		body: "每个主题都是一组持续生长的文章。读者可以从入口文章进入，也可以顺着概念和反向链接继续走。",
		enter: "从",
		enterSuffix: "进入",
	},
	en: {
		kicker: "Knowledge map",
		title: "Browse by long-running questions, not only dates.",
		body: "Each cluster is a living group of posts. Start from the entry article, then follow concepts and backlinks.",
		enter: "Start with",
		enterSuffix: "",
	},
};

function labelize(value: string) {
	return value
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

export function KnowledgeMap({
	clusters,
	locale,
}: {
	clusters: KnowledgeCluster[];
	locale: string;
}) {
	if (clusters.length === 0) {
		return null;
	}
	const t = locale === "zh" ? copy.zh : copy.en;

	return (
		<section className="px-6 py-16">
			<div className="mx-auto max-w-6xl">
				<div className="flex flex-col justify-between gap-4 border-b pb-5 md:flex-row md:items-end">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
							{t.kicker}
						</p>
						<h2 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">
							{t.title}
						</h2>
					</div>
					<p className="max-w-md text-sm leading-6 text-muted-foreground">
						{t.body}
					</p>
				</div>
				<div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					{clusters.slice(0, 8).map(({ concept, posts }) => {
						const entry = posts[0];
						return (
							<div
								key={concept}
								className="rounded-lg border bg-background/70 p-5"
							>
								<div className="flex items-start justify-between gap-4">
									<h3 className="font-serif text-xl font-semibold">
										{labelize(concept)}
									</h3>
									<span className="rounded border px-2 py-0.5 text-xs text-muted-foreground">
										{posts.length}
									</span>
								</div>
								<p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
									{entry.description}
								</p>
								<I18nLink
									href={`/blog/${entry.slug}`}
									className="mt-5 inline-flex text-sm font-medium text-primary hover:underline"
								>
									{t.enter}《{entry.title}》{t.enterSuffix}
								</I18nLink>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
