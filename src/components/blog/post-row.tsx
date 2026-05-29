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
