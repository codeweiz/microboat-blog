import assert from "node:assert/strict";
import test from "node:test";

import {
	buildContentGraph,
	getBacklinks,
	getGraphForPost,
	getPostConcepts,
	getPostStage,
	getPostType,
} from "../src/lib/content-graph.ts";
import { getNextReads } from "../src/lib/recommendations.ts";

const posts = [
	{
		slug: "agent-toolchain-security",
		title: "Agent Toolchain Security",
		description: "Control planes for agent execution.",
		type: "essay",
		stage: "evergreen",
		series: "agent-control-plane",
		seriesOrder: 2,
		concepts: ["control-plane", "agent-safety", "execution"],
		links: ["terminal-agent-interface", "durable-execution-postgres"],
		tags: ["AI", "Security"],
		createdAt: new Date("2026-05-20"),
		updatedAt: new Date("2026-05-22"),
	},
	{
		slug: "terminal-agent-interface",
		title: "Terminal Agent Interface",
		description: "Interfaces for agent collaboration.",
		type: "pattern",
		stage: "budding",
		series: "agent-control-plane",
		seriesOrder: 1,
		concepts: ["agent-safety", "developer-experience"],
		links: ["agent-toolchain-security"],
		tags: ["AI"],
		createdAt: new Date("2026-05-12"),
		updatedAt: new Date("2026-05-12"),
	},
	{
		slug: "durable-execution-postgres",
		title: "Durable Execution with Postgres",
		description: "Recovery semantics and durable workflows.",
		type: "essay",
		stage: "reference",
		concepts: ["durable-execution", "execution", "postgres"],
		links: [],
		tags: ["Infrastructure"],
		createdAt: new Date("2026-04-10"),
		updatedAt: new Date("2026-04-18"),
	},
	{
		slug: "ai-assisted-qa-testing",
		title: "AI-assisted QA Testing",
		description: "Failure triage and testing loops.",
		type: "playbook",
		stage: "evergreen",
		concepts: ["agent-safety", "quality"],
		links: ["agent-toolchain-security"],
		tags: ["AI", "Testing"],
		createdAt: new Date("2026-03-01"),
		updatedAt: new Date("2026-03-08"),
	},
];

test("normalizes optional post metadata with useful defaults", () => {
	assert.equal(getPostType({}), "essay");
	assert.equal(getPostStage({}), "budding");
	assert.deepEqual(getPostConcepts({ concepts: ["AI Tools", "ai-tools", ""] }), [
		"ai-tools",
	]);
});

test("builds explicit graph edges with relation labels", () => {
	const graph = buildContentGraph(posts);
	const edge = graph.edges.find(
		(item) =>
			item.from === "agent-toolchain-security" &&
			item.to === "terminal-agent-interface",
	);

	assert.ok(edge);
	assert.equal(edge.relation, "outgoing");
	assert.equal(edge.reason, "links to this post");
});

test("finds backlinks to a post", () => {
	const backlinks = getBacklinks(posts[0], posts).map((post) => post.slug);

	assert.deepEqual(backlinks.sort(), [
		"ai-assisted-qa-testing",
		"terminal-agent-interface",
	]);
});

test("local graph includes explicit, backlink, series, and shared concept relations", () => {
	const graph = getGraphForPost(posts[0], posts);
	const relations = graph.edges.map((edge) => edge.relation);

	assert.ok(relations.includes("outgoing"));
	assert.ok(relations.includes("backlink"));
	assert.ok(relations.includes("series"));
	assert.ok(relations.includes("concept"));
	assert.ok(graph.nodes.some((node) => node.slug === "agent-toolchain-security"));
});

test("next reads rank explainable explicit and backlink relations first", () => {
	const reads = getNextReads(posts[0], posts, 3);

	assert.equal(reads[0].post.slug, "terminal-agent-interface");
	assert.ok(reads[0].reasons.includes("same series"));
	assert.ok(reads[0].reasons.includes("links to this post"));
	assert.ok(reads[1].reasons.length > 0);
});
