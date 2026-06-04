import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AiObservationBoard } from "@/components/ai/ai-observation-board";
import {
	getAiObservationItems,
	getAiObservationSources,
	getAiObservationTimeline,
} from "@/lib/ai-digest";
import { metadata } from "@/lib/metadata";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "ai" });
	return metadata({
		title: t("title"),
		description: t("description"),
		keywords: t("keywords")?.split(",") || [],
	});
}

export default async function AiPage({
	params,
}: {
	params: Promise<{ locale: Locale }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("ai");
	const sources = getAiObservationSources(locale);
	const items = getAiObservationItems(locale);
	const timeline = getAiObservationTimeline();

	return (
		<section className="px-6 pt-28 pb-20">
			<div className="mx-auto w-full max-w-6xl">
				<p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
					{t("kicker")}
				</p>
				<AiObservationBoard
					sources={sources}
					items={items}
					timeline={timeline}
					locale={locale}
				/>
			</div>
		</section>
	);
}
