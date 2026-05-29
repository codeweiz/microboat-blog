import { useTranslations } from "next-intl";

export function getNavItems(): NavItem[] {
	const t = useTranslations("navigation");

	return [
		{ id: 1, label: t("home"), link: "/" },
		{ id: 2, label: t("blog"), link: "/blog" },
		{ id: 3, label: t("tags"), link: "/tags" },
		{ id: 4, label: t("about"), link: "/about" },
	];
}

export interface NavItem {
	id: number;
	label: string;
	link: string;
}
