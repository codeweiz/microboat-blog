"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { AiDigestItem } from "@/lib/ai-digest";

const digestLabels = {
	zh: {
		title: "今日 AI 快讯",
		action: "行动",
		background: "背景",
		process: "经过",
		impact: "影响",
		readOriginal: "阅读原文",
		close: "关闭快讯预览",
		prev: "上一条快讯",
		next: "下一条快讯",
		separator: "：",
	},
	en: {
		title: "Today in AI",
		action: "Action",
		background: "Background",
		process: "What changed",
		impact: "Impact",
		readOriginal: "Read source",
		close: "Close digest preview",
		prev: "Previous digest item",
		next: "Next digest item",
		separator: ": ",
	},
} as const;

export function AiDigestCarousel({ items }: { items: AiDigestItem[] }) {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	const activeItem = activeIndex === null ? null : items[activeIndex];
	const labels = items[0]?.locale === "en" ? digestLabels.en : digestLabels.zh;

	const move = (direction: -1 | 1) => {
		setActiveIndex((current) => {
			if (current === null || items.length === 0) {
				return current;
			}
			return (current + direction + items.length) % items.length;
		});
	};

	useEffect(() => {
		if (activeIndex === null) {
			return;
		}
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault();
				setActiveIndex(null);
			}
			if (event.key === "ArrowLeft") {
				event.preventDefault();
				move(-1);
			}
			if (event.key === "ArrowRight") {
				event.preventDefault();
				move(1);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [activeIndex]);

	if (items.length === 0) {
		return null;
	}

	return (
		<section className="px-6 pt-24 pb-12">
			<div className="mx-auto max-w-6xl">
				<div className="mb-5 flex items-center justify-between gap-4">
					<h2 className="font-serif text-2xl font-semibold">{labels.title}</h2>
				</div>
				<div
					data-ai-digest-scroller
					className="flex snap-x gap-4 overflow-x-auto pb-4 [scrollbar-width:thin]"
				>
					{items.map((item, index) => (
						<button
							key={item.id}
							type="button"
							onClick={() => setActiveIndex(index)}
							className="group grid h-[16.75rem] w-[22rem] min-w-0 shrink-0 snap-start grid-rows-[1.75rem_3.1rem_4.5rem_1fr] gap-y-3 overflow-hidden rounded-lg border bg-card/40 p-4 text-left transition-colors hover:border-primary/40 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 sm:w-[25.5rem] lg:w-[calc((100%_-_2rem)/3)]"
						>
							<div className="flex h-7 min-w-0 items-center gap-2 overflow-hidden text-xs text-muted-foreground">
								<span className="max-w-[8rem] shrink truncate rounded-sm bg-muted px-2 py-1">
									{item.source}
								</span>
								<span className="min-w-0 shrink truncate">{item.category}</span>
								<span className="shrink-0">·</span>
								<time className="shrink-0" dateTime={item.published_at}>
									{item.published_at}
								</time>
							</div>
							<h3 className="line-clamp-2 min-h-0 overflow-hidden break-words font-serif text-lg font-semibold leading-snug group-hover:underline">
								{item.title}
							</h3>
							<p className="line-clamp-3 min-h-0 overflow-hidden text-sm leading-6 text-muted-foreground">
								{item.chinese_summary}
							</p>
							<p className="min-h-0 overflow-hidden border-t pt-3 text-sm leading-6">
								<span className="block truncate">
									<span className="text-primary">
										{labels.action}
										{labels.separator}
									</span>
									{item.backend_focus}
								</span>
							</p>
						</button>
					))}
				</div>
			</div>

			{activeItem ? (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-sm"
					role="dialog"
					aria-modal="true"
					aria-labelledby="ai-digest-preview-title"
					onMouseDown={(event) => {
						if (event.target === event.currentTarget) {
							setActiveIndex(null);
						}
					}}
				>
					<div className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border bg-background shadow-2xl">
						<div className="border-b px-6 pt-5 pb-4">
							<div className="flex items-start justify-between gap-4">
								<div className="min-w-0">
									<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
										<span className="rounded-sm bg-muted px-2 py-1">
											{activeItem.source}
										</span>
										<span>{activeItem.category}</span>
										<span>·</span>
										<time dateTime={activeItem.published_at}>
											{activeItem.published_at}
										</time>
									</div>
									<h3
										id="ai-digest-preview-title"
										className="mt-4 font-serif text-2xl font-semibold leading-tight"
									>
										{activeItem.title}
									</h3>
								</div>
								<Button
									type="button"
									variant="outline"
									size="icon"
									onClick={() => setActiveIndex(null)}
									aria-label={labels.close}
									className="shrink-0"
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
							<p className="mt-4 text-sm leading-7 text-muted-foreground">
								{activeItem.chinese_summary}
							</p>
						</div>

						<div className="min-h-0 overflow-y-auto px-6 py-5">
							<div className="grid gap-4 text-sm leading-7">
								<DetailPoint
									label={labels.background}
									text={activeItem.background}
								/>
								<DetailPoint label={labels.process} text={activeItem.process} />
								<DetailPoint
									label={labels.impact}
									text={activeItem.why_it_matters}
								/>
								<DetailPoint
									label={labels.action}
									text={activeItem.backend_focus}
									strong
								/>
							</div>
						</div>

						<div className="flex flex-wrap items-center justify-between gap-3 border-t px-6 py-4">
							<a
								href={activeItem.url}
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
							>
								{labels.readOriginal}
								<ArrowUpRight className="h-4 w-4" />
							</a>
							<div className="flex items-center gap-2">
								<Button
									type="button"
									variant="outline"
									size="icon"
									onClick={() => move(-1)}
									aria-label={labels.prev}
								>
									<ArrowLeft className="h-4 w-4" />
								</Button>
								<span className="min-w-14 text-center text-xs text-muted-foreground tabular-nums">
									{activeIndex + 1} / {items.length}
								</span>
								<Button
									type="button"
									variant="outline"
									size="icon"
									onClick={() => move(1)}
									aria-label={labels.next}
								>
									<ArrowRight className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				</div>
			) : null}
		</section>
	);
}

function DetailPoint({
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
			<p className={strong ? "text-foreground" : "text-muted-foreground"}>
				{text}
			</p>
		</div>
	);
}
