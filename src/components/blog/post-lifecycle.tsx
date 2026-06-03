import type { BlogPost } from "@/lib/posts";
import { cn } from "@/lib/utils";

export function PostLifecycle({
	post,
	locale,
	className,
}: {
	post: BlogPost;
	locale: string;
	className?: string;
}) {
	const updated = post.updatedAt.getTime() > post.createdAt.getTime();

	return (
		<section
			className={cn(
				"grid gap-3 rounded-lg border bg-muted/20 p-4 text-sm md:grid-cols-2",
				className,
			)}
		>
			<div>
				<div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
					Lifecycle
				</div>
				<div className="mt-2 flex flex-wrap gap-2">
					<span className="rounded border bg-background/70 px-2 py-1 uppercase">
						{post.type}
					</span>
					<span className="rounded border bg-background/70 px-2 py-1">
						{post.stage}
					</span>
					{post.series && (
						<span className="rounded border bg-background/70 px-2 py-1">
							{post.series}
							{post.seriesOrder ? ` #${post.seriesOrder}` : ""}
						</span>
					)}
				</div>
			</div>
			<div>
				<div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
					{updated ? "Updated" : "Published"}
				</div>
				<p className="mt-2 text-muted-foreground">
					{(updated ? post.updatedAt : post.createdAt).toLocaleDateString(locale, {
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</p>
				{post.updatedReason && (
					<p className="mt-2 leading-6 text-muted-foreground">
						{post.updatedReason}
					</p>
				)}
			</div>
		</section>
	);
}
