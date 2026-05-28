import { useTranslations } from "next-intl";

export function getNavItems(): NavItem[] {
	const t = useTranslations("navigation");

	return [
		{ id: 1, label: t("home"), link: "/" },
		{ id: 2, label: t("blog"), link: "/blog" },
	];
}

export interface NavItem {
	id: number;
	label: string;
	link: string;
}
