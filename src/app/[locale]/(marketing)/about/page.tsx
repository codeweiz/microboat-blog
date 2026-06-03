import { BookOpen, Github, Network, Rss } from "lucide-react";
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
	const cards =
		locale === "zh"
			? [
					{
						title: "Start Here",
						body: "新读者应该从入口文章开始，而不是直接面对原始时间线。",
						icon: BookOpen,
					},
					{
						title: "Concept Graph",
						body: "研究一个主题时，顺着概念、反向链接和系列路径继续走。",
						icon: Network,
					},
					{
						title: "Living Notes",
						body: "文章带着阶段、更新原因和关联阅读，所以发布之后还能继续生长。",
						icon: Rss,
					},
				]
			: [
					{
						title: "Start Here",
						body: "New readers should begin with entry essays rather than a raw timeline.",
						icon: BookOpen,
					},
					{
						title: "Concept Graph",
						body: "Follow concepts, backlinks, and series paths when researching a topic.",
						icon: Network,
					},
					{
						title: "Living Notes",
						body: "Posts carry stages, update reasons, and connected reads so they can keep growing.",
						icon: Rss,
					},
				];

	return (
		<section className="px-6 pt-32 pb-20">
			<div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.75fr_1.25fr]">
				<aside className="lg:sticky lg:top-28 lg:self-start">
					<p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
						About this site
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

				<div>
					<div className="space-y-5 font-serif text-[1.08rem] leading-9">
					{paragraphs.map((paragraph) => (
						<p key={paragraph}>{paragraph}</p>
					))}
				</div>

					<div className="mt-10 grid gap-4 md:grid-cols-3">
						{cards.map((card) => {
							const Icon = card.icon;
							return (
								<div key={card.title} className="rounded-lg border bg-muted/20 p-5">
									<Icon className="h-5 w-5 text-primary" />
									<h2 className="mt-4 font-serif text-xl font-semibold">
										{card.title}
									</h2>
									<p className="mt-2 text-sm leading-6 text-muted-foreground">
										{card.body}
									</p>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
