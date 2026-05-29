"use client";

import type { TOCItemType } from "fumadocs-core/toc";
import * as React from "react";

import { cn } from "@/lib/utils";

interface TocProps {
	items: TOCItemType[];
}

export function DashboardTableOfContents({ items }: TocProps) {
	const itemIds = React.useMemo(
		() =>
			items
				? items
						.map((item) => item.url)
						.filter(Boolean)
						.map((id) => id?.split("#")[1])
				: [],
		[items],
	);
	const activeHeading = useActiveItem(itemIds);

	if (!items?.length) {
		return null;
	}

	return (
		<div className="space-y-2">
			<Tree items={items} activeItem={activeHeading} />
		</div>
	);
}

function useActiveItem(itemIds: string[]) {
	const [activeId, setActiveId] = React.useState(null);

	React.useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id);
					}
				});
			},
			{ rootMargin: "0% 0% -80% 0%" },
		);

		itemIds?.forEach((id) => {
			const element = document.getElementById(id);
			if (element) {
				observer.observe(element);
			}
		});

		return () => {
			itemIds?.forEach((id) => {
				const element = document.getElementById(id);
				if (element) {
					observer.unobserve(element);
				}
			});
		};
	}, [itemIds]);

	return activeId;
}

interface TreeProps {
	items: TOCItemType[];
	activeItem?: string;
}

function Tree({ items, activeItem }: TreeProps) {
	return items?.length ? (
		<ul className="m-2 list-none">
			{items.map((item, index) => (
				<li
					key={index}
					className={cn("mt-0 pt-2")}
					style={{ paddingLeft: `${(item.depth - 1) * 16}px` }}
				>
					<a
						href={item.url}
						className={cn(
							"inline-block no-underline transition-colors hover:text-foreground",
							item.url === `#${activeItem}`
								? "font-medium text-foreground"
								: "text-muted-foreground",
						)}
					>
						{item.title}
					</a>
				</li>
			))}
		</ul>
	) : null;
}
