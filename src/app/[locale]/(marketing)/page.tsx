import { ArrowRight, Github, Rss } from "lucide-react";
import type { Locale } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { KnowledgeLineage } from "@/components/home/knowledge-lineage";
import { Button } from "@/components/ui/button";
import { Link as I18nLink } from "@/i18n/navigation";
import { getPostsByLocale } from "@/lib/posts";

export default async function Home() {
	const locale = (await getLocale()) as Locale;
	const t = await getTranslations("home");

	const posts = getPostsByLocale(locale);
	const latest = posts.slice(0, 6);
	const heroPost = latest[0];

	return (
		<>
			<section className="px-6 pt-28 pb-12">
				<div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
					<div>
						<span className="text-sm text-muted-foreground">{t("badge")}</span>

						<h1 className="mt-5 max-w-3xl font-serif text-5xl font-semibold leading-[1.05] tracking-normal md:text-6xl">
							{t("title")}
						</h1>

						<p className="mt-6 max-w-2xl font-serif text-xl leading-9 text-muted-foreground">
							{t("intro")}
						</p>

						<div className="mt-10 flex flex-wrap items-center gap-3">
							<Button asChild size="lg" className="group">
								<I18nLink href="/blog">
									{t("cta")}
									<ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
								</I18nLink>
							</Button>
						</div>
					</div>
					{heroPost ? (
						<I18nLink
							href={`/blog/${heroPost.slug}`}
							className="group overflow-hidden rounded-lg border bg-muted/20 transition-colors hover:border-primary/40"
						>
							{heroPost.image ? (
								<img
									src={heroPost.image}
									alt={heroPost.title}
									className="aspect-[16/10] w-full object-cover"
								/>
							) : null}
							<div className="p-5">
								<div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
									<span>{heroPost.type}</span>
									<span>·</span>
									<span>{heroPost.stage}</span>
								</div>
								<h2 className="mt-3 font-serif text-2xl font-semibold leading-tight group-hover:underline">
									{heroPost.title}
								</h2>
								<p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
									{heroPost.description}
								</p>
							</div>
						</I18nLink>
					) : null}
				</div>
			</section>

			<KnowledgeLineage posts={latest} locale={locale} />

			<section className="px-6 pb-24">
				<div className="mx-auto max-w-6xl">
					<div className="flex items-baseline justify-between border-b pb-3">
						<h2 className="font-serif text-xl font-semibold">{t("latest")}</h2>
						<I18nLink
							href="/blog"
							className="text-sm text-muted-foreground hover:text-foreground"
						>
							{t("viewAll")} →
						</I18nLink>
					</div>
					<ul className="mt-2 grid gap-0 divide-y">
						{latest.map((post) => (
							<li key={post.slug}>
								<I18nLink
									href={`/blog/${post.slug}`}
									className="group grid gap-4 py-6 sm:grid-cols-[8rem_1fr_auto] sm:items-center"
								>
									{post.image ? (
										<img
											src={post.image}
											alt=""
											className="aspect-[16/10] w-full rounded-md border object-cover"
										/>
									) : (
										<div className="hidden aspect-[16/10] rounded-md border bg-muted sm:block" />
									)}
									<div className="min-w-0 flex-1">
										<h3 className="truncate font-serif text-lg font-medium group-hover:underline">
											{post.title}
										</h3>
										<p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
											{post.description}
										</p>
									</div>
									<time className="shrink-0 text-xs text-muted-foreground tabular-nums">
										{post.createdAt.toLocaleDateString(locale, {
											year: "numeric",
											month: "short",
											day: "numeric",
										})}
									</time>
								</I18nLink>
							</li>
						))}
					</ul>
					<div className="mt-10 flex flex-wrap gap-3 border-t pt-6">
						<Button asChild variant="outline">
							<a
								href="https://github.com/codeweiz"
								target="_blank"
								rel="noreferrer"
							>
								<Github className="mr-1 h-4 w-4" />
								GitHub
							</a>
						</Button>
						<Button asChild variant="outline">
							<a href="/rss.xml">
								<Rss className="mr-1 h-4 w-4" />
								RSS
							</a>
						</Button>
					</div>
				</div>
			</section>
		</>
	);
}
