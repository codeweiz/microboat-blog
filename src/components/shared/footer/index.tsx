"use client";

import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/shared/footer/locale-switcher";
import { SocialButton } from "@/components/shared/footer/social-button";
import { ThemeSwitcher } from "@/components/shared/footer/theme-switcher";
import { appConfig } from "@/config";
import { getFooterData } from "@/config/footer";

function Footer() {
	const footerData = getFooterData();
	const t = useTranslations("app");

	return (
		<footer className="border-t bg-muted/30">
			<div className="container mx-auto max-w-5xl px-6 py-12">
				<div className="grid gap-10 md:grid-cols-3">
					<div>
						<h3 className="mb-3 text-base font-semibold">{t("name")}</h3>
						<p className="text-sm text-muted-foreground">{t("tagline")}</p>
					</div>
					<div>
						<h3 className="mb-3 text-base font-semibold">
							{footerData.links.title}
						</h3>
						<nav className="flex flex-col gap-2 text-sm">
							{footerData.links.items.map((link) => (
								<a
									key={link.href}
									href={link.href}
									className="text-muted-foreground transition-colors hover:text-foreground"
								>
									{link.label}
								</a>
							))}
						</nav>
					</div>
					<div>
						<SocialButton />
						<div className="mt-4 flex flex-col gap-3">
							{appConfig.ui.theme.enabled && <ThemeSwitcher />}
							{appConfig.i18n.enabled && <LocaleSwitcher />}
						</div>
					</div>
				</div>
				<div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
					{footerData.copyright}
				</div>
			</div>
		</footer>
	);
}

export { Footer };
