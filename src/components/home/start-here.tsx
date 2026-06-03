import { ArrowUpRight } from "lucide-react";
import { Link as I18nLink } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/posts";
import { postStats } from "@/lib/posts";

const copy = {
	zh: {
		kicker: "推荐几篇",
		title: "如果只读几篇，可以从这里开始。",
		body: "这些文章比较能代表我最近写作的方向：AI 工具链、系统边界、质量回路和组织学习。",
	},
	en: {
		kicker: "A few good starts",
		title: "If you only read a few posts, start here.",
		body: "These pieces best represent the current direction: AI toolchains, system boundaries, quality loops, and organizational learning.",
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
