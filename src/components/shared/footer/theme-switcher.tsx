"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMounted } from "@/lib/hooks/use-mounted";

function ThemeSwitcher() {
	const { resolvedTheme, setTheme } = useTheme();
	const mounted = useMounted();

	// Prevent hydration mismatch by not rendering theme-dependent state until mounted
	if (!mounted) {
		return (
			<div className="flex items-center space-x-2">
				<Sun className="h-4 w-4" />
				<Switch id="dark-mode" checked={false} disabled />
				<Moon className="h-4 w-4" />
				<Label htmlFor="dark-mode" className="sr-only">
					Toggle dark mode
				</Label>
			</div>
		);
	}

	const isDark = resolvedTheme === "dark";

	return (
		<div className="flex items-center space-x-2">
			<Sun className="h-4 w-4" />
			<Switch
				id="dark-mode"
				checked={isDark}
				onCheckedChange={() => {
					setTheme(isDark ? "light" : "dark");
				}}
			/>
			<Moon className="h-4 w-4" />
			<Label htmlFor="dark-mode" className="sr-only">
				Toggle dark mode
			</Label>
		</div>
	);
}

export { ThemeSwitcher };
