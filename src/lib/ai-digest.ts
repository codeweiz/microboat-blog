import observation from "../content/ai-observation/daily/2026-06-04.json" with {
	type: "json",
};

export interface AiDigestItem {
	id: string;
	locale: string;
	source: string;
	source_id: string;
	category_id: string;
	category: string;
	title: string;
	url: string;
	published_at: string;
	original_summary: string;
	background: string;
	process: string;
	why_it_matters: string;
	chinese_summary: string;
	backend_focus: string;
	meta: {
		content_type?: string;
		impact?: string;
		[key: string]: string | number | undefined;
	};
}

export interface AiDigestRefresh {
	mode: string;
	description: string;
	next_step: string;
}

export interface AiObservationTimelineEntry {
	date: string;
	generatedAt: string;
	itemCount: number;
	digestCount: number;
	sourceCount: number;
}

export interface AiDigestSourceSummary {
	id: string;
	label: string;
	category?: string;
	count: number;
}

export interface AiObservationSource {
	id: string;
	label: string;
	category: string;
	description: string;
	count: number;
}

export interface AiObservationItem {
	id: string;
	source_id: string;
	source: string;
	category: string;
	title: string;
	url: string;
	published_at?: string;
	summary: string;
	impact?: string;
	backend_focus?: string;
	meta: {
		language?: string;
		stars?: number;
		forks?: number;
		stars_period?: string;
		score?: number;
		comments?: number;
		content_type?: string;
		[key: string]: string | number | undefined;
	};
}

interface AiDigestPickCopy {
	title: string;
	summary: string;
	background: string;
	process: string;
	impact: string;
	action: string;
}

interface AiDigestPick {
	id: string;
	zh: AiDigestPickCopy;
	en: AiDigestPickCopy;
}

interface AiObservationSnapshot {
	date: string;
	generated_at: string;
	items: AiObservationItem[];
	digest: {
		picks: AiDigestPick[];
	};
}

const sourceOrder = [
	"openai",
	"anthropic",
	"tldr-ai",
	"infoq",
	"github-daily",
	"github-weekly",
	"hacker-news",
	"v2ex",
];

const observationSourceCopy = {
	zh: {
		"github-daily": {
			label: "今日开源热榜",
			category: "GitHub · 日榜",
			description: "今天在 GitHub 上增长最快、最值得工程团队扫一眼的项目。",
		},
		"github-weekly": {
			label: "本周开源精选",
			category: "GitHub · 周榜",
			description: "用一周维度过滤短期噪声，保留更稳定的开源趋势。",
		},
		"hacker-news": {
			label: "硅谷社区热议",
			category: "Hacker News",
			description: "看工程师社区正在争论什么，而不是只看厂商公告。",
		},
		v2ex: {
			label: "中文技术社区热议",
			category: "V2EX",
			description: "中文开发者现场反馈，常常比正式公告更早暴露真实摩擦。",
		},
		openai: {
			label: "OpenAI 最新动态",
			category: "官方更新",
			description: "OpenAI 产品、模型和平台能力更新。",
		},
		anthropic: {
			label: "Anthropic 最新动态",
			category: "官方更新",
			description: "Claude、Agent、安全和企业协作相关更新。",
		},
		infoq: {
			label: "AI 工程实践",
			category: "InfoQ",
			description: "偏工程落地、架构迁移和团队实践的 AI 内容。",
		},
		"tldr-ai": {
			label: "AI 速报精选",
			category: "TLDR AI",
			description: "适合快速扫描的大厂、产品和研究动态。",
		},
	},
	en: {
		"github-daily": {
			label: "GitHub Daily Trending",
			category: "GitHub · Daily",
			description:
				"Fast-moving repositories worth a quick engineering scan today.",
		},
		"github-weekly": {
			label: "GitHub Weekly Picks",
			category: "GitHub · Weekly",
			description: "A weekly view that filters out some single-day noise.",
		},
		"hacker-news": {
			label: "Hacker News Hot",
			category: "Hacker News",
			description:
				"What engineers are arguing about beyond official announcements.",
		},
		v2ex: {
			label: "V2EX Hot Topics",
			category: "V2EX",
			description: "Chinese developer community signals and field notes.",
		},
		openai: {
			label: "OpenAI Updates",
			category: "Official",
			description: "OpenAI product, model, and platform updates.",
		},
		anthropic: {
			label: "Anthropic Updates",
			category: "Official",
			description:
				"Claude, agent, safety, and enterprise collaboration updates.",
		},
		infoq: {
			label: "AI Engineering",
			category: "InfoQ",
			description:
				"Engineering-first AI adoption, migration, and architecture.",
		},
		"tldr-ai": {
			label: "TLDR AI Digest",
			category: "TLDR AI",
			description: "A quick scan of product, research, and market updates.",
		},
	},
} as const;

const observationSourceOrder = [
	"github-daily",
	"github-weekly",
	"hacker-news",
	"v2ex",
	"openai",
	"anthropic",
	"infoq",
	"tldr-ai",
] as const;

