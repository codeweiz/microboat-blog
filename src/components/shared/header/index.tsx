"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { Logo } from "@/components/icons/logo";
import { LocaleToggle } from "@/components/shared/header/locale-toggle";
import { ThemeToggleButton } from "@/components/shared/header/theme-toggle-button";
import { SearchDialog } from "@/components/shared/search/search-dialog";
import { appConfig } from "@/config";
import { getNavItems } from "@/config/navigation";
import { Link as I18nLink } from "@/i18n/navigation";
import type { SearchEntry } from "@/lib/posts";
import { cn } from "@/lib/utils";

export const Header = ({ searchIndex }: { searchIndex: SearchEntry[] }) => {
	const [menuState, setMenuState] = React.useState(false);
	const navItems = getNavItems();
	const t = useTranslations("app");

	return (
		<header>
			<nav
				data-state={menuState && "active"}
				className={cn(
					"fixed z-20 w-full bg-background/80 backdrop-blur border-b",
				)}
			>
				<div className="mx-auto max-w-5xl px-6">
					<div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:py-4">
						<I18nLink
							href="/"
							aria-label="home"
							className="flex items-center gap-2 font-serif text-xl font-bold"
						>
							<Logo />
							{t("name")}
						</I18nLink>

						<button
							type="button"
							onClick={() => setMenuState(!menuState)}
							aria-label={menuState ? "Close Menu" : "Open Menu"}
							className="relative z-20 -m-2.5 block cursor-pointer p-2.5 lg:hidden"
						>
							{menuState ? (
								<X className="m-auto size-6" />
							) : (
								<Menu className="m-auto size-6" />
							)}
						</button>

						<div
							className={cn(
								"w-full flex-col items-start gap-4 lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-6",
								menuState ? "flex" : "hidden",
							)}
						>
							<ul className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:gap-6">
								{navItems.map((item) => (
									<li key={item.id}>
										<I18nLink
											href={item.link}
											className="block py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
											onClick={() => setMenuState(false)}
										>
											{item.label}
										</I18nLink>
									</li>
								))}
							</ul>

							<div className="flex items-center gap-1 lg:gap-2">
								<SearchDialog index={searchIndex} />
								{appConfig.ui.theme.enabled && <ThemeToggleButton />}
								{appConfig.i18n.enabled && <LocaleToggle />}
							</div>
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
};
