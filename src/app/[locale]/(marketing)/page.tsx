import { ArrowRight, Github } from "lucide-react";
import type { Locale } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link as I18nLink } from "@/i18n/navigation";
import { blogs as allBlogs } from "@/source";

const blogs = Array.from(allBlogs);

export default async function Home() {
	const locale = (await getLocale()) as Locale;
	const t = await getTranslations("home");
	const stack = t.raw("stack") as string[];

	const latestPosts = blogs
		.filter((post: any) => post.locale === locale)
		.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime())
		.slice(0, 3);

	return (
		<>
			<section className="relative overflow-hidden pt-36 pb-24 px-6">
				{/* grid */}
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 -z-20 [mask-image:radial-gradient(ellipse_at_top,black_25%,transparent_70%)]"
				>
					<div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.88_0_0/.45)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.88_0_0/.45)_1px,transparent_1px)] bg-[size:48px_48px] dark:bg-[linear-gradient(to_right,oklch(0.3_0_0/.4)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.3_0_0/.4)_1px,transparent_1px)]" />
				</div>

				{/* drifting mesh orbs */}
				<div
					aria-hidden
					className="animate-blob-drift pointer-events-none absolute -left-32 -top-24 -z-10 h-[480px] w-[480px] rounded-full bg-gradient-to-br from-indigo-400/40 via-violet-400/25 to-transparent blur-3xl dark:from-indigo-500/30 dark:via-violet-500/20"
				/>
				<div
					aria-hidden
					className="animate-blob-drift pointer-events-none absolute -right-32 top-40 -z-10 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-cyan-400/35 via-emerald-400/20 to-transparent blur-3xl dark:from-cyan-500/25 dark:via-emerald-500/15"
					style={{ animationDelay: "-7s" }}
				/>

				<div className="mx-auto max-w-3xl text-center">
					<span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
						<span className="relative flex size-1.5">
							<span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
							<span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
						</span>
						{t("badge")}
					</span>

					<h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
						<span className="text-foreground">{t("title").split(",")[0]},</span>
						<br />
						<span className="animate-shimmer-sweep bg-[linear-gradient(110deg,oklch(0.55_0.18_265),oklch(0.65_0.22_310),oklch(0.6_0.2_200),oklch(0.55_0.18_265))] bg-clip-text text-transparent">
							{t("title").split(",")[1]?.trim()}
						</span>
					</h1>

					<p className="mx-auto mt-6 max-w-xl text-base md:text-lg text-muted-foreground">
						{t("intro")}
					</p>

					<ul className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-2">
						{stack.map((tag) => (
							<li
								key={tag}
								className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
							>
								{tag}
							</li>
						))}
					</ul>

					<div className="mt-10 flex flex-wrap items-center justify-center gap-3">
						<Button asChild size="lg" className="group">
							<I18nLink href="/blog">
								{t("cta")}
								<ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
							</I18nLink>
						</Button>
						<Button asChild size="lg" variant="outline">
							<a
								href="https://github.com/codeweiz/microboat-blog"
								target="_blank"
								rel="noreferrer"
							>
								<Github className="mr-1 h-4 w-4" />
								GitHub
							</a>
						</Button>
					</div>
				</div>
			</section>

			<section className="px-6 pb-24">
				<div className="mx-auto max-w-3xl">
					<div className="flex items-baseline justify-between border-b pb-3">
						<h2 className="text-xl font-semibold">{t("latest")}</h2>
						<I18nLink
							href="/blog"
							className="text-sm text-muted-foreground hover:text-foreground"
						>
							{t("viewAll")} →
						</I18nLink>
					</div>
					<ul className="mt-2 divide-y">
						{latestPosts.map((post: any) => (
							<li key={post.slug}>
								<I18nLink
									href={`/blog/${post.slug}`}
									className="group flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
								>
									<div className="min-w-0 flex-1">
										<h3 className="truncate text-base font-medium group-hover:underline">
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
				</div>
			</section>
		</>
	);
}
