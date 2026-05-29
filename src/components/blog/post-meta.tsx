import { getLocale, getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

/**
 * The byline shown under a post title and in list rows:
 * date · reading time · word count · author.
 */
export async function PostMeta({
	date,
	minutes,
	words,
	author,
	className,
}: {
	date: Date;
	minutes: number;
	words: number;
	author?: string;
	className?: string;
}) {
	const locale = await getLocale();
	const t = await getTranslations("post");

	return (
		<div
			className={cn(
				"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground tabular-nums",
				className,
			)}
		>
			<time dateTime={date.toISOString()}>
				{date.toLocaleDateString(locale, {
					year: "numeric",
					month: "long",
					day: "numeric",
				})}
			</time>
			<span aria-hidden>·</span>
			<span>{t("readingTime", { minutes })}</span>
			<span aria-hidden>·</span>
			<span>{t("words", { words })}</span>
			{author ? (
				<>
					<span aria-hidden>·</span>
					<span className="font-normal not-tabular-nums">{author}</span>
				</>
			) : null}
		</div>
	);
}
