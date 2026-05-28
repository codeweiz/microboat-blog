"use client";

import { Languages } from "lucide-react";
import { type Locale, useLocale } from "next-intl";
import { useId, useTransition } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { appConfig } from "@/config";
import { switchLocale } from "@/i18n/lib/update-locale";
import { usePathname } from "@/i18n/navigation";
import { useMounted } from "@/lib/hooks/use-mounted";

function LocaleSwitcher() {
	const id = useId();
	const mounted = useMounted();
	const pathname = usePathname();
	const locale = useLocale();
	const [isPending, startTransition] = useTransition();

	if (!appConfig.i18n.enabled) {
		return null;
	}

	const handleLocaleChange = (newLocale: Locale) => {
		if (newLocale === locale) {
			return;
		}
		startTransition(async () => {
			try {
				await switchLocale(newLocale, pathname);
			} catch (error) {
				console.error("Failed to update locale:", error);
			}
		});
	};

	if (!mounted) {
		return (
			<Select disabled>
				<SelectTrigger id={id} className="cursor-pointer">
					<SelectValue placeholder="Select language">
						<span className="flex items-center gap-2">
							<Languages className="h-4 w-4" />
							<span className="truncate">Loading...</span>
						</span>
					</SelectValue>
				</SelectTrigger>
			</Select>
		);
	}

	return (
		<Select
			value={locale}
			onValueChange={(v) => handleLocaleChange(v as Locale)}
			disabled={isPending}
		>
			<SelectTrigger id={id} className="cursor-pointer">
				<SelectValue aria-label="Select language">
					<span className="flex items-center gap-2">
						<Languages className="h-4 w-4" />
						<span className="truncate">
							{appConfig.i18n.locales[locale]?.name}
						</span>
					</span>
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{Object.entries(appConfig.i18n.locales).map(([key, { name }]) => (
					<SelectItem key={key} value={key}>
						{name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

export { LocaleSwitcher };
