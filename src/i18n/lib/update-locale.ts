"use server";

import { revalidatePath } from "next/cache";
import type { Locale } from "next-intl";
import { setLocaleCookie } from "@/i18n/lib/locale-cookie";
import { redirect } from "@/i18n/navigation";

export async function updateLocale(locale: Locale, currentPath?: string) {
	await setLocaleCookie(locale);

	// Revalidate the current path if provided
	if (currentPath) {
		revalidatePath(currentPath);
	}

	// Also revalidate the root path to ensure layout updates
	revalidatePath("/");
}

export async function switchLocale(locale: Locale, currentPath: string) {
	await setLocaleCookie(locale);

	// Revalidate paths
	revalidatePath(currentPath);
	revalidatePath("/");

	// Redirect to the same path with new locale
	redirect({ href: currentPath, locale });
}
