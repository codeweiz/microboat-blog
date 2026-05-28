import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import defaultMdxComponents from "fumadocs-ui/mdx";
import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";

const ImageWrapper = ({ src, alt }: { src: string; alt: string }) => {
	if (!src) {
		return null;
	}

	return (
		<ImageZoom
			src={src}
			alt={alt || "image"}
			width={960}
			height={540}
			style={{
				width: "100%",
				height: "auto",
				objectFit: "contain",
			}}
			priority
		/>
	);
};

const components = {
	...defaultMdxComponents,
	h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h1
			className={cn(
				"font-heading my-8 scroll-m-20 text-2xl md:text-[1.8rem] leading-[2.6rem] font-semibold tracking-tight",
				className,
			)}
			{...props}
		/>
	),
	h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h2
			className={cn(
				"font-heading my-6 md:my-8 scroll-m-20 text-xl md:text-[1.6rem] leading-[2.4rem] font-semibold tracking-tight",
				className,
			)}
			{...props}
		/>
	),
	h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h3
			className={cn(
				"font-heading my-6 md:my-8 scroll-m-20 text-lg md:text-[1.4rem] leading-[2.2rem] font-semibold tracking-tight",
				className,
			)}
			{...props}
		/>
	),
	h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h4
			className={cn(
				"font-heading my-6 md:my-8 scroll-m-20 text-base md:text-[1.2rem] leading-[2rem] font-semibold tracking-tight",
				className,
			)}
			{...props}
		/>
	),
	h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h5
			className={cn(
				"font-heading my-6 md:my-8 scroll-m-20 text-base md:text-[1rem] leading-[1.8rem] font-semibold tracking-tight",
				className,
			)}
			{...props}
		/>
	),
	h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h6
			className={cn(
				"font-heading my-6 md:my-8 scroll-m-20 text-base md:text-[0.8rem] leading-[1.6rem] font-semibold tracking-tight",
				className,
			)}
			{...props}
		/>
	),
	a: ({ className, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
		<a
			className={cn(
				"font-medium transition-all duration-300 ease-in-out underline underline-offset-3 break-words",
				className,
			)}
			{...props}
		/>
	),
	p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
		<p
			className={cn("my-4 text-[1.1rem] leading-[2rem]", className)}
			{...props}
		/>
	),
	strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
		<strong className={cn("font-bold", className)} {...props} />
	),
	ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
		<ul className={cn("my-6 ml-3 md:ml-6 list-disc", className)} {...props} />
	),
	ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
		<ol
			className={cn("my-6 ml-3 md:ml-6 list-decimal", className)}
			{...props}
		/>
	),
	li: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
		<li
			className={cn(
				"mt-2 ml-3 md:ml-4 text-[1.1rem] leading-[1.6em]",
				className,
			)}
			{...props}
		/>
	),
	blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
		<blockquote
			className={cn("my-6 border-l-[3px] border-[#343a40] pl-4", className)}
			{...props}
		/>
	),
	hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => (
		<hr className="my-4 md:my-8" {...props} />
	),
	small: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
		<small className={cn("text-[70%]", className)} {...props} />
	),
	Link: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
		<Link
			className={cn(
				"font-medium text-blue-600 no-underline transition-all duration-300 ease-in-out hover:underline",
				className,
			)}
			{...props}
		/>
	),
	LinkedCard: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
		<Link
			className={cn(
				"flex w-full flex-col items-center rounded-xl border bg-card p-6 text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-10",
				className,
			)}
			{...props}
		/>
	),
	figure: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
		<figure className={cn("overflow-x-auto", className)} {...props} />
	),
	img: ImageWrapper,
	Image: ImageWrapper,
};

export { components };
