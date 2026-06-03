import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PostRow } from "@/components/blog/post-row";
import { metadata } from "@/lib/metadata";
import {
	getConceptClusters,
	getFeaturedPosts,
	getPostsByLocale,
	getStartHerePosts,
	groupPostsByYearMonth,
} from "@/lib/posts";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "blog" });
	return metadata({
		title: `${t("title")}`,
		description: t("description"),
		keywords: t("keywords")?.split(",") || [],
	});
}

export default async function BlogPage({
	params,
}: {
	params: Promise<{ locale: Locale }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("blog");

	const posts = getPostsByLocale(locale);
	const groups = groupPostsByYearMonth(posts);
	const featured = getFeaturedPosts(locale, 3);
	const startHere = getStartHerePosts(locale, 4);
	const concepts = getConceptClusters(locale, 10);
	const copy =
		locale === "zh"
			? {
					kicker: "文章",
					featured: "最近比较想推荐的",
					startHere: "从这里读起",
					concepts: "常出现的话题",
					archive: "按时间",
				}
			: {
					kicker: "Posts",
					featured: "Worth starting with",
					startHere: "Start here",
					concepts: "Recurring topics",
					archive: "By date",
				};

	const monthName = (year: number, month: number) =>
		new Date(year, month, 1).toLocaleDateString(locale, { month: "long" });

	return (
		<section className="px-6 pt-32 pb-20">
			<div className="mx-auto w-full max-w-6xl">
				<header>
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
							{copy.kicker}
						</p>
						<h1 className="mt-3 font-serif text-4xl font-semibold md:text-5xl">
							{t("title")}
						</h1>
						<p className="mt-4 max-w-2xl text-muted-foreground md:text-lg">
							{t("description")}
						</p>
					</div>
				</header>

				{featured.length > 0 && (
					<section className="mt-12">
						<h2 className="font-serif text-2xl font-semibold">
							{copy.featured}
						</h2>
						<div className="mt-5 grid gap-4 md:grid-cols-3">
							{featured.map((post) => (
								<article
									key={post.slug}
									className="overflow-hidden rounded-lg border bg-muted/20"
								>
									{post.image ? (
										<img
											src={post.image}
											alt=""
											className="aspect-[16/9] w-full object-cover"
										/>
									) : null}
									<div className="p-5">
										<div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
											<span>{post.type}</span>
											<span>·</span>
											<span>{post.stage}</span>
										</div>
										<h3 className="mt-3 font-serif text-xl font-semibold leading-snug">
											<a
												href={`/${locale}/blog/${post.slug}`}
												className="hover:underline"
											>
											{post.title}
										</a>
									</h3>
										<p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
											{post.description}
										</p>
									</div>
								</article>
							))}
						</div>
					</section>
				)}

				<section id="knowledge-map" className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
					<div>
						<h2 className="font-serif text-2xl font-semibold">
							{copy.startHere}
						</h2>
						<div className="mt-4 divide-y rounded-lg border">
							{startHere.map((post) => (
								<PostRow key={post.slug} post={post} />
							))}
						</div>
					</div>
					<div>
						<h2 className="font-serif text-2xl font-semibold">
							{copy.concepts}
						</h2>
						<div className="mt-4 flex flex-wrap gap-2">
							{concepts.map(({ concept, posts: conceptPosts }) => (
								<a
									key={concept}
									href={`#concept-${concept}`}
									className="rounded-md border bg-muted/30 px-3 py-2 text-sm transition-colors hover:bg-muted"
								>
									{concept}
									<sup className="ml-1 text-muted-foreground">
										{conceptPosts.length}
									</sup>
								</a>
							))}
						</div>
					</div>
				</section>

				<div className="mt-16 space-y-14">
					<h2 className="font-serif text-2xl font-semibold">{copy.archive}</h2>
					{groups.map(({ year, months }) => {
						const yearCount = months.reduce(
							(sum, m) => sum + m.posts.length,
							0,
						);
						return (
							<div key={year}>
								<h2 className="flex items-baseline gap-2 font-serif text-2xl font-semibold">
									{year}
									<sup className="text-[0.6em] font-normal text-muted-foreground tabular-nums">
										{yearCount}
									</sup>
								</h2>
								<div className="mt-6 space-y-8">
									{months.map(({ month, posts: monthPosts }) => (
										<div
											key={month}
											className="grid gap-x-6 gap-y-1 sm:grid-cols-[6rem_1fr]"
										>
											<div className="pt-5 font-serif text-muted-foreground">
												{monthName(year, month)}
												<sup className="ml-1 text-[0.7em] tabular-nums">
													{monthPosts.length}
												</sup>
											</div>
											<div className="divide-y">
												{monthPosts.map((post) => (
													<PostRow key={post.slug} post={post} />
												))}
											</div>
										</div>
									))}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
