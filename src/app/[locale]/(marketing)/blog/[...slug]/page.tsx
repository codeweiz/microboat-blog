import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { components } from "@/components/blog/mdx-components";
import { metadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import { blogs as allBlogs } from "@/source";

import "@/styles/docs-mdx.css";
import { Giscus } from "@/components/blog/giscus";
import { GoToTop } from "@/components/blog/go-to-top";
import { DashboardTableOfContents } from "@/components/blog/toc";

const blogs = Array.from(allBlogs);

export const dynamic = "force-dynamic";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string[]; locale: Locale }>;
}): Promise<Metadata | undefined> {
	const { slug, locale } = await params;

	const blog = (await getBlogsFromParams(slug)) as any;

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
	params: Promise<{ slug: string[] }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getBlogsFromParams(slugs: string[]) {
	const locale = await getLocale();
	const slug = slugs?.join("/") || "";
	const blog = blogs.find(
		(blog: any) => blog.slug === slug && blog.locale === locale,
	);

	if (!blog) {
		return null;
	}

	return blog;
}

export async function generateStaticParams(): Promise<string[]> {
	return blogs.map((blog: any) => blog.slug.split("/"));
}

export default async function BlogPage(props: BlogsPageProps) {
	const isTocHidden = false;
	const { slug } = await props.params;
	const blog = (await getBlogsFromParams(slug)) as any;
	const locale = await getLocale();

	if (!blog) {
		notFound();
	}

	const MDX = blog.body;

	return (
		<main
			className={cn(
				"relative max-w-full md:max-w-7xl mx-auto lg:gap-10 py-24 md:py-32 xl:grid xl:grid-cols-[1fr_300px] px-4 xs:px-0",
				isTocHidden && "xl:grid-cols-[1fr]",
			)}
		>
			<div className="max-w-4xl mx-auto w-full">
				<div>
					<h1 className="text-2xl md:text-[32px] font-bold">{blog.title}</h1>
				</div>

				<div className="my-4">
					<p className="text-sm">{blog.createdAt.toLocaleDateString()}</p>
				</div>

				<div className="prose mx-auto">
					<MDX components={components} />
				</div>

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