const observationSnapshot = observation as AiObservationSnapshot;
const observationItems = observationSnapshot.items;
const observationGeneratedAt = observationSnapshot.generated_at;
const snapshotDate = observationGeneratedAt.slice(0, 10);
const digestPicks = observationSnapshot.digest.picks;
const digestPickMap = new Map(digestPicks.map((pick) => [pick.id, pick]));

const refresh: AiDigestRefresh = {
	mode: "static-snapshot",
	description:
		"AI 快讯从 AI 观察快照里人工精选十条，随博客发布或选题整理时更新，不追求实时自动采集。",
	next_step:
		"先更新 AI 观察数据，再从同一份快照里挑选首页快讯；需要扩写时再让 LLM 生成草稿并人工校对。",
};

export function getAiDigestGeneratedAt(): Date {
	return new Date(observationGeneratedAt);
}

export function getAiDigestRefresh(): AiDigestRefresh {
	return refresh;
}

export function getAiDigestByLocale(locale: string): AiDigestItem[] {
	const targetLocale = locale === "en" ? "en" : "zh";
	const digestItems = digestPicks
		.map((pick) => ({
			pick,
			item: observationItems.find((item) => item.id === pick.id),
		}))
		.filter((entry): entry is { pick: AiDigestPick; item: AiObservationItem } =>
			Boolean(entry.item),
		)
		.map(({ item, pick }) => toDigestItem(item, pick, targetLocale));

	return digestItems.sort(
		(a, b) => Date.parse(b.published_at) - Date.parse(a.published_at),
	);
}

export function getTodayAiDigestItems(
	locale: string,
	limit = 3,
): AiDigestItem[] {
	return getAiDigestByLocale(locale).slice(0, limit);
}

function formatDigestDate(publishedAt?: string) {
	if (!publishedAt) {
		return snapshotDate;
	}
	const isoDate = publishedAt.match(/^(\d{4})-(\d{2})-(\d{2})/);
	if (isoDate) {
		return `${isoDate[1]}-${isoDate[2]}-${isoDate[3]}`;
	}
	const shortMonthDate = publishedAt.match(
		/^([A-Za-z]{3}) (\d{1,2}), (\d{4})$/,
	);
	if (shortMonthDate) {
		const monthIndex = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		].indexOf(shortMonthDate[1]);
		if (monthIndex !== -1) {
			return `${shortMonthDate[3]}-${String(monthIndex + 1).padStart(2, "0")}-${shortMonthDate[2].padStart(2, "0")}`;
		}
	}
	const date = new Date(publishedAt);
	if (Number.isNaN(date.getTime())) {
		return publishedAt.slice(0, 10) || snapshotDate;
	}
	return date.toISOString().slice(0, 10);
}

function toDigestItem(
	item: AiObservationItem,
	pick: AiDigestPick,
	locale: "zh" | "en",
): AiDigestItem {
	const copy = pick[locale];
	const sourceCopy =
		getObservationCopy(locale)[
			item.source_id as keyof ReturnType<typeof getObservationCopy>
		];
	const date = formatDigestDate(item.published_at);

	return {
		id: `${item.id}-${locale}`,
		locale,
		source: item.source,
		source_id: item.source_id,
		category_id: item.source_id,
		category: sourceCopy?.category ?? item.category,
		title: copy.title,
		url: item.url,
		published_at: date,
		original_summary: item.summary,
		background: copy.background,
		process: copy.process,
		why_it_matters: copy.impact,
		chinese_summary: copy.summary,
		backend_focus: copy.action,
		meta: item.meta,
	};
}

export function getAiDigestSources(locale: string): AiDigestSourceSummary[] {
	const summaries = new Map<string, AiDigestSourceSummary>();
	for (const item of getAiDigestByLocale(locale)) {
		const summary = summaries.get(item.category_id);
		if (summary) {
			summary.count += 1;
		} else {
			summaries.set(item.category_id, {
				id: item.category_id,
				label: item.category,
				count: 1,
			});
		}
	}
	return Array.from(summaries.values()).sort(
		(a, b) =>
			(sourceOrder.indexOf(a.id) === -1
				? Number.MAX_SAFE_INTEGER
				: sourceOrder.indexOf(a.id)) -
			(sourceOrder.indexOf(b.id) === -1
				? Number.MAX_SAFE_INTEGER
				: sourceOrder.indexOf(b.id)),
	);
}

function getObservationCopy(locale: string) {
	return locale === "en" ? observationSourceCopy.en : observationSourceCopy.zh;
}

