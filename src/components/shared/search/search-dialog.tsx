"use client";

import { FileText, Search as SearchIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "@/i18n/navigation";
import type { SearchEntry } from "@/lib/posts";

export function SearchDialog({ index }: { index: SearchEntry[] }) {
	const t = useTranslations("search");
	const locale = useLocale();
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setOpen((prev) => !prev);
			}
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, []);

	const results = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) {
			return index;
		}
		const terms = q.split(/\s+/);
		return index.filter((entry) => {
			const haystack = [
				entry.title,
				entry.description,
				entry.tags.join(" "),
				entry.headings.join(" "),
			]
				.join(" ")
				.toLowerCase();
			return terms.every((term) => haystack.includes(term));
		});
	}, [query, index]);

	const go = (slug: string) => {
		setOpen(false);
		setQuery("");
		router.push(`/blog/${slug}`);
	};

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				aria-label={t("label")}
				className="flex items-center gap-2 rounded-md border border-border bg-background/60 px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
			>
				<SearchIcon className="h-4 w-4" />
				<span className="hidden sm:inline">{t("label")}</span>
				<kbd className="hidden rounded border border-border bg-muted px-1.5 font-mono text-[10px] sm:inline">
					⌘K
				</kbd>
			</button>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent
					showCloseButton={false}
					className="top-[15%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl"
				>
					<DialogTitle className="sr-only">{t("label")}</DialogTitle>
					<div className="flex items-center gap-2 border-b px-4">
						<SearchIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
						<input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder={t("placeholder")}
							className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-muted-foreground"
						/>
					</div>
					<div className="max-h-[60vh] overflow-y-auto p-2">
						{results.length === 0 ? (
							<p className="px-3 py-8 text-center text-sm text-muted-foreground">
								{t("empty")}
							</p>
						) : (
							<ul>
								{results.map((entry) => (
									<li key={entry.slug}>
										<button
											type="button"
											onClick={() => go(entry.slug)}
											className="flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-muted"
										>
											<FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
											<span className="min-w-0">
												<span className="block truncate font-medium">
													{entry.title}
												</span>
												<span className="block truncate text-sm text-muted-foreground">
													{entry.description}
												</span>
											</span>
											<time
												dateTime={entry.date}
												className="ml-auto shrink-0 pt-0.5 text-xs text-muted-foreground tabular-nums"
											>
												{new Date(entry.date).toLocaleDateString(locale, {
													year: "numeric",
													month: "short",
												})}
											</time>
										</button>
									</li>
								))}
							</ul>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
