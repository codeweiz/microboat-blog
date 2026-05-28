import Link from "next/link";
import NotFoundIcon from "@/components/icons/not-found";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<html lang="en">
			<body>
				<main className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
					<div className="text-center mb-16">
						<NotFoundIcon className="mx-auto" />
						<h1 className="text-4xl font-bold mb-4">404 Not Found</h1>
						<p className="text-lg mb-16 text-gray-600 dark:text-gray-400">
							The page you&apos;re looking for doesn&apos;t exist or has been
							moved.
						</p>
						<Link href="/" className="inline-block">
							<Button className="px-6 py-4text-lg rounded-md font-semibold cursor-pointer">
								Return Home
							</Button>
						</Link>
					</div>
				</main>
			</body>
		</html>
	);
}
