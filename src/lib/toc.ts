interface Item {
	title: string | { props: { children: string } };
	url: string;
	depth: number;
}

interface TableOfContents {
	items: Item[];
}

export type { TableOfContents, Item };
