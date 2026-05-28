import { getRequestConfig } from "next-intl/server";
import { appConfig } from "@/config";
import { getUserLocale } from "@/i18n/lib/locale-cookie";
import { getMessagesForLocale } from "@/i18n/messages";
import { routing } from "@/i18n/routing";

const locales = Object.keys(appConfig.i18n.locales) as string[];

export default getRequestConfig(async ({ requestLocale }) => {
	let requested = await requestLocale;
	if (!requested) {
		requested = await getUserLocale();
	}

	if (!(locales.includes(requested) && appConfig.i18n.enabled)) {
		requested = routing.defaultLocale;
	}

	return {
		locale: requested,
		messages: await getMessagesForLocale(requested),
	};
});
