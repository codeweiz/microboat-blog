import { Link as I18nLink } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/** Clickable tag chips that link through to the per-tag listing. */
export function TagPills({
	tags,
	className,
}: {
	tags?: string[];
	className?: string;
}) {
	if (!tags?.length) {
		return null;
	}

	return (
		<ul className={cn("flex flex-wrap gap-2", className)}>
			{tags.map((tag) => (
				<li key={tag}>
					<I18nLink
						href={`/tags/${encodeURIComponent(tag)}`}
						className="inline-block rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
					>
						{tag}
					</I18nLink>
				</li>
			))}
		</ul>
	);
}
