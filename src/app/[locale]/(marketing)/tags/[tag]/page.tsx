import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PostRow } from "@/components/blog/post-row";
import { Link as I18nLink } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { metadata } from "@/lib/metadata";
import { getAllTags, getPostsByTag } from "@/lib/posts";

type TagPageProps = {
	params: Promise<{ tag: string; locale: Locale }>;
};

export function generateStaticParams() {
	const params: { locale: string; tag: string }[] = [];
	for (const locale of routing.locales) {
		for (const { tag } of getAllTags(locale)) {
			params.push({ locale, tag: encodeURIComponent(tag) });
		}
	}
	return params;
}

export async function generateMetadata({
	params,
}: TagPageProps): Promise<Metadata | undefined> {
	const { tag, locale } = await params;
	const decoded = decodeURIComponent(tag);
	const t = await getTranslations({ locale, namespace: "tags" });
	return metadata({ title: t("taggedWith", { tag: decoded }) });
}

export default async function TagPage({ params }: TagPageProps) {
	const { tag, locale } = await params;
	setRequestLocale(locale);
	const decoded = decodeURIComponent(tag);
	const t = await getTranslations("tags");
	const posts = getPostsByTag(decoded, locale);

	if (!posts.length) {
		notFound();
	}

	return (
		<section className="pt-32 pb-20 px-6">
			<div className="mx-auto w-full max-w-3xl">
				<I18nLink
					href="/tags"
					className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeft className="h-3.5 w-3.5" />
					{t("allTags")}
				</I18nLink>

				<h1 className="mt-4 font-serif text-3xl md:text-4xl font-semibold">
					{t("taggedWith", { tag: decoded })}
				</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					{t("postCount", { count: posts.length })}
				</p>

				<div className="mt-8 divide-y border-t">
					{posts.map((post) => (
						<PostRow key={post.slug} post={post} />
					))}
				</div>
			</div>
		</section>
	);
}
