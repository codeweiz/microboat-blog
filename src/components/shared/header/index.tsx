"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { Logo } from "@/components/icons/logo";
import { getNavItems } from "@/config/navigation";
import { Link as I18nLink } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export const Header = () => {
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
							className="flex items-center gap-2 font-extrabold text-xl"
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

						<ul
							className={cn(
								"w-full flex-col gap-2 lg:flex lg:w-auto lg:flex-row lg:gap-6",
								menuState ? "flex" : "hidden",
							)}
						>
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
					</div>
				</div>
			</nav>
		</header>
	);
};
