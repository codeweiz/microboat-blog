import { useTranslations } from "next-intl";
import { getSocialMediaData, type SocialMedia } from "./social-media";

export function getFooterData(): FooterData {
	const t = useTranslations("footer");
	const socialData = getSocialMediaData();

	return {
		links: {
			title: t("links.title"),
			items: [
				{ label: t("links.home"), href: "/" },
				{ label: t("links.blog"), href: "/blog" },
				{ label: t("links.rss"), href: "/rss.xml" },
			],
		},
		social: socialData,
		copyright: t("copyright"),
	};
}

export interface FooterLink {
	label: string;
	href: string;
}

export interface FooterData {
	links: {
		title: string;
		items: FooterLink[];
	};
	social: {
		title: string;
		media: SocialMedia[];
	};
	copyright: string;
}
