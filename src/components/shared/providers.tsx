import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";
import { Toaster } from "@/components/ui/sonner";
import { appConfig } from "@/config";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

// Editorial display/serif face for headings and long-form prose.
const fraunces = Fraunces({
	variable: "--font-fraunces",
	subsets: ["latin"],
	style: ["normal", "italic"],
	display: "swap",
});

export async function AppProviders({
	children,
	locale,
}: PropsWithChildren<{ locale: string }>) {
	const defaultMode = appConfig.ui.theme.defaultMode;

	return (
		<html lang={locale} suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased min-w-screen overflow-x-hidden`}
			>
				<ThemeProvider
					defaultTheme={defaultMode}
					attribute="class"
					enableSystem
					disableTransitionOnChange
				>
					{children}
					<Toaster richColors position="top-right" offset={64} />
				</ThemeProvider>
			</body>
		</html>
	);
}
