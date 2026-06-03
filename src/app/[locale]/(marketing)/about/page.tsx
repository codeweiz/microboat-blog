import { Github, Rss } from "lucide-react";
import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { metadata } from "@/lib/metadata";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "about" });
	return metadata({ title: t("title"), description: t("intro") });
}

export default async function AboutPage({
	params,
}: {
	params: Promise<{ locale: Locale }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("about");
	const paragraphs = t.raw("paragraphs") as string[];

	return (
		<section className="px-6 pt-32 pb-20">
			<div className="mx-auto grid w-full max-w-5xl gap-12 lg:grid-cols-[0.72fr_1.28fr]">
				<aside className="lg:sticky lg:top-28 lg:self-start">
					<p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
						About
					</p>
					<h1 className="mt-3 font-serif text-4xl font-semibold md:text-5xl">
						{t("heading")}
					</h1>
					<p className="mt-5 text-lg leading-8 text-muted-foreground">
						{t("intro")}
					</p>
					<div className="mt-8 grid gap-3">
						<a
							href="https://github.com/codeweiz"
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-foreground/40 hover:bg-muted"
						>
							<Github className="h-4 w-4" />
							GitHub
						</a>
						<a
							href="/rss.xml"
							className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-foreground/40 hover:bg-muted"
						>
							<Rss className="h-4 w-4" />
							RSS
						</a>
					</div>
				</aside>

				<div className="max-w-2xl">
					<div className="space-y-6 font-serif text-[1.12rem] leading-9">
						{paragraphs.map((paragraph) => (
							<p key={paragraph}>{paragraph}</p>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
