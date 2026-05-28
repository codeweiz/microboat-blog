import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { SocialMediaIcons as Icons } from "@/components/icons/social-media";

export interface SocialMedia {
	name: string;
	href: string;
	icon: ReactNode;
}

export function getSocialMediaData(): {
	title: string;
	media: SocialMedia[];
} {
	const t = useTranslations("footer");

	return {
		title: t("social.title"),
		media: [
			{
				name: "Facebook",
				href: "https://www.facebook.com",
				icon: <Icons.Facebook className="h-4 w-4" />,
			},
			{
				name: "X",
				href: "https://www.x.com",
				icon: <Icons.X className="h-4 w-4" />,
			},
			{
				name: "Instagram",
				href: "https://www.instagram.com",
				icon: <Icons.Instagram className="h-4 w-4" />,
			},
			{
				name: "Linkedin",
				href: "https://www.linkedin.com",
				icon: <Icons.LinkedIn className="h-4 w-4" />,
			},
		],
	};
}
