import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, type Locale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { AppProviders } from "@/components/shared/providers";
import { routing } from "@/i18n/routing";
import { metadata } from "@/lib/metadata";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "app.metadata" });

	return metadata({
		title: {
			template: `%s | ${t("title")}`,
			default: t("title") || "",
		},
		description: t("description"),
	});
}

export default async function LocaleLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: Locale }>;
}>) {
	const { locale } = await params;

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	return (
		<AppProviders locale={locale}>
			<NextIntlClientProvider>{children}</NextIntlClientProvider>
		</AppProviders>
	);
}
