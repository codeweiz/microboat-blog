"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useMounted } from "@/lib/hooks/use-mounted";

/** Compact icon button for the header (the footer keeps the labelled switch). */
export function ThemeToggleButton() {
	const { resolvedTheme, setTheme } = useTheme();
	const mounted = useMounted();
	const isDark = mounted && resolvedTheme === "dark";

	return (
		<button
			type="button"
			aria-label="Toggle dark mode"
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
		>
			{isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
		</button>
	);
}
