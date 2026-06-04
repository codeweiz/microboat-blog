"use client";

import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import type {
	AiObservationItem,
	AiObservationSource,
	AiObservationTimelineEntry,
} from "@/lib/ai-digest";
import { cn } from "@/lib/utils";

export function AiObservationBoard({
	sources,
	items,
	timeline,
	locale,
}: {
	sources: AiObservationSource[];
	items: AiObservationItem[];
	timeline: AiObservationTimelineEntry[];
	locale: string;
}) {
	const [activeSourceId, setActiveSourceId] = useState(sources[0]?.id ?? "");
	const activeSource = sources.find((source) => source.id === activeSourceId);
	const labels = locale === "en" ? observationLabels.en : observationLabels.zh;
	const activeItems = useMemo(
		() => items.filter((item) => item.source_id === activeSourceId),
		[activeSourceId, items],
	);

	if (!sources.length) {
		return null;
	}

	return (
		<div className="grid gap-5 lg:grid-cols-[16rem_1fr]">
			<aside className="lg:sticky lg:top-24 lg:self-start">
				<div className="mb-3 rounded-lg border bg-card p-4 shadow-sm">
					<p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
						{labels.archive}
					</p>
					<div className="mt-3 space-y-3">
						{timeline.map((entry) => (
							<div key={entry.date} className="border-l pl-3">
								<time className="block font-serif text-lg font-semibold">
									{entry.date}
								</time>
								<p className="mt-1 text-xs leading-5 text-muted-foreground">
									{entry.digestCount} {labels.digestItems} · {entry.itemCount}{" "}
									{labels.observations}
								</p>
							</div>
						))}
					</div>
				</div>
				<div className="rounded-lg border bg-card p-1.5 shadow-sm">
					{sources.map((source) => (
						<button
							key={source.id}
							type="button"
							onClick={() => setActiveSourceId(source.id)}
							className={cn(
								"relative flex min-h-14 w-full flex-col items-start justify-center rounded-md px-4 py-2 text-left transition-colors",
								source.id === activeSourceId
									? "bg-primary/10 text-primary"
									: "text-foreground hover:bg-muted/60",
							)}
						>
							<span
								className={cn(
									"absolute top-2 bottom-2 left-0 w-0.5 rounded-r-full",
									source.id === activeSourceId
										? "bg-primary"
										: "bg-transparent",
								)}
							/>
							<span className="text-sm font-semibold leading-5">
								{source.label}
							</span>
							<span className="mt-0.5 flex w-full items-center justify-between gap-2 text-xs text-muted-foreground">
								<span className="truncate">{source.category}</span>
								<span className="shrink-0 tabular-nums">{source.count}</span>
							</span>
						</button>
					))}
				</div>
			</aside>

			<section className="min-w-0 overflow-hidden rounded-lg border bg-card shadow-sm">
				<header className="border-b px-5 py-4">
					<p className="text-xs text-muted-foreground">
						{activeSource?.category}
					</p>
					<h1 className="mt-1 font-serif text-2xl font-semibold">
						{activeSource?.label}
					</h1>
					{activeSource?.description ? (
						<p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
							{activeSource.description}
						</p>
					) : null}
				</header>

				{activeItems.length > 0 ? (
					<div className="divide-y">
						{activeItems.map((item) => (
							<ObservationRow key={item.id} item={item} labels={labels} />
						))}
					</div>
				) : (
					<p className="px-5 py-10 text-sm text-muted-foreground">
						{labels.empty}
					</p>
				)}
			</section>
		</div>
	);
}

type ObservationLabels = {
	archive: string;
	digestItems: string;
	observations: string;
	impact: string;
	action: string;
	readOriginal: string;
	empty: string;
	separator: string;
};

