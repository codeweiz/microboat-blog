import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";
import { Toaster } from "@/components/ui/sonner";
import { appConfig } from "@/config";

export async function AppProviders({
	children,
	locale,
}: PropsWithChildren<{ locale: string }>) {
	const defaultMode = appConfig.ui.theme.defaultMode;

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className="min-w-screen overflow-x-hidden antialiased">
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
