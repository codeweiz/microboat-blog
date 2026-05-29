import type { MetadataRoute } from "next";
import { appConfig } from "@/config";
import { getBaseUrl } from "@/lib/urls";
import { blogs as allBlogs } from "@/source";

const locales = Object.keys(appConfig.i18n.locales) as string[];
const blogs = Array.from(allBlogs);

const staticRoutes = ["/", "/blog"];

function withLocalePrefix(route: string, locale: string) {
	const prefix = locale === appConfig.i18n.defaultLocale ? "" : `/${locale}`;
	// Keep the localized root free of a trailing slash (e.g. "/zh", not "/zh/").
	if (route === "/") {
		return prefix || "/";
	}
	return `${prefix}${route}`;
}

// Stable per-build timestamp derived from content, so static routes don't emit a
// fresh `lastmod` on every request (which makes crawlers distrust the signal).
const lastContentUpdate = blogs.reduce<Date>((latest, blog: any) => {
	const updated = new Date(blog.updatedAt || blog.createdAt);
	return updated > latest ? updated : latest;
}, new Date(0));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = getBaseUrl();
	const sitemapList: MetadataRoute.Sitemap = [];

	for (const route of staticRoutes) {
		if (appConfig.i18n.enabled) {
			for (const locale of locales) {
				sitemapList.push({
					url: `${baseUrl}${withLocalePrefix(route, locale)}`,
					lastModified: lastContentUpdate,
					priority: route === "/" ? 1.0 : 0.8,
					changeFrequency: "weekly",
				});
			}
		} else {
			sitemapList.push({
				url: `${baseUrl}${route}`,
				lastModified: lastContentUpdate,
				priority: route === "/" ? 1.0 : 0.8,
				changeFrequency: "weekly",
			});
		}
	}

	for (const blog of blogs) {
		const path = withLocalePrefix(`/blog/${blog.slug}`, blog.locale);
		sitemapList.push({
			url: `${baseUrl}${path}`,
			lastModified: new Date(blog.updatedAt || blog.createdAt),
			priority: 0.7,
			changeFrequency: "weekly",
		});
	}

	const seen = new Set<string>();
	return sitemapList.filter((item) => {
		if (!item.url || seen.has(item.url)) {
			return false;
		}
		seen.add(item.url);
		return true;
	});
}
