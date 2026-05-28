export interface AnalyticsProvider {
	enabled: boolean;
	label: string;
	config: Record<string, any>;
	onAccept?: () => void;
}

export interface AnalyticsConfig {
	google?: AnalyticsProvider;
	umami?: AnalyticsProvider;
	plausible?: AnalyticsProvider;
}

const analyticsConfig: AnalyticsConfig = {
	google: {
		enabled: !!process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
		label: "Google Analytics",
		config: {
			trackingId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
		},
		onAccept: () => {
			try {
				window.dataLayer = window.dataLayer || [];
				function gtag(..._args: unknown[]) {
					// biome-ignore lint/complexity/noArguments: need to use arguments for gtag
					(window.dataLayer as Array<any>).push(arguments);
				}
				gtag("js", new Date());
				gtag("config", analyticsConfig.google?.config.trackingId);

				const script = document.createElement("script");
				script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.google?.config.trackingId}`;
				script.async = true;
				document.body.appendChild(script);
			} catch (error) {
				console.error("Google Analytics initialization error:", error);
			}
		},
	},
	umami: {
		enabled: !!process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
		label: "Umami Analytics",
		config: {
			url: process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL,
			websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
		},
		onAccept: () => {
			try {
				const script = document.createElement("script");
				script.src = analyticsConfig.umami?.config.url || "";
				script.defer = true;
				script.setAttribute(
					"data-website-id",
					analyticsConfig.umami?.config.websiteId || "",
				);
				document.head.appendChild(script);
			} catch (error) {
				console.error("Umami Analytics initialization error:", error);
			}
		},
	},
	plausible: {
		enabled: !!process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
		label: "Plausible Analytics",
		config: {
			domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
			src: process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL,
		},
		onAccept: () => {
			try {
				const script = document.createElement("script");
				script.defer = true;
				script.setAttribute(
					"data-domain",
					analyticsConfig.plausible?.config.domain || "",
				);
				script.src = analyticsConfig.plausible?.config.src || "";
				document.head.appendChild(script);
			} catch (error) {
				console.error("Plausible Analytics initialization error:", error);
			}
		},
	},
};

export const getEnabledAnalytics = (): Record<string, AnalyticsProvider> => {
	const enabled: Record<string, AnalyticsProvider> = {};

	Object.entries(analyticsConfig).forEach(([key, provider]) => {
		if (provider?.enabled) {
			enabled[key] = provider;
		}
	});

	return enabled;
};

export const hasEnabledAnalytics = (): boolean => {
	return Object.values(analyticsConfig).some((provider) => provider?.enabled);
};

export const getAnalyticsProvider = (
	key: keyof AnalyticsConfig,
): AnalyticsProvider | undefined => {
	return analyticsConfig[key];
};

export default analyticsConfig;

declare global {
	interface Window {
		dataLayer: any[];
		gtag: (...args: any[]) => void;
		plausible?: (...args: any[]) => void;
	}
}
