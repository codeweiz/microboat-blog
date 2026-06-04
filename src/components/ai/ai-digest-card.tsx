import { ArrowUpRight } from "lucide-react";
import type { AiDigestItem } from "@/lib/ai-digest";
import { cn } from "@/lib/utils";

export function AiDigestCard({
	item,
	compact = false,
}: {
	item: AiDigestItem;
	compact?: boolean;
}) {
	const labels =
		item.locale === "en" ? digestCardLabels.en : digestCardLabels.zh;

	return (
		<article
			className={cn(
				"group rounded-lg border bg-card/50 p-4 transition-colors hover:border-primary/40",
				compact ? "space-y-3" : "space-y-4",
			)}
		>
			<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
				<span className="rounded-sm bg-muted px-2 py-1">{item.source}</span>
				<span>{item.category}</span>
				<span>·</span>
				<time dateTime={item.published_at}>{item.published_at}</time>
			</div>

			<div>
				<h3
					className={cn(
						"font-serif font-semibold leading-snug",
						compact ? "text-base" : "text-xl",
					)}
				>
					<a
						href={item.url}
						target="_blank"
						rel="noreferrer"
						className="inline-flex items-start gap-1.5 hover:underline"
					>
						<span>{item.title}</span>
						<ArrowUpRight className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
					</a>
				</h3>
				<p
					className={cn(
						"mt-2 text-muted-foreground",
						compact ? "line-clamp-3 text-sm leading-6" : "text-sm leading-7",
					)}
				>
					{item.chinese_summary}
				</p>
			</div>

			{compact ? (
				<div className="grid gap-2 border-t pt-3 text-sm leading-6">
					<p>
						<span className="text-primary">
							{labels.background}
							{labels.separator}
						</span>
						<span className="text-muted-foreground">{item.background}</span>
					</p>
					<p>
						<span className="text-primary">
							{labels.action}
							{labels.separator}
						</span>
						{item.backend_focus}
					</p>
				</div>
			) : (
				<div className="grid gap-3 border-t pt-4 text-sm leading-7">
					<DigestPoint label={labels.background} text={item.background} />
					<DigestPoint label={labels.process} text={item.process} />
					<DigestPoint label={labels.impact} text={item.why_it_matters} />
					<DigestPoint label={labels.action} text={item.backend_focus} strong />
				</div>
			)}
		</article>
	);
}

const digestCardLabels = {
	zh: {
		background: "背景",
		process: "经过",
		impact: "影响",
		action: "行动",
		separator: "：",
	},
	en: {
		background: "Background",
		process: "What changed",
		impact: "Impact",
		action: "Action",
		separator: ": ",
	},
} as const;

function DigestPoint({
	label,
	text,
	strong = false,
}: {
	label: string;
	text: string;
	strong?: boolean;
}) {
	return (
		<div className="grid gap-1 sm:grid-cols-[4.5rem_1fr]">
			<div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
				{label}
			</div>
			<p className={cn("text-muted-foreground", strong && "text-foreground")}>
				{text}
			</p>
		</div>
	);
}
