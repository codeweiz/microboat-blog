import type { MetadataRoute } from "next";
import { appConfig } from "@/config";
import { getBaseUrl } from "@/lib/urls";
import { blogs as allBlogs } from "@/source";

const locales = Object.keys(appConfig.i18n.locales) as string[];
const blogs = Array.from(allBlogs);

const staticRoutes = ["/", "/blog"];

function withLocalePrefix(route: string, locale: string) {
	if (locale === appConfig.i18n.defaultLocale) return route;
	return `/${locale}${route}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = getBaseUrl();
	const sitemapList: MetadataRoute.Sitemap = [];

	for (const route of staticRoutes) {
		if (appConfig.i18n.enabled) {
			for (const locale of locales) {
				sitemapList.push({
					url: `${baseUrl}${withLocalePrefix(route, locale)}`,
					lastModified: new Date(),
					priority: route === "/" ? 1.0 : 0.8,
					changeFrequency: "weekly",
				});
			}
		} else {
			sitemapList.push({
				url: `${baseUrl}${route}`,
				lastModified: new Date(),
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
		if (!item.url || seen.has(item.url)) return false;
		seen.add(item.url);
		return true;
	});
}
