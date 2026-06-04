import assert from "node:assert/strict";
import test from "node:test";

import {
	getAiDigestByLocale,
	getAiDigestRefresh,
	getAiDigestSources,
	getAiObservationItems,
	getAiObservationSources,
	getAiObservationTimeline,
	getTodayAiDigestItems,
} from "../src/lib/ai-digest.ts";

test("loads localized AI digest items newest first", () => {
	const items = getAiDigestByLocale("zh");

	assert.ok(items.length >= 8);
	assert.equal(items[0].locale, "zh");
	assert.equal(items[0].source, "TLDR AI");
	assert.equal(
		items[0].title,
		"微软发布七个 MAI 模型，开始把业务调优变成产品能力",
	);
	assert.ok(items[0].chinese_summary.includes("Frontier Tuning"));
	assert.ok(items[0].backend_focus.includes("评测集"));
	assert.ok(items[0].background.includes("Build 2026"));
	assert.ok(items[0].process.includes("Azure Foundry"));
	assert.ok(items[0].why_it_matters.includes("企业 AI"));
	assert.ok(items[0].url.startsWith("https://"));
});

test("keeps separate Chinese and English digest copy", () => {
	const zhItems = getAiDigestByLocale("zh");
	const enItems = getAiDigestByLocale("en");

	assert.equal(zhItems.length, 10);
	assert.equal(enItems.length, 10);
	assert.notEqual(zhItems[0].title, enItems[0].title);
	assert.equal(
		enItems[0].title,
		"Microsoft ships seven MAI models and turns workflow tuning into a product surface",
	);
	assert.ok(enItems[0].backend_focus.includes("evaluation sets"));
	assert.ok(!/[\u4e00-\u9fff]/.test(enItems[0].backend_focus));
	assert.ok(
		new Set(zhItems.map((item) => item.why_it_matters)).size >= 9,
		"digest impact copy should be edited per item",
	);
	assert.ok(
		new Set(zhItems.map((item) => item.backend_focus)).size >= 9,
		"digest action copy should be edited per item",
	);
});

test("returns a compact today slice for the homepage", () => {
	const items = getTodayAiDigestItems("zh", 10);

	assert.equal(items.length, 10);
	assert.deepEqual(
		items.slice(0, 3).map((item) => item.source),
		["TLDR AI", "TLDR AI", "TLDR AI"],
	);

	const observationIds = new Set(
		getAiObservationItems("zh").map((item) => item.id),
	);
	for (const item of items) {
		assert.ok(observationIds.has(item.id.replace(/-(zh|en)$/, "")));
		assert.notEqual(item.published_at, "2026-05-27");
	}
	assert.equal(
		items.find((item) => item.id.startsWith("anthropic-6-"))?.published_at,
		"2026-06-02",
	);
});

test("exposes digest refresh mode honestly", () => {
	const refresh = getAiDigestRefresh();

	assert.equal(refresh.mode, "static-snapshot");
	assert.ok(refresh.description.includes("随博客发布"));
	assert.ok(refresh.description.includes("AI 观察"));
	assert.ok(refresh.next_step.includes("同一份快照"));
});

test("builds stable source summaries with counts", () => {
	const sources = getAiDigestSources("zh");

	assert.deepEqual(
		sources.map((source) => [source.id, source.count]),
		[
			["openai", 5],
			["anthropic", 1],
			["tldr-ai", 3],
			["infoq", 1],
		],
	);
});

test("builds ten-item observation sources", () => {
	const sources = getAiObservationSources("zh");

	assert.equal(sources.length, 8);
	assert.deepEqual(
		sources.map((source) => [source.id, source.count]),
		[
			["github-daily", 10],
			["github-weekly", 10],
			["hacker-news", 10],
			["v2ex", 10],
			["openai", 10],
			["anthropic", 10],
			["infoq", 10],
			["tldr-ai", 10],
		],
	);
});

test("localizes observation items and exposes dated snapshots", () => {
	const timeline = getAiObservationTimeline();
	const zhItems = getAiObservationItems("zh");
	const enItems = getAiObservationItems("en");

	assert.deepEqual(timeline, [
		{
			date: "2026-06-04",
			generatedAt: "2026-06-04T08:07:16.567357",
			itemCount: 80,
			digestCount: 10,
			sourceCount: 8,
		},
	]);
	assert.equal(
		zhItems.find(
			(item) =>
				item.id ===
				"tldr-ai-2-building-a-hill-climbing-machine-launching-seven",
		)?.title,
		"微软发布七个 MAI 模型，开始把业务调优变成产品能力",
	);
	assert.equal(
		enItems.find(
			(item) =>
				item.id ===
				"tldr-ai-2-building-a-hill-climbing-machine-launching-seven",
		)?.title,
		"Microsoft ships seven MAI models and turns workflow tuning into a product surface",
	);
	assert.ok(
		enItems
			.find((item) => item.source_id === "github-daily")
			?.backend_focus?.includes("maintenance activity"),
	);
});
