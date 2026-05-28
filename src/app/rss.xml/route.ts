import { appConfig } from "@/config";
import { getBaseUrl } from "@/lib/urls";
import { blogs as allBlogs } from "@/source";

export const dynamic = "force-static";

function xmlEscape(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

export async function GET() {
	const baseUrl = getBaseUrl();
	const defaultLocale = appConfig.i18n.defaultLocale;

	const posts = Array.from(allBlogs)
		.filter((post: any) => post.locale === defaultLocale)
		.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());

	const items = posts
		.map((post: any) => {
			const url = `${baseUrl}/blog/${post.slug}`;
			return `    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${xmlEscape(post.description ?? "")}</description>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <author>${xmlEscape(post.author ?? "Microboat")}</author>
    </item>`;
		})
		.join("\n");

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(appConfig.metadata.title)}</title>
    <link>${baseUrl}</link>
    <description>${xmlEscape(appConfig.metadata.description)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

	return new Response(xml, {
		headers: {
			"Content-Type": "application/rss+xml; charset=utf-8",
			"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
		},
	});
}
