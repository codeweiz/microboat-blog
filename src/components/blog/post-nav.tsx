import { ArrowLeft, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link as I18nLink } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/posts";

/** Previous (older) / next (newer) links at the foot of a post. */
export async function PostNav({
	older,
	newer,
}: {
	older: BlogPost | null;
	newer: BlogPost | null;
}) {
	if (!older && !newer) {
		return null;
	}
	const t = await getTranslations("post");

	return (
		<nav className="mt-12 grid grid-cols-1 gap-4 border-t pt-8 sm:grid-cols-2">
			{older ? (
				<I18nLink
					href={`/blog/${older.slug}`}
					className="group flex flex-col gap-1 rounded-lg border border-border p-4 transition-colors hover:border-foreground/30 hover:bg-muted/40"
				>
					<span className="flex items-center gap-1 text-xs text-muted-foreground">
						<ArrowLeft className="h-3.5 w-3.5" />
						{t("previous")}
					</span>
					<span className="font-medium group-hover:underline">
						{older.title}
					</span>
				</I18nLink>
			) : (
				<span className="hidden sm:block" />
			)}
			{newer ? (
				<I18nLink
					href={`/blog/${newer.slug}`}
					className="group flex flex-col items-end gap-1 rounded-lg border border-border p-4 text-right transition-colors hover:border-foreground/30 hover:bg-muted/40"
				>
					<span className="flex items-center gap-1 text-xs text-muted-foreground">
						{t("next")}
						<ArrowRight className="h-3.5 w-3.5" />
					</span>
					<span className="font-medium group-hover:underline">
						{newer.title}
					</span>
				</I18nLink>
			) : (
				<span className="hidden sm:block" />
			)}
		</nav>
	);
}
