import type { Metadata } from "next";
import { appConfig } from "@/config";
import { getBaseUrl } from "@/lib/urls";

export function metadata({
	title,
	description,
	image,
	canonicalUrl,
	keywords,
}: {
	title?: string | { template: string; default: string };
	description?: string;
	image?: string;
	canonicalUrl?: string;
	keywords?: string[];
} = {}): Metadata {
	title = title || appConfig.metadata.title;
	description = description || appConfig.metadata.description;
	image = image || appConfig.metadata.images?.ogImage;
	keywords = keywords || appConfig.metadata.keywords;
	const ogImageUrl = image.startsWith("/")
		? new URL(`${getBaseUrl()}${image}`)
		: new URL(image);
	return {
		title,
		description,
		alternates: {
			canonical: canonicalUrl || "./",
		},
		keywords,
		openGraph: {
			type: "website",
			locale: "en_US",
			url: canonicalUrl || getBaseUrl(),
			title,
			description,
			siteName: appConfig.metadata.title,
			images: [ogImageUrl.toString()],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [ogImageUrl.toString()],
			site: getBaseUrl(),
		},
		icons: [
			{
				rel: "icon",
				url: "/favicon-96x96.png",
				sizes: "96x96",
				type: "image/png",
			},
			{ rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
			{ rel: "shortcut icon", url: "/favicon.ico" },
			{
				rel: "apple-touch-icon",
				url: "/apple-touch-icon.png",
				sizes: "180x180",
			},
		],
		metadataBase: new URL(getBaseUrl()),
	};
}
