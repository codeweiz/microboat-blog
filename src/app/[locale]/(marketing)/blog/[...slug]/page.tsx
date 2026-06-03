import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { components } from "@/components/blog/mdx-components";
import { metadata } from "@/lib/metadata";
import {
	getAdjacentPosts,
	getAllPosts,
	getPostBySlug,
	getPostsByLocale,
	postStats,
} from "@/lib/posts";
import { getNextReads } from "@/lib/recommendations";
import { cn } from "@/lib/utils";

import "@/styles/docs-mdx.css";
import { ContentGraph } from "@/components/blog/content-graph";
import { Giscus } from "@/components/blog/giscus";
import { GoToTop } from "@/components/blog/go-to-top";
import { NextReads } from "@/components/blog/next-reads";
import { PostLifecycle } from "@/components/blog/post-lifecycle";
import { PostMeta } from "@/components/blog/post-meta";
import { PostNav } from "@/components/blog/post-nav";
import { TagPills } from "@/components/blog/tag-pills";
import { DashboardTableOfContents } from "@/components/blog/toc";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string[]; locale: Locale }>;
}): Promise<Metadata | undefined> {
	const { slug, locale } = await params;

	const blog = getPostBySlug(slug?.join("/") || "", locale);

	if (!blog) {
		return {};
	}

	const t = await getTranslations({ locale, namespace: "blog" });

	return metadata({
		title: `${blog.title} | ${t("title")}`,
		description: blog.description,
		keywords: blog.keywords?.split(",") || [],
	});
}

type BlogsPageProps = {
	params: Promise<{ slug: string[]; locale: Locale }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export function generateStaticParams() {
	return getAllPosts().map((blog) => ({
		locale: blog.locale,
		slug: blog.slug.split("/"),
	}));
}

export default async function BlogPage(props: BlogsPageProps) {
	const isTocHidden = false;
	const { slug, locale } = await props.params;
	setRequestLocale(locale);
	const blog = getPostBySlug(slug?.join("/") || "", locale);

	if (!blog) {
		notFound();
	}

	const MDX = blog.body;
	const { minutes, words } = postStats(blog);
	const { older, newer } = getAdjacentPosts(blog.slug, locale);
	const localePosts = getPostsByLocale(locale);
	const nextReads = getNextReads(blog, localePosts, 4);

	return (
		<main
			className={cn(
				"relative max-w-full md:max-w-7xl mx-auto lg:gap-10 py-24 md:py-32 xl:grid xl:grid-cols-[1fr_300px] px-4 xs:px-0",
				isTocHidden && "xl:grid-cols-[1fr]",
			)}
		>
			<div className="max-w-4xl mx-auto w-full">
				<header>
					<h1 className="font-serif text-3xl md:text-[2.5rem] font-bold leading-tight">
						{blog.title}
					</h1>
					<PostMeta
						className="mt-4"
						date={blog.createdAt}
						minutes={minutes}
						words={words}
						author={blog.author}
					/>
					<PostLifecycle post={blog} locale={locale} className="mt-6" />
				</header>

				<div className="prose mx-auto mt-8 font-serif">
					<MDX components={components} />
				</div>

				<TagPills className="mt-10" tags={blog.tags} />

				{blog.concepts?.length ? (
					<div className="mt-6 flex flex-wrap gap-2">
						{blog.concepts.map((concept) => (
							<span
								key={concept}
								className="rounded-md border bg-muted/30 px-2.5 py-1 text-xs text-muted-foreground"
							>
								{concept}
							</span>
						))}
					</div>
				) : null}

				<ContentGraph post={blog} posts={localePosts} />

				<NextReads reads={nextReads} />

				<PostNav older={older} newer={newer} />

				<Giscus locale={locale} />
			</div>
			{!isTocHidden && (
				<div className="hidden text-sm xl:block">
					<div className="sticky top-16 -mt-6 h-[calc(100vh-3.5rem)]">
						<div className="h-full overflow-auto pb-10 flex flex-col justify-between mt-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
							<DashboardTableOfContents items={blog.toc} />
							<GoToTop />
						</div>
					</div>
				</div>
			)}
		</main>
	);
}
