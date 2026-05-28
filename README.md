# Microboat Blog

Personal blog on Next.js 16 + Cloudflare Workers. Forked & stripped from [nextdevkit-cloudflare-template](https://github.com/codeweiz/nextdevkit-cloudflare-template).

## Stack

- **Next.js 16** App Router + Turbopack
- **MDX** content via `fumadocs-mdx` (frontmatter-driven posts in `src/content/blog/`)
- **Tailwind v4** + shadcn/ui + `next-themes` (light/dark)
- **next-intl** for English / 简体中文
- **OpenNext** deploying to Cloudflare Workers

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Add a post

Drop a Markdown file in `src/content/blog/`:

- `my-post.mdx` — English
- `my-post.zh.mdx` — Chinese (optional)

Frontmatter schema lives in `source.config.ts`.

## Deploy to Cloudflare

```bash
pnpm preview       # local preview against the Worker bundle
pnpm deploy        # deploy via wrangler
```

Edit `wrangler.jsonc` to set your `name` and (if needed) bindings.
