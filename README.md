# Microboat Blog

[![Deploy](https://github.com/codeweiz/microboat-blog/actions/workflows/deploy.yml/badge.svg)](https://github.com/codeweiz/microboat-blog/actions/workflows/deploy.yml)

Personal blog on Next.js 16 + Cloudflare Workers. Forked & stripped from [nextdevkit-cloudflare-template](https://github.com/codeweiz/nextdevkit-cloudflare-template).

🌐 Live: **https://blog.micro-boat.com**

Every push to `main` ships to Cloudflare Workers via GitHub Actions. Day-to-day, you write a post, commit, push — that's it.

## Stack

- **Next.js 16** App Router + Turbopack
- **MDX** content via `fumadocs-mdx` (frontmatter-driven posts in `src/content/blog/`)
- **Tailwind v4** + shadcn/ui + `next-themes` (light/dark)
- **next-intl** for English / 简体中文
- **Giscus** comments backed by GitHub Discussions
- **RSS** feed at `/rss.xml`
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

## Publish a post

```bash
# write
vim src/content/blog/my-new-post.mdx

# ship
git add . && git commit -m "blog: my new post"
git push
```

GitHub Actions runs `install → lint → opennext build → wrangler deploy`. Live in ~1–2 min. Watch progress at https://github.com/codeweiz/microboat-blog/actions.

## Deploy pipeline

Already configured on this repo:

- **Workflow:** [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) — runs on push to `main` and on manual dispatch
- **Secrets** (set on the repo): `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- **Worker name:** `microboat-blog` (in `wrangler.jsonc`)

### If you fork this repo

1. **Create a Cloudflare API token** — https://dash.cloudflare.com/profile/api-tokens → "Edit Cloudflare Workers" template
2. **Find your Account ID** — right sidebar of any Worker page in the Cloudflare dashboard
3. **Add Actions secrets** — `Settings → Secrets and variables → Actions`:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
4. **Update `wrangler.jsonc`** — change `name` to your own Worker name
5. Push to `main` — CI takes it from there

### Deploy from your laptop

```bash
pnpm wrangler login            # one-time browser auth
pnpm preview                   # preview the prod worker bundle locally
pnpm deploy                    # build + deploy bypassing CI
```

## Configuration

- Site identity: `src/config/index.ts` (`metadata.name`, `title`, `description`, …)
- Production URL: `.env.production` (`NEXT_PUBLIC_APP_URL`)
- Worker name / bindings: `wrangler.jsonc`
- Locales: `src/config/index.ts` → `i18n.locales`, plus `messages/{en,zh}.json`
- Comments: `src/components/blog/giscus.tsx` (repo, repoId, category, categoryId)

## Comments (Giscus)

Comments use [Giscus](https://giscus.app) on top of GitHub Discussions.

If you fork this repo:

1. **Enable Discussions** — `gh api -X PATCH repos/OWNER/REPO -f has_discussions=true`
2. **Install the Giscus app** — https://github.com/apps/giscus (grant access to your repo)
3. **Get IDs** for your repo + category:
   ```bash
   gh api repos/OWNER/REPO --jq .node_id
   gh api graphql -f query='{ repository(owner:"OWNER", name:"REPO"){ discussionCategories(first:20){ nodes { id name } } } }'
   ```
4. **Update** `src/components/blog/giscus.tsx` with your `repo`, `repoId`, `category`, `categoryId`
