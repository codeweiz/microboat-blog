import { Link as I18nLink } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/posts";
import { postStats } from "@/lib/posts";
import { PostMeta } from "./post-meta";

/** Compact post row (title + byline) used by the archive and tag listings. */
export function PostRow({ post }: { post: BlogPost }) {
	const { minutes, words } = postStats(post);

	return (
		<article className="py-5">
			<h3 className="font-serif text-lg md:text-xl font-medium leading-snug">
				<I18nLink href={`/blog/${post.slug}`} className="hover:underline">
					{post.title}
				</I18nLink>
			</h3>
			<div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
				<span className="rounded border px-1.5 py-0.5 uppercase">{post.type}</span>
				<span className="rounded border px-1.5 py-0.5">{post.stage}</span>
				{post.concepts?.slice(0, 2).map((concept) => (
					<span key={concept} className="rounded border px-1.5 py-0.5">
						{concept}
					</span>
				))}
			</div>
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
		</article>
	);
}
