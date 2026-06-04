import { Github, Rss } from "lucide-react";
import type { Locale } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { AiDigestCarousel } from "@/components/ai/ai-digest-carousel";
import { Button } from "@/components/ui/button";
import { Link as I18nLink } from "@/i18n/navigation";
import { getTodayAiDigestItems } from "@/lib/ai-digest";
import { getPostsByLocale } from "@/lib/posts";

export default async function Home() {
	const locale = (await getLocale()) as Locale;
	const t = await getTranslations("home");

	const posts = getPostsByLocale(locale);
	const latest = posts.slice(0, 6);
	const heroPost = latest[0];
	const aiDigest = getTodayAiDigestItems(locale, 10);

	return (
		<>
			<AiDigestCarousel items={aiDigest} />

			<section className="px-6 pt-0 pb-10">
				<div className="mx-auto max-w-6xl">
					<div className="flex items-baseline justify-between border-b pb-4">
						<h2 className="font-serif text-2xl font-semibold">{t("latest")}</h2>
						<I18nLink
							href="/blog"
							className="text-sm text-muted-foreground hover:text-foreground"
						>
							{t("viewAll")} →
						</I18nLink>
					</div>
					<div className="mt-6 grid items-stretch gap-8 lg:h-[34rem] lg:grid-cols-[minmax(0,1.03fr)_minmax(24rem,0.97fr)]">
						{heroPost ? (
							<I18nLink
								href={`/blog/${heroPost.slug}`}
								className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card/40 transition-colors hover:border-primary/40"
							>
								{heroPost.image ? (
									<img
										src={heroPost.image}
										alt={heroPost.title}
										className="aspect-[16/8.5] w-full object-cover lg:h-0 lg:min-h-0 lg:flex-[1.35] lg:aspect-auto"
									/>
								) : null}
								<div className="min-h-0 p-5 lg:flex-[0.72]">
									<h1 className="font-serif text-2xl font-semibold leading-tight group-hover:underline md:text-3xl">
										{heroPost.title}
									</h1>
									<p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-foreground">
										{heroPost.description}
									</p>
								</div>
							</I18nLink>
						) : null}
						<ul className="grid divide-y border-y lg:grid-rows-5">
							{latest.slice(1, 6).map((post) => (
								<li key={post.slug} className="min-h-0">
									<I18nLink
										href={`/blog/${post.slug}`}
										className="group grid h-full gap-4 py-3 sm:grid-cols-[8rem_1fr] sm:items-center lg:py-0"
									>
										{post.image ? (
											<img
												src={post.image}
												alt=""
												className="aspect-[16/9] w-full rounded-md border object-cover"
											/>
										) : (
											<div className="hidden aspect-[16/9] rounded-md border bg-muted sm:block" />
										)}
										<div className="min-w-0">
											<h3 className="line-clamp-2 font-serif text-[0.98rem] font-medium leading-snug group-hover:underline">
												{post.title}
											</h3>
											<time className="mt-2 block text-xs text-muted-foreground tabular-nums">
												{post.createdAt.toLocaleDateString(locale, {
													year: "numeric",
													month: "short",
													day: "numeric",
												})}
											</time>
										</div>
									</I18nLink>
								</li>
							))}
						</ul>
					</div>
				</div>
			</section>

			<section className="px-6 pb-24">
				<div className="mx-auto max-w-6xl">
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
