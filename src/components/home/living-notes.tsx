import { Link as I18nLink } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/posts";

const copy = {
	zh: {
		kicker: "Living notes",
		title: "文章发布之后，还应该继续生长。",
		body: "这里优先展示最近被修订、重新连接或值得回看的文章。更新日期只有在说明“为什么更新”时才有意义。",
		updated: "更新于",
	},
	en: {
		kicker: "Living notes",
		title: "Posts should keep growing after publication.",
		body: "This section highlights posts that were revised, reconnected, or are worth revisiting. Update dates matter when they explain what changed.",
		updated: "updated",
	},
};

export function LivingNotes({
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
		<section className="px-6 pb-20">
			<div className="mx-auto max-w-6xl">
				<div className="grid gap-8 rounded-lg border bg-muted/20 p-6 md:grid-cols-[0.8fr_1.2fr] md:p-8">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
							{t.kicker}
						</p>
						<h2 className="mt-3 font-serif text-3xl font-semibold">
							{t.title}
						</h2>
						<p className="mt-4 text-sm leading-6 text-muted-foreground">
							{t.body}
						</p>
					</div>
					<div className="divide-y rounded-lg border bg-background/70">
						{posts.map((post) => (
							<I18nLink
								key={post.slug}
								href={`/blog/${post.slug}`}
								className="block p-5 transition-colors hover:bg-muted/40"
							>
								<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
									<span>{post.stage}</span>
									<span>
										{t.updated} {post.updatedAt.toLocaleDateString(locale)}
									</span>
								</div>
								<h3 className="mt-2 font-serif text-lg font-semibold">
									{post.title}
								</h3>
								{post.updatedReason && (
									<p className="mt-2 text-sm leading-6 text-muted-foreground">
										{post.updatedReason}
									</p>
								)}
							</I18nLink>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
