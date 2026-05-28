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

Frontmatter schema lives in `source.config.ts`. Then commit & push — GitHub Actions deploys automatically.

## Deploy

### One-time setup

1. **Create a Cloudflare API token** at https://dash.cloudflare.com/profile/api-tokens
   - Use the **"Edit Cloudflare Workers"** template
2. **Find your Account ID** in the Cloudflare dashboard (right sidebar of any Worker page)
3. **Add two GitHub Actions secrets** at https://github.com/codeweiz/microboat-blog/settings/secrets/actions
   - `CLOUDFLARE_API_TOKEN` — the token from step 1
   - `CLOUDFLARE_ACCOUNT_ID` — the ID from step 2
4. **First deploy** (creates the Worker on Cloudflare):
   ```bash
   pnpm wrangler login         # one-time browser auth
   pnpm deploy                 # builds + deploys
   ```
   Or just push to `main` and let CI do it.

### Day-to-day

```bash
# write a post
vim src/content/blog/my-new-post.mdx

# ship it
git add . && git commit -m "blog: my new post"
git push                       # → GitHub Actions → live in ~1–2 min
```

### Local commands

```bash
pnpm preview                   # preview the production worker bundle locally
pnpm deploy                    # build + deploy from your laptop
```

## Configuration

- Site identity: `src/config/index.ts` (`metadata.name`, `title`, `description`, …)
- Worker name / bindings: `wrangler.jsonc`
- Locales: `src/config/index.ts` → `i18n.locales`, plus `messages/{en,zh}.json`
