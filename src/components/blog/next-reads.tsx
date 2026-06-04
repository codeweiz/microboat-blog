import { Link as I18nLink } from "@/i18n/navigation";
import type { NextRead } from "@/lib/recommendations";

export function NextReads({ reads }: { reads: NextRead[] }) {
	if (!reads.length) {
		return null;
	}

	return (
		<section className="mt-12 border-t pt-8">
			<h2 className="font-serif text-2xl font-semibold">关联阅读</h2>
			<ul className="mt-5 grid divide-y border-y">
				{reads.map(({ post }) => (
					<li key={post.slug} className="min-h-0">
						<I18nLink
							href={`/blog/${post.slug}`}
							className="group grid h-full gap-4 py-4 sm:grid-cols-[8rem_1fr] sm:items-center"
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
								<h3 className="line-clamp-2 font-serif text-lg font-medium leading-snug group-hover:underline">
									{post.title}
								</h3>
								<p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
									{post.description}
								</p>
							</div>
						</I18nLink>
					</li>
				))}
			</ul>
		</section>
	);
}
