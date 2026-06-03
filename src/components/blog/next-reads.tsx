import { Link as I18nLink } from "@/i18n/navigation";
import type { NextRead } from "@/lib/recommendations";

export function NextReads({ reads }: { reads: NextRead[] }) {
	if (!reads.length) {
		return null;
	}

	return (
		<section className="mt-12 border-t pt-8">
			<div className="flex items-baseline justify-between gap-4">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
						Read next because
					</p>
					<h2 className="mt-2 font-serif text-2xl font-semibold">
						关联阅读，不是猜你喜欢。
					</h2>
				</div>
			</div>
			<div className="mt-5 grid gap-3">
				{reads.map(({ post, reasons }) => (
					<I18nLink
						key={post.slug}
						href={`/blog/${post.slug}`}
						className="group rounded-lg border bg-muted/20 p-4 transition-colors hover:border-primary/40 hover:bg-muted/30"
					>
						<div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
							{reasons.slice(0, 3).map((reason) => (
								<span
									key={reason}
									className="rounded border bg-background px-2 py-1"
								>
									{reason}
								</span>
							))}
						</div>
						<h3 className="mt-3 font-serif text-xl font-semibold group-hover:underline">
							{post.title}
						</h3>
						<p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
							{post.description}
						</p>
					</I18nLink>
				))}
			</div>
		</section>
	);
}
