# Microboat Blog UI/UX Redesign Design

Date: 2026-06-03
Status: Approved direction, ready for implementation planning

## Purpose

Redesign the blog from a simple chronological personal blog into a public knowledge system for technical thinking.

The site should help readers understand:

- who the author is without awkward self-promotion
- what long-running questions the blog investigates
- where to start reading
- how posts relate to each other
- which posts are mature references and which are still growing
- what to read next after finishing an article

The design principle is content first. Visual design, typography, graph views, metadata, and recommendation logic exist to serve reading and rediscovery.

## Current State

The project is a Next.js/Fumadocs MDX blog with bilingual posts under `src/content/blog/*.mdx`. The current content schema supports title, description, keywords, dates, tags, author, image, slug, and locale.

Current strengths:

- clean MDX publishing path
- bilingual content
- tags, search, RSS, related posts, previous/next links
- article table of contents
- good foundation for static metadata-driven navigation

Current weaknesses:

- homepage reads like a generic personal developer blog
- about page is polite but flat
- archive is mostly chronological
- tags are too weak to express knowledge structure
- related posts are based mainly on shared tags
- articles do not show maturity, revision history, backlinks, or concept relationships

## External References

The redesign borrows patterns from:

- Maggie Appleton: content types, topics, growth stages, and a garden-like archive
- Julia Evans: plain-spoken author positioning and category-based discovery
- Simon Willison: long-running technical archive, series, tags, and dense useful indexes
- Gwern.net: backlinks, similar links, annotated bibliographies, and semantic navigation
- Andy Matuschak: public working notes and evergreen note ideas
- Obsidian: local graph, backlinks, outgoing links, properties, aliases, and graph depth

These are references for interaction and information structure, not visual skins to copy.

## Design Direction

The final site combines four prototype directions:

- A: Knowledge Atlas for homepage positioning and topic map
- B: Editorial Reader for long-form article reading
- C: Research Archive for content discovery and filtering
- D: Connected Reading for local graph, backlinks, and relationship-aware next reads

Prototype artifacts:

- `docs/prototypes/blog-ui-ux-redesign/index.html`
- `docs/prototypes/blog-ui-ux-redesign/atlas.png`
- `docs/prototypes/blog-ui-ux-redesign/reader.png`
- `docs/prototypes/blog-ui-ux-redesign/archive.png`
- `docs/prototypes/blog-ui-ux-redesign/graph.png`

## Homepage

The homepage should stop introducing the author as "full-stack engineer writing notes." That phrase is true but not useful enough.

Recommended positioning:

> A public notebook for engineering judgment: AI toolchains, infrastructure, developer experience, and long-lived systems.

Homepage structure:

1. **Positioning hero**
   - Clear statement of the site's purpose
   - No exaggerated claims
   - No generic "passionate developer" language
   - One primary action: start reading
   - One secondary action: explore the knowledge map

2. **Start Here**
   - 3 to 5 entry posts selected manually
   - These are not necessarily latest posts
   - Each entry explains why it is a good starting point

3. **Knowledge Map**
   - Topic clusters such as AI Toolchains, Durable Systems, Developer Experience, Product Engineering, Infrastructure
   - Each cluster shows a short description, post count, and best entry article

4. **Living Notes**
   - Recently updated posts
   - Posts in progress
   - Evergreen references worth revisiting

5. **Now / About Strip**
   - Short, current, human note about what the author is thinking about
   - Links to About, RSS, GitHub, and selected social links

## About Page

The about page should explain the site before explaining the person.

Structure:

1. **About this site**
   - What questions the blog explores
   - What kind of reader will benefit
   - How posts are written and updated

2. **About the author**
   - One grounded paragraph
   - Focus on practice and curiosity, not credentials
   - Avoid "I love technology" and "passionate about open source" boilerplate

3. **How to read this site**
   - Start Here for new readers
   - Topics for focused research
   - Graph/backlinks for following ideas
   - Now for current focus

4. **Elsewhere**
   - GitHub, RSS, and optional profiles

Tone example:

> I write here to make engineering judgment visible: the tradeoffs behind tools, the failure modes behind systems, and the small design choices that compound over time.

## Content Model

Extend frontmatter so posts can participate in a knowledge system instead of only a chronological archive.

Proposed fields:

```yaml
type: essay | note | pattern | playbook | case-study
stage: seedling | budding | evergreen | reference
series: agent-toolchain-control-plane
seriesOrder: 2
featured: true
startHere: true
concepts:
  - control-plane
  - durable-execution
  - agent-safety
links:
  - terminal-agent-interface
  - durable-execution-postgres
aliases:
  - agent control plane
  - toolchain safety
updatedReason: "Added control-plane framing and linked related execution posts."
```

Field roles:

- `type` explains the shape of the post
- `stage` explains maturity
- `series` and `seriesOrder` create explicit reading paths
- `featured` supports homepage/editorial curation
- `startHere` supports onboarding
- `concepts` power graph clusters and deterministic recommendations
- `links` create explicit outgoing edges
- `aliases` improve search and future unlinked mention detection
- `updatedReason` gives updates meaning beyond dates

## Clustering

The blog should support several ways to group content:

- by topic cluster
- by content type
- by maturity stage
- by series
- by concept
- by recent update
- by explicit links and backlinks

Tags can remain, but tags should not carry the full knowledge architecture. Tags are broad filters; concepts and links are stronger semantic edges.

## Article Lifecycle

Articles should feel alive after publication.

Each article can show:

