import deepmerge from "deepmerge";
import type { Locale, Messages } from "next-intl";
import { appConfig } from "@/config";
import { routing } from "@/i18n/routing";

const importLocale = async (locale: Locale): Promise<Messages> => {
	return (await import(`../../messages/${locale}.json`)).default as Messages;
};

export const getMessagesForLocale = async (
	locale: Locale,
): Promise<Messages> => {
	const localeMessages = await importLocale(locale);
	if (locale === routing.defaultLocale) {
		return localeMessages;
	}
	const defaultLocaleMessages = await importLocale(
		appConfig.i18n.defaultLocale,
	);
	return deepmerge(defaultLocaleMessages, localeMessages);
};

export const getDefaultMessages = async (): Promise<Messages> => {
	return await getMessagesForLocale(appConfig.i18n.defaultLocale);
};
