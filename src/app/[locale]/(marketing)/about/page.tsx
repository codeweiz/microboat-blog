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
		<section className="pt-32 pb-20 px-6">
			<div className="mx-auto w-full max-w-2xl">
				<h1 className="font-serif text-3xl md:text-4xl font-semibold">
					{t("heading")}
				</h1>
				<p className="mt-4 text-lg text-muted-foreground">{t("intro")}</p>

				<div className="mt-8 space-y-4 font-serif text-[1.05rem] leading-8">
					{paragraphs.map((paragraph) => (
						<p key={paragraph}>{paragraph}</p>
					))}
				</div>

				<div className="mt-10 border-t pt-6">
					<h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
						{t("elsewhere")}
					</h2>
					<div className="mt-3 flex flex-wrap gap-3">
						<a
							href="https://github.com/codeweiz"
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:border-foreground/40 hover:bg-muted"
						>
							<Github className="h-4 w-4" />
							GitHub
						</a>
						<a
							href="/rss.xml"
							className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:border-foreground/40 hover:bg-muted"
						>
							<Rss className="h-4 w-4" />
							RSS
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
