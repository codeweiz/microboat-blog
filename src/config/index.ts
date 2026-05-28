import type { AppConfig } from "@/config/types";

export const appConfig = {
	metadata: {
		name: "Microboat Blog",
		title: "Microboat — Personal Blog",
		description: "Notes on engineering, tools, and the work I'm shipping.",
		images: {
			logoLight: "/logo-light.svg",
			logoDark: "/logo-dark.svg",
			ogImage: "/og-image.png",
		},
		keywords: ["blog", "engineering", "next.js", "cloudflare"],
	},
	ui: {
		theme: {
			enabled: true,
			defaultMode: "system",
		},
	},
	blog: {
		pagination: 6,
		placeholderImage: "/images/blog/blog-test.jpg",
	},
	i18n: {
		enabled: true,
		defaultLocale: "en",
		locales: {
			en: { name: "English" },
			zh: { name: "简体中文" },
		},
		localeCookieName: "NEXT_LOCALE",
	},
} as const satisfies AppConfig;

export type { AppConfig };
