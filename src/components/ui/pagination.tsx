import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	basePath: string;
}

export function Pagination({
	currentPage,
	totalPages,
	basePath,
}: PaginationProps) {
	// Don't render pagination if there's only one page or no pages
	if (totalPages <= 1) {
		return null;
	}

	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

	return (
		<div className="flex items-center justify-center space-x-2 mt-8">
			<Link href={`${basePath}?page=${currentPage - 1}`} passHref>
				<Button
					variant="ghost"
					size="icon"
					disabled={currentPage === 1}
					className="cursor-pointer"
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>
			</Link>
			{pages.map((page) => (
				<Link key={page} href={`${basePath}?page=${page}`} passHref>
					<Button
						variant={currentPage === page ? "default" : "ghost"}
						className="w-8 h-8 cursor-pointer"
					>
						{page}
					</Button>
				</Link>
			))}
			<Link href={`${basePath}?page=${currentPage + 1}`} passHref>
				<Button
					variant="ghost"
					size="icon"
					disabled={currentPage === totalPages}
					className="cursor-pointer"
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</Link>
		</div>
	);
}
