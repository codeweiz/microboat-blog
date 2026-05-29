import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link as I18nLink } from "@/i18n/navigation";
import { metadata } from "@/lib/metadata";
import { getAllTags } from "@/lib/posts";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "tags" });
	return metadata({ title: t("title"), description: t("description") });
}

export default async function TagsPage({
	params,
}: {
	params: Promise<{ locale: Locale }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("tags");
	const tags = getAllTags(locale);

	return (
		<section className="pt-32 pb-20 px-6">
			<div className="mx-auto w-full max-w-3xl">
				<h1 className="font-serif text-3xl md:text-4xl font-semibold">
					{t("title")}
				</h1>
				<p className="mt-3 text-muted-foreground">{t("description")}</p>

				<ul className="mt-10 flex flex-wrap gap-3">
					{tags.map(({ tag, count }) => (
						<li key={tag}>
							<I18nLink
								href={`/tags/${encodeURIComponent(tag)}`}
								className="inline-flex items-start rounded-md border border-border bg-muted/40 px-3 py-1.5 text-sm transition-colors hover:border-foreground/40 hover:bg-muted"
							>
								{tag}
								<sup className="ml-1 text-[0.7em] text-muted-foreground tabular-nums">
									{count}
								</sup>
							</I18nLink>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
