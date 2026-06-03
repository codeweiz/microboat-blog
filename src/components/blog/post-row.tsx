import { Link as I18nLink } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/posts";
import { postStats } from "@/lib/posts";
import { PostMeta } from "./post-meta";

/** Compact post row (title + byline) used by the archive and tag listings. */
export function PostRow({ post }: { post: BlogPost }) {
	const { minutes, words } = postStats(post);

	return (
		<article className="grid gap-4 py-5 sm:grid-cols-[9rem_1fr] sm:items-start">
			<I18nLink
				href={`/blog/${post.slug}`}
				className="group overflow-hidden rounded-md border bg-muted/20"
			>
				{post.image ? (
					<img
						src={post.image}
						alt=""
						className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
					/>
				) : (
					<div className="aspect-[16/10] w-full bg-muted" />
				)}
			</I18nLink>
			<div className="min-w-0">
				<h3 className="font-serif text-lg font-medium leading-snug md:text-xl">
					<I18nLink href={`/blog/${post.slug}`} className="hover:underline">
						{post.title}
					</I18nLink>
				</h3>
				<p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
					{post.description}
				</p>
				<PostMeta
					className="mt-1.5"
					date={post.createdAt}
					minutes={minutes}
					words={words}
					author={post.author}
				/>
			</div>
		</article>
	);
}
