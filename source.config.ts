import { defineCollections } from "fumadocs-mdx/config";
import { z } from "zod";
import { appConfig } from "@/config";

export const blogs = defineCollections({
	type: "doc",
	dir: "src/content/blog",
	schema: (ctx) => {
		return z.object({
			title: z.string(),
			description: z.string(),
			keywords: z.string().optional(),
			createdAt: z.date(),
			updatedAt: z.date(),
			tags: z.array(z.string()).optional(),
			author: z.string(),
			image: z.string().optional(),
			slug: z.string().default(ctx.path.split("/").pop()?.split(".")[0]),
			locale: z.string().default(() => {
				const locale = ctx.path.split("/").pop()?.split(".")[1];
				if (locale === "md" || locale === "mdx") {
					return appConfig.i18n.defaultLocale;
				}
				return locale;
			}),
		});
	},
});
