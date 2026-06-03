# Blog Knowledge System Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved blog UI/UX redesign as a static knowledge system with richer post metadata, homepage paths, discovery pages, article lifecycle metadata, local graph, and explainable next reads.

**Architecture:** Keep the site static-build friendly. Extend MDX frontmatter, add pure helper modules for graph/recommendation/discovery, then redesign existing Next.js pages around those helpers. Avoid runtime databases and black-box recommendations.

**Tech Stack:** Next.js 16, React 19, Fumadocs MDX, next-intl, Tailwind CSS v4, TypeScript, Node built-in tests for pure helper logic, `pnpm run build` for full verification.

---

### Task 1: Content Graph Foundation

**Files:**
- Create: `test/content-graph.test.mjs`
- Create: `src/lib/content-graph.ts`
- Create: `src/lib/recommendations.ts`
- Modify: `source.config.ts`
- Modify: `src/lib/posts.ts`

- [ ] **Step 1: Write failing tests for graph and recommendation behavior**

Create `test/content-graph.test.mjs` with tests that import compiled helper behavior through plain JavaScript-compatible data shapes and assert backlinks, relation reasons, and deterministic ranking.

- [ ] **Step 2: Run tests and verify failure**

Run: `node --test test/content-graph.test.mjs`
Expected: failure because `src/lib/content-graph.ts` and `src/lib/recommendations.ts` do not exist yet.

- [ ] **Step 3: Implement helper modules**

Add pure functions for:

- `getPostType(post)`
- `getPostStage(post)`
- `getPostConcepts(post)`
- `buildContentGraph(posts)`
- `getBacklinks(post, posts)`
- `getGraphForPost(post, posts)`
- `getNextReads(post, posts, limit)`

- [ ] **Step 4: Extend schema and search index**

Add optional frontmatter fields: `type`, `stage`, `series`, `seriesOrder`, `featured`, `startHere`, `concepts`, `links`, `aliases`, `updatedReason`.

- [ ] **Step 5: Verify tests pass**

Run: `node --test test/content-graph.test.mjs`
Expected: pass.

### Task 2: Metadata Backfill

**Files:**
- Modify: every `src/content/blog/*.mdx`

- [ ] **Step 1: Backfill frontmatter**

Add conservative metadata to every existing post in both locales:

- `type`
- `stage`
- `concepts`
- `aliases`
- `links`
- `featured` or `startHere` for selected entry posts
- `updatedReason`

- [ ] **Step 2: Verify content compiles**

Run: `pnpm run build`
Expected: schema accepts all posts.

### Task 3: Homepage and About

**Files:**
- Create: `src/components/home/knowledge-map.tsx`
- Create: `src/components/home/start-here.tsx`
- Create: `src/components/home/living-notes.tsx`
- Modify: `src/app/[locale]/(marketing)/page.tsx`
- Modify: `src/app/[locale]/(marketing)/about/page.tsx`
- Modify: `messages/en.json`
- Modify: `messages/zh.json`

- [ ] **Step 1: Implement content-first homepage**

Replace the generic hero with positioning, Start Here, Knowledge Map, Living Notes, and a Now/About strip.

- [ ] **Step 2: Rewrite About**

Make the page explain the site purpose, author practice, and reading paths.

- [ ] **Step 3: Build**

Run: `pnpm run build`
Expected: homepage and about render for both locales.

### Task 4: Discovery Pages

**Files:**
- Modify: `src/app/[locale]/(marketing)/blog/page.tsx`
- Modify: `src/app/[locale]/(marketing)/tags/page.tsx`
- Modify: `src/app/[locale]/(marketing)/tags/[tag]/page.tsx`
- Modify: `src/components/blog/post-row.tsx`

- [ ] **Step 1: Redesign archive**

Add featured/start-here posts, type/stage/topic sections, and keep chronological archive as secondary.

- [ ] **Step 2: Upgrade tag/topic browsing**

Show tag counts with representative posts and richer post rows with type/stage/concepts.

- [ ] **Step 3: Build**

Run: `pnpm run build`
Expected: discovery pages render.

### Task 5: Article Reader and Connected Reading

**Files:**
- Create: `src/components/blog/post-lifecycle.tsx`
- Create: `src/components/blog/next-reads.tsx`
- Create: `src/components/blog/content-graph.tsx`
- Modify: `src/app/[locale]/(marketing)/blog/[...slug]/page.tsx`
- Modify: `src/components/blog/related-posts.tsx`
- Modify: `src/components/blog/mdx-components.tsx`

- [ ] **Step 1: Add lifecycle metadata**

Display type, stage, updated date, update reason, concepts, and series position.

- [ ] **Step 2: Add explainable next reads**

Replace plain related posts with reasoned next reads from deterministic relationships.

- [ ] **Step 3: Add local graph**

Render a static local graph using nodes and relation labels. Keep it useful and quiet.

- [ ] **Step 4: Build**

Run: `pnpm run build`
Expected: article pages render.

### Task 6: Final Verification

**Files:**
- Modify as needed for polish.

- [ ] **Step 1: Run full checks**

Run:

```bash
node --test test/content-graph.test.mjs
pnpm run build
```

- [ ] **Step 2: Browser verify**

Start local dev server and screenshot:

- homepage
- blog archive
- article page with graph
- about page

- [ ] **Step 3: Commit**

Stage intended files only and commit with:

```bash
git add source.config.ts src messages test docs/superpowers/plans/2026-06-03-blog-knowledge-system-redesign.md
git commit -m "feat: redesign blog as knowledge system"
```
