"use client";

import { Languages } from "lucide-react";
import { type Locale, useLocale } from "next-intl";
import { useTransition } from "react";
import { appConfig } from "@/config";
import { switchLocale } from "@/i18n/lib/update-locale";
import { usePathname } from "@/i18n/navigation";

/** Cycles to the next locale (a two-language toggle today). */
export function LocaleToggle() {
	const locale = useLocale();
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();

	const locales = Object.keys(appConfig.i18n.locales);
	const nextLocale = (locales.find((l) => l !== locale) ?? locale) as Locale;

	return (
		<button
			type="button"
			disabled={isPending}
			aria-label={`Switch to ${appConfig.i18n.locales[nextLocale]?.name}`}
			onClick={() =>
				startTransition(() => {
					switchLocale(nextLocale, pathname);
				})
			}
			className="flex h-9 items-center gap-1.5 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
		>
			<Languages className="h-4 w-4" />
			<span className="uppercase">{nextLocale}</span>
		</button>
	);
}
