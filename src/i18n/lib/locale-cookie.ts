import "server-only";

import { cookies } from "next/headers";
import type { Locale } from "next-intl";
import { appConfig } from "@/config";

export async function getUserLocale() {
	const cookie = (await cookies()).get(appConfig.i18n.localeCookieName);
	return cookie?.value ?? appConfig.i18n.defaultLocale;
}

export async function setLocaleCookie(locale: Locale) {
	(await cookies()).set(appConfig.i18n.localeCookieName, locale);
}
