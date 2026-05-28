import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { appConfig } from "@/config";
import { Link as I18nLink } from "@/i18n/navigation";
import { metadata } from "@/lib/metadata";
import { blogs as allBlogs } from "@/source";

const blogs = Array.from(allBlogs);

export const dynamic = "force-dynamic";

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
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {
	const locale = await getLocale();
	const t = await getTranslations("blog");
	const postsPerPage = appConfig.blog.pagination;

	const posts = blogs
		.filter((post: any) => post.locale === locale)
		.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());

	const { page } = await searchParams;
	const currentPage = Number(page) || 1;
	const totalPages = Math.ceil(posts.length / postsPerPage);

	const startIndex = (currentPage - 1) * postsPerPage;
	const currentPosts = posts.slice(startIndex, startIndex + postsPerPage);

	return (
		<section className="pt-32 pb-16 px-6">
			<div className="mx-auto w-full max-w-5xl">
				<div className="text-center">
					<h1 className="mx-auto text-pretty text-3xl md:text-4xl font-semibold">
						{t("title")}
					</h1>
					<p className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg">
						{t("description")}
					</p>
				</div>

				<div className="mt-16 grid gap-10 sm:grid-cols-12">
					{currentPosts.map((post: any) => (
						<Card
							key={post.slug}
							className="border-0 bg-background shadow-none sm:col-span-12 lg:col-span-10 lg:col-start-2"
						>
							<div className="grid gap-6 sm:grid-cols-10 md:items-center md:gap-8 lg:gap-12">
								<div className="sm:col-span-5">
									<div className="mb-4 flex flex-wrap gap-3 text-xs uppercase tracking-wider text-muted-foreground">
										{post.tags?.map((tag: string) => (
											<span key={tag}>{tag}</span>
										))}
									</div>
									<h3 className="text-xl md:text-2xl font-semibold">
										<I18nLink
											href={`/blog/${post.slug}`}
											className="hover:underline"
										>
											{post.title}
										</I18nLink>
									</h3>
									<p className="mt-3 text-muted-foreground">
										{post.description}
									</p>
									<div className="mt-5 flex items-center gap-3 text-sm text-muted-foreground">
										<span>{post.author}</span>
										<span>•</span>
										<span>{post.createdAt.toLocaleDateString()}</span>
									</div>
								</div>
								<div className="order-first sm:order-last sm:col-span-5">
									<I18nLink href={`/blog/${post.slug}`} className="block">
										<div className="aspect-[16/9] overflow-clip rounded-lg border border-border">
											<img
												src={post.image || appConfig.blog.placeholderImage}
												alt={post.title}
												className="h-full w-full object-cover transition-opacity duration-200 hover:opacity-70"
											/>
										</div>
									</I18nLink>
								</div>
							</div>
						</Card>
					))}
				</div>

				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					basePath="/blog"
				/>
			</div>
		</section>
	);
}
