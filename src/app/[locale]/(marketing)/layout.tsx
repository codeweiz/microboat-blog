import { getLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { getSearchIndex } from "@/lib/posts";

export default async function MarketingLayout({
	children,
}: {
	children: ReactNode;
}) {
	const locale = await getLocale();
	const searchIndex = getSearchIndex(locale);

	return (
		<div className="flex flex-col">
			<Header searchIndex={searchIndex} />
			{children}
			<Footer />
		</div>
	);
}
