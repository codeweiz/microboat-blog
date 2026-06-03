import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PostRow } from "@/components/blog/post-row";
import { metadata } from "@/lib/metadata";
import { getPostsByLocale, groupPostsByYearMonth } from "@/lib/posts";

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
	const copy =
		locale === "zh"
			? {
					kicker: "文章",
					archive: "按时间",
				}
			: {
					kicker: "Posts",
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

				<div className="mt-12 space-y-14">
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