function ObservationRow({
	item,
	labels,
}: {
	item: AiObservationItem;
	labels: ObservationLabels;
}) {
	const tags = getItemTags(item);

	return (
		<article className="group grid gap-4 px-5 py-5 transition-colors hover:bg-muted/35 sm:grid-cols-[minmax(0,1fr)_auto]">
			<div className="min-w-0">
				<a
					href={item.url}
					target="_blank"
					rel="noreferrer"
					className="inline-flex max-w-full items-start gap-1.5 font-serif text-lg font-semibold leading-snug hover:text-primary hover:underline"
				>
					<span className="min-w-0 break-words">{item.title}</span>
					<ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
				</a>
				<p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
					{item.summary}
				</p>
				{item.impact ? (
					<p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
						<span className="text-primary">
							{labels.impact}
							{labels.separator}
						</span>
						{item.impact}
					</p>
				) : null}
				{item.backend_focus ? (
					<p className="mt-2 line-clamp-2 text-sm leading-6">
						<span className="text-primary">
							{labels.action}
							{labels.separator}
						</span>
						{item.backend_focus}
					</p>
				) : null}
				{tags.length ? (
					<div className="mt-3 flex flex-wrap gap-1.5">
						{tags.map((tag) => (
							<span
								key={`${tag.type}-${tag.label}`}
								className={cn(
									"inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs leading-none",
									tag.type === "growth" &&
										"border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
									tag.type === "stat" &&
										"border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
									tag.type === "fork" &&
										"border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
									tag.type === "category" && "bg-muted text-muted-foreground",
									tag.type === "lang" && "bg-muted text-muted-foreground",
								)}
							>
								{tag.dotColor ? (
									<span
										className="h-2 w-2 rounded-full"
										style={{ backgroundColor: tag.dotColor }}
									/>
								) : null}
								{tag.label}
							</span>
						))}
					</div>
				) : null}
			</div>

			<div className="flex items-start sm:justify-end">
				<a
					href={item.url}
					target="_blank"
					rel="noreferrer"
					className="text-sm font-medium text-primary hover:underline"
				>
					{labels.readOriginal} →
				</a>
			</div>
		</article>
	);
}

const observationLabels = {
	zh: {
		archive: "快照归档",
		digestItems: "条快讯",
		observations: "条观察",
		impact: "影响",
		action: "行动",
		readOriginal: "阅读原文",
		empty: "当前来源暂无内容。",
		separator: "：",
	},
	en: {
		archive: "Snapshot Archive",
		digestItems: "digest items",
		observations: "observations",
		impact: "Impact",
		action: "Action",
		readOriginal: "Read source",
		empty: "No items for this source yet.",
		separator: ": ",
	},
} as const;

function getItemTags(item: AiObservationItem) {
	const tags: {
		label: string;
		type: "lang" | "stat" | "fork" | "growth" | "category";
		dotColor?: string;
	}[] = [];
	const meta = item.meta ?? {};

	if (item.source_id === "github-daily" || item.source_id === "github-weekly") {
		if (meta.language) {
			tags.push({
				label: String(meta.language),
				type: "lang",
				dotColor: languageColor(String(meta.language)),
			});
		}
		if (typeof meta.stars === "number") {
			tags.push({ label: `☆ ${meta.stars.toLocaleString()}`, type: "stat" });
		}
		if (typeof meta.forks === "number") {
			tags.push({ label: `⑂ ${meta.forks.toLocaleString()}`, type: "fork" });
		}
		if (meta.stars_period) {
			tags.push({ label: String(meta.stars_period), type: "growth" });
		}
		return tags;
	}

	if (item.source_id === "hacker-news") {
		if (typeof meta.score === "number") {
			tags.push({ label: `▲ ${meta.score}`, type: "stat" });
		}
		if (typeof meta.comments === "number") {
			tags.push({ label: `${meta.comments} comments`, type: "fork" });
		}
		return tags;
	}

	if (meta.content_type) {
		tags.push({ label: String(meta.content_type), type: "category" });
	}
	if (item.published_at) {
		tags.push({ label: formatDate(item.published_at), type: "category" });
	}
	return tags;
}

function formatDate(value: string) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return value;
	}
	return date.toISOString().slice(0, 10);
}

function languageColor(language: string) {
	const colors: Record<string, string> = {
		JavaScript: "#f1e05a",
		TypeScript: "#3178c6",
		Python: "#3572A5",
		Go: "#00ADD8",
		Rust: "#dea584",
		Java: "#b07219",
	};
	return colors[language] ?? "#737373";
}
