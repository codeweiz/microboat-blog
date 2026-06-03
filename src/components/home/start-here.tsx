import { ArrowUpRight } from "lucide-react";
import { Link as I18nLink } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/posts";
import { postStats } from "@/lib/posts";

const copy = {
	zh: {
		kicker: "Start here",
		title: "第一次来，从这些问题开始。",
		body: "这些不是最新文章列表，而是最能代表这个站的入口：工具如何改变工程、系统如何恢复、组织如何学习。",
	},
	en: {
		kicker: "Start here",
		title: "If this is your first visit, start with the questions.",
		body: "These are not the latest posts. They are the best entrances into the site's recurring questions: tools, systems, learning, and judgment.",
	},
};

export function StartHere({
	posts,
	locale,
}: {
	posts: BlogPost[];
	locale: string;
}) {
	if (posts.length === 0) {
		return null;
	}
	const t = locale === "zh" ? copy.zh : copy.en;

	return (
		<section className="border-y bg-muted/20 px-6 py-14">
			<div className="mx-auto max-w-6xl">
				<div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
							{t.kicker}
						</p>
						<h2 className="mt-3 font-serif text-3xl font-semibold leading-tight md:text-4xl">
							{t.title}
						</h2>
						<p className="mt-4 max-w-md text-muted-foreground leading-7">
							{t.body}
						</p>
					</div>
					<div className="grid gap-3">
						{posts.map((post, index) => {
							const { minutes } = postStats(post);
							return (
								<I18nLink
									key={post.slug}
									href={`/blog/${post.slug}`}
									className="group grid gap-4 rounded-lg border bg-background/70 p-5 transition-colors hover:border-primary/40 hover:bg-background md:grid-cols-[3rem_1fr_auto]"
								>
									<div className="font-mono text-sm text-muted-foreground tabular-nums">
										{String(index + 1).padStart(2, "0")}
									</div>
									<div>
										<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
											<span className="rounded border px-1.5 py-0.5 uppercase">
												{post.type}
											</span>
											<span>{post.stage}</span>
											<span>{minutes} min</span>
										</div>
										<h3 className="mt-2 font-serif text-xl font-semibold leading-snug group-hover:underline">
											{post.title}
										</h3>
										<p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
											{post.description}
										</p>
									</div>
									<ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
								</I18nLink>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
