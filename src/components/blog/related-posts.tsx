import { getLocale, getTranslations } from "next-intl/server";
import { Link as I18nLink } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/posts";

/** "You might also like" — posts sharing tags with the current one. */
export async function RelatedPosts({ posts }: { posts: BlogPost[] }) {
	if (!posts.length) {
		return null;
	}
	const locale = await getLocale();
	const t = await getTranslations("post");

	return (
		<section className="mt-12 border-t pt-8">
			<h2 className="font-serif text-lg font-semibold">{t("related")}</h2>
			<ul className="mt-4 divide-y">
				{posts.map((post) => (
					<li key={post.slug}>
						<I18nLink
							href={`/blog/${post.slug}`}
							className="group flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
						>
							<span className="font-medium group-hover:underline">
								{post.title}
							</span>
							<time
								dateTime={post.createdAt.toISOString()}
								className="shrink-0 text-xs text-muted-foreground tabular-nums"
							>
								{post.createdAt.toLocaleDateString(locale, {
									year: "numeric",
									month: "short",
									day: "numeric",
								})}
							</time>
						</I18nLink>
					</li>
				))}
			</ul>
		</section>
	);
}
