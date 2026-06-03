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
	const date = updated ? post.updatedAt : post.createdAt;

	return (
		<div
			className={cn(
				"mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-muted-foreground",
				className,
			)}
		>
			<span>{post.type}</span>
			<span aria-hidden>·</span>
			<span>{post.stage}</span>
			{post.series ? (
				<>
					<span aria-hidden>·</span>
					<span>
						{post.series}
						{post.seriesOrder ? ` #${post.seriesOrder}` : ""}
					</span>
				</>
			) : null}
			<span aria-hidden>·</span>
			<span>
				{updated ? "updated" : "published"}{" "}
				{date.toLocaleDateString(locale, {
					year: "numeric",
					month: "short",
					day: "numeric",
				})}
			</span>
		</div>
	);
}
