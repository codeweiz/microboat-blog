"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { appConfig } from "@/config";
import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const logoLight = appConfig.metadata.images?.logoLight ?? "/logo.png";
	const logoDark = appConfig.metadata.images?.logoDark ?? logoLight;

	const logo = mounted && resolvedTheme === "dark" ? logoDark : logoLight;

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<Image
			src={logo}
			alt="Logo"
			title="Logo"
			width={96}
			height={96}
			className={cn("size-8", className)}
		/>
	);
};