export function getAiObservationItems(
	locale: string,
	sourceId?: string,
): AiObservationItem[] {
	const filtered = sourceId
		? observationItems.filter((item) => item.source_id === sourceId)
		: observationItems;
	const targetLocale = locale === "en" ? "en" : "zh";
	return filtered
		.map((item) => localizeObservationItem(item, targetLocale))
		.sort((a, b) => {
			const dateDelta =
				Date.parse(b.published_at ?? "") - Date.parse(a.published_at ?? "");
			if (Number.isFinite(dateDelta) && dateDelta !== 0) {
				return dateDelta;
			}
			return (
				observationSourceOrder.indexOf(
					a.source_id as (typeof observationSourceOrder)[number],
				) -
				observationSourceOrder.indexOf(
					b.source_id as (typeof observationSourceOrder)[number],
				)
			);
		});
}

export function getAiObservationSources(locale: string): AiObservationSource[] {
	const copy = getObservationCopy(locale);
	const counts = new Map<string, number>();
	for (const item of getAiObservationItems(locale)) {
		counts.set(item.source_id, (counts.get(item.source_id) ?? 0) + 1);
	}
	return observationSourceOrder.map((id) => ({
		id,
		label: copy[id].label,
		category: copy[id].category,
		description: copy[id].description,
		count: counts.get(id) ?? 0,
	}));
}

export function getAiObservationTimeline(): AiObservationTimelineEntry[] {
	return [
		{
			date: observationSnapshot.date,
			generatedAt: observationGeneratedAt,
			itemCount: observationItems.length,
			digestCount: digestPicks.length,
			sourceCount: observationSourceOrder.length,
		},
	];
}

function localizeObservationItem(
	item: AiObservationItem,
	locale: "zh" | "en",
): AiObservationItem {
	const pick = digestPickMap.get(item.id);
	if (pick) {
		const copy = pick[locale];
		return {
			...item,
			title: copy.title,
			summary: copy.summary,
			impact: copy.impact,
			backend_focus: copy.action,
		};
	}

	return {
		...item,
		summary: localizeObservationSummary(item, locale),
		backend_focus: observationAction(item, locale),
	};
}

function localizeObservationSummary(
	item: AiObservationItem,
	locale: "zh" | "en",
) {
	if (locale === "zh") {
		return item.summary;
	}
	if (item.source_id === "github-daily" || item.source_id === "github-weekly") {
		const [description] = item.summary.split(" | ");
		const parts = [description];
		if (item.meta.language) {
			parts.push(`Language: ${item.meta.language}`);
		}
		if (typeof item.meta.stars === "number") {
			parts.push(`Stars: ${item.meta.stars.toLocaleString()}`);
		}
		if (typeof item.meta.forks === "number") {
			parts.push(`Forks: ${item.meta.forks.toLocaleString()}`);
		}
		if (item.meta.stars_period) {
			parts.push(String(item.meta.stars_period));
		}
		return parts.join(" | ");
	}
	if (item.source_id === "v2ex") {
		return `Chinese developer community discussion from ${
			item.meta.node_title ?? "V2EX"
		}. Replies: ${item.meta.replies_count ?? 0}.`;
	}
	return item.summary;
}

function observationAction(item: AiObservationItem, locale: "zh" | "en") {
	if (locale === "en") {
		if (
			item.source_id === "github-daily" ||
			item.source_id === "github-weekly"
		) {
			return `Check maintenance activity, license, integration cost, and whether ${item.title} solves a problem already visible in your engineering backlog.`;
		}
		if (item.source_id === "hacker-news") {
			return "Use the comment thread to extract objections, edge cases, and operational concerns before turning the topic into an internal proposal.";
		}
		if (item.source_id === "v2ex") {
			return "Treat this as field feedback from Chinese developers; capture the friction point, but verify it with product or engineering evidence before acting.";
		}
		if (item.source_id === "openai" || item.source_id === "anthropic") {
			return "Review capability boundaries, pricing or access changes, data implications, and rollout requirements before updating the internal AI roadmap.";
		}
		if (item.source_id === "infoq") {
			return "Convert the engineering lesson into a migration, validation, rollback, or evaluation checklist before adopting the pattern.";
		}
		return "Decide whether this changes model choice, tool budget, or product direction; only then follow the original source in detail.";
	}

	if (item.source_id === "github-daily" || item.source_id === "github-weekly") {
		return `先看 ${item.title} 的维护频率、许可证、接入成本，以及它是否能解决你当前技术雷达里已有的问题。`;
	}
	if (item.source_id === "hacker-news") {
		return "把评论区当作反方材料来读，提取边界条件、失败案例和上线风险，再决定是否展开成内部判断。";
	}
	if (item.source_id === "v2ex") {
		return "把它当作中文开发者现场反馈：先记录摩擦点，再用产品数据或工程证据验证是否值得行动。";
	}
	if (item.source_id === "openai" || item.source_id === "anthropic") {
		return "先核对能力边界、价格或权限变化、数据影响和上线要求，再决定是否进入内部 AI 路线图。";
	}
	if (item.source_id === "infoq") {
		return "把工程经验转成迁移、验证、回滚或评测清单，而不是只收藏文章。";
	}
	return "判断它是否改变模型选型、工具预算或产品路线；值得时再追原文和补充来源。";
}
