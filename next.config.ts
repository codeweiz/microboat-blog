import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withMDX = createMDX();

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [{ hostname: "**" }],
	},
};

const withNextIntl = createNextIntlPlugin();

export default withMDX(withNextIntl(nextConfig));
