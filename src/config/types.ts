export type AppConfig = {
	metadata: MetadataConfig;
	i18n: I18nConfig;
	ui: UiConfig;
	blog: BlogConfig;
};

export interface MetadataConfig {
	name: string;
	title: string;
	description: string;
	images: {
		logoLight: string;
		logoDark: string;
		ogImage: string;
	};
	keywords: string[];
}

export interface I18nConfig {
	enabled: boolean;
	defaultLocale: string;
	localeCookieName: string;
	locales: Record<string, { name: string }>;
}

export interface UiConfig {
	theme: {
		enabled: boolean;
		defaultMode: "system" | "light" | "dark";
	};
}

export interface BlogConfig {
	pagination: number;
	placeholderImage: string;
}
