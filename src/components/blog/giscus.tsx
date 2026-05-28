"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

const GISCUS_CONFIG = {
	repo: "codeweiz/microboat-blog",
	repoId: "R_kgDOSqQ8yw",
	category: "Announcements",
	categoryId: "DIC_kwDOSqQ8y84C-A40",
	mapping: "pathname",
	strict: "0",
	reactionsEnabled: "1",
	emitMetadata: "0",
	inputPosition: "bottom",
	lang: "en",
	loading: "lazy",
} as const;

export function Giscus({ locale }: { locale?: string }) {
	const ref = useRef<HTMLDivElement>(null);
	const { resolvedTheme } = useTheme();

	useEffect(() => {
		const node = ref.current;
		if (!node) {
			return;
		}

		node.innerHTML = "";

		const script = document.createElement("script");
		script.src = "https://giscus.app/client.js";
		script.async = true;
		script.crossOrigin = "anonymous";
		script.setAttribute("data-repo", GISCUS_CONFIG.repo);
		script.setAttribute("data-repo-id", GISCUS_CONFIG.repoId);
		script.setAttribute("data-category", GISCUS_CONFIG.category);
		script.setAttribute("data-category-id", GISCUS_CONFIG.categoryId);
		script.setAttribute("data-mapping", GISCUS_CONFIG.mapping);
		script.setAttribute("data-strict", GISCUS_CONFIG.strict);
		script.setAttribute(
			"data-reactions-enabled",
			GISCUS_CONFIG.reactionsEnabled,
		);
		script.setAttribute("data-emit-metadata", GISCUS_CONFIG.emitMetadata);
		script.setAttribute("data-input-position", GISCUS_CONFIG.inputPosition);
		script.setAttribute(
			"data-theme",
			resolvedTheme === "dark" ? "dark" : "light",
		);
		script.setAttribute("data-lang", locale === "zh" ? "zh-CN" : "en");
		script.setAttribute("data-loading", GISCUS_CONFIG.loading);

		node.appendChild(script);
	}, [resolvedTheme, locale]);

	return <div ref={ref} className="giscus mt-12" />;
}