- first published date
- last updated date
- update reason
- maturity stage
- type
- series position
- key concepts
- backlinks
- outgoing links
- next best reads

Optional later enhancement:

- short changelog per post
- "reviewed on" date for reference posts
- "needs update" marker for posts that depend on fast-moving tools

## Connected Reading

The article page should include a local graph inspired by Obsidian, but optimized for readers rather than note-taking.

Graph scope:

- current post
- explicit outgoing links
- backlinks from other posts
- same-series neighbors
- shared concepts
- high-confidence semantic matches

Default graph should be local, not global. A full-site graph can exist later, but the local graph is more useful for reading.

Graph interactions:

- click a node to preview title, description, type, stage, and relationship reason
- filter by relation type: backlinks, outgoing, same series, shared concepts, similar
- depth control, initially depth 1 or 2
- hide weak/low-confidence edges by default

Relationship labels should explain why a post appears:

- "same series"
- "links to this post"
- "shares concept: control-plane"
- "semantic match: execution safety"
- "previous in series"

## Smart Associations

Use a two-layer recommendation model.

Layer 1: deterministic and explainable.

Priority:

1. explicit `links`
2. backlinks
3. same `series`
4. shared `concepts`
5. shared `type` or `stage`
6. recent updates in the same topic

Layer 2: semantic similarity.

Use embeddings later to compare title, description, headings, summary, and concepts. Semantic matches must be displayed with a reason and confidence threshold. Do not show black-box "you may also like" recommendations.

The recommendation UI should say "Read next because..." rather than "Related posts."

## Search

Search should expand beyond title and description.

Indexed fields:

- title
- description
- headings
- tags
- concepts
- aliases
- type
- stage
- series

Future search enhancement:

- support `type:playbook`
- support `stage:evergreen`
- support `concept:control-plane`
- support fuzzy alias matching

## Typography

Typography should prioritize long-form reading comfort. Avoid forcing a generic "technology" feeling.

Recommended typography system:

- Chinese body: Source Han Serif SC or Noto Serif SC
- Chinese UI: Noto Sans SC or PingFang SC
- English display accent: optional Fraunces or a restrained serif
- Code: a legible mono with good punctuation and CJK fallback

Implementation preference:

- self-host essential fonts
- use font subsets where possible
- keep font loading predictable
- avoid layout shifts

Reading defaults:

- article width around 66 to 72 characters for Latin text, visually tuned for Chinese
- generous line-height for long Chinese paragraphs
- no negative letter spacing
- no tiny metadata that forces squinting

## Visual System

Tone:

- editorial
- quiet
- warm but not beige-heavy
- content-forward
- serious without pretending to be enterprise software

Avoid:

- purple-blue gradients
- decorative orbs
- sci-fi dashboards
- generic SaaS cards everywhere
- oversized self-promotional hero copy

Use:

- restrained paper/mineral background
- clear text hierarchy
- purposeful accent colors
- graph and metadata only where they improve navigation
- illustrations only when they explain an idea

## Implementation Architecture

Recommended modules:

- `src/lib/posts.ts`: post parsing, sorting, grouping
- `src/lib/content-graph.ts`: nodes, edges, backlinks, concepts, relation reasons
- `src/lib/recommendations.ts`: deterministic next-read scoring
- `src/components/blog/content-graph.tsx`: local graph UI
- `src/components/blog/next-reads.tsx`: relationship-aware reading suggestions
- `src/components/blog/post-lifecycle.tsx`: dates, stage, type, update reason
- `src/components/home/*`: homepage sections

Keep graph data static at build time for the first implementation. Avoid adding a database or runtime service for this redesign.

## Non-Goals For The First Implementation

- Do not build a separate content studio in this redesign.
- Do not add a database or runtime recommendation service.
- Do not ship black-box AI recommendations without visible reasons.
- Do not make the global graph the primary navigation surface.
- Do not redesign article content itself beyond metadata needed for clustering.
- Do not make the homepage a portfolio or resume page.

## Phasing

Phase 1: Foundation

- Extend content schema
- Backfill existing posts with type, stage, concepts, series, aliases, and links
- Add grouping helpers and deterministic relation model

Phase 2: Homepage and About

- Rewrite homepage information architecture
- Add Start Here, Knowledge Map, Living Notes, and Now/About strip
- Rewrite About page around site purpose and reading paths

Phase 3: Archive and Discovery

- Upgrade blog listing to support topic/type/stage/series discovery
- Keep chronological archive as a secondary mode
- Improve tags page or replace it with Topics/Concepts

Phase 4: Article Reader

- Add lifecycle metadata
- Add better next reads
- Add local graph and backlinks
- Improve typography and reading layout

Phase 5: Smart Associations

- Add optional embedding pipeline
- Generate semantic relation data at build time
- Show only explainable, high-confidence semantic matches

## Acceptance Criteria

- A first-time reader can understand the site purpose within 10 seconds.
- The homepage offers at least three non-chronological reading paths.
- About page sounds specific to the author and site, not a generic developer bio.
- Existing posts can be browsed by type, stage, topic/concept, and series.
- Article pages show why related posts are related.
- Local graph is useful without becoming visual noise.
- Typography improves long-form reading comfort in Chinese and English.
- The implementation remains static-build friendly and compatible with Cloudflare Workers deployment.

## Open Decisions

- Exact topic taxonomy names
- Final font licensing and self-hosting choices
- Whether to add a `/now` page or keep the Now strip on homepage only
- Whether semantic similarity ships in the first implementation or later
- Whether concepts get their own public pages in Phase 1 or Phase 3
