import type { ReactNode } from "react";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";

export default function MarketingLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex flex-col">
			<Header />
			{children}
			<Footer />
		</div>
	);
}
