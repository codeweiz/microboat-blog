"use client";

import { RotateCcw } from "lucide-react";
import { type PointerEvent, useMemo, useRef, useState } from "react";
import { Link as I18nLink } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type LineageNode = {
	id: string;
	kind: "concept" | "post";
	label: string;
	slug?: string;
	image?: string;
	date?: string;
	count?: number;
	x: number;
	y: number;
};

type LineageEdge = {
	id: string;
	from: string;
	to: string;
	relation: "concept" | "link" | "series";
};

type DragState = {
	id: string;
	startX: number;
	startY: number;
	moved: boolean;
};

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

export function KnowledgeLineageGraph({
	nodes,
	edges,
	locale,
}: {
	nodes: LineageNode[];
	edges: LineageEdge[];
	locale: string;
}) {
	const initialNodes = useMemo(() => nodes, [nodes]);
	const [graphNodes, setGraphNodes] = useState(initialNodes);
	const [activeId, setActiveId] = useState(
		initialNodes.find((n) => n.kind === "post")?.id,
	);
	const drag = useRef<DragState | null>(null);
	const wasDragged = useRef(false);
	const boardRef = useRef<HTMLDivElement>(null);
	const nodeMap = new Map(graphNodes.map((node) => [node.id, node]));
	const activeNode = activeId ? nodeMap.get(activeId) : null;
	const activeEdges = new Set(
		edges
			.filter((edge) => edge.from === activeId || edge.to === activeId)
			.flatMap((edge) => [edge.from, edge.to]),
	);

	const copy =
		locale === "zh"
			? {
					focus: "牵引",
					reset: "恢复布局",
					conceptDescription: (count: number) =>
						`${count} 篇文章经过这个主题。`,
					postDescription: (count: number) => `${count} 条关系被点亮。`,
				}
			: {
					focus: "Focus",
					reset: "Reset graph layout",
					conceptDescription: (count: number) =>
						`${count} notes pass through this idea.`,
					postDescription: (count: number) =>
						`${count} nearby ideas and notes are currently lit up.`,
				};

	const pointFromEvent = (event: PointerEvent) => {
		const rect = boardRef.current?.getBoundingClientRect();
		if (!rect) {
			return { x: 50, y: 50 };
		}
		return {
			x: clamp(((event.clientX - rect.left) / rect.width) * 100, 8, 92),
			y: clamp(((event.clientY - rect.top) / rect.height) * 100, 10, 90),
		};
	};

	const moveNode = (id: string, x: number, y: number) => {
		setGraphNodes((current) =>
			current.map((node) => (node.id === id ? { ...node, x, y } : node)),
		);
	};

	return (
		<div className="mt-5">
			<div
				ref={boardRef}
				className="relative min-h-[660px] overflow-hidden rounded-lg border bg-card/60 shadow-sm md:min-h-[540px]"
			>
				<div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:44px_44px] text-border/35" />
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_35%_25%,rgba(130,95,72,0.13),transparent_35%),linear-gradient(135deg,transparent,rgba(255,255,255,0.32),transparent)]" />
				<svg
					className="absolute inset-0 h-full w-full"
					viewBox="0 0 100 100"
					preserveAspectRatio="none"
					aria-hidden="true"
				>
					{edges.map((edge) => {
						const from = nodeMap.get(edge.from);
						const to = nodeMap.get(edge.to);
						if (!from || !to) {
							return null;
						}
						const highlighted = edge.from === activeId || edge.to === activeId;
						return (
							<line
								key={edge.id}
								x1={from.x}
								y1={from.y}
								x2={to.x}
								y2={to.y}
								stroke="currentColor"
								strokeWidth={highlighted ? 0.48 : 0.22}
								vectorEffect="non-scaling-stroke"
								className={cn(
									"transition-all duration-300",
									edge.relation === "concept" && "text-primary/35",
									edge.relation === "link" && "text-foreground/45",
									edge.relation === "series" && "text-secondary-foreground/45",
									highlighted && "text-primary/80",
								)}
							/>
						);
					})}
				</svg>

				{graphNodes.map((node) => {
					const active = node.id === activeId;
					const connected = activeEdges.has(node.id);
					const dim = activeId && !active && !connected;
					const commonProps = {
						onPointerDown: (event: PointerEvent<HTMLElement>) => {
							(event.currentTarget as HTMLElement).setPointerCapture(
								event.pointerId,
							);
							wasDragged.current = false;
							drag.current = {
								id: node.id,
								startX: event.clientX,
								startY: event.clientY,
								moved: false,
							};
							setActiveId(node.id);
						},
						onPointerMove: (event: PointerEvent<HTMLElement>) => {
							if (drag.current?.id !== node.id) {
								return;
							}
							if (
								Math.abs(event.clientX - drag.current.startX) > 3 ||
								Math.abs(event.clientY - drag.current.startY) > 3
							) {
								drag.current.moved = true;
								wasDragged.current = true;
							}
							const point = pointFromEvent(event);
							moveNode(node.id, point.x, point.y);
						},
						onPointerUp: () => {
							drag.current = null;
						},
						onPointerCancel: () => {
							drag.current = null;
						},
						style: { left: `${node.x}%`, top: `${node.y}%` },
					};

					if (node.kind === "concept") {
						return (
							<button
								key={node.id}
								type="button"
								className={cn(
									"absolute -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border bg-background/92 px-3 py-1.5 text-xs shadow-sm backdrop-blur transition-all active:cursor-grabbing",
									active && "border-primary bg-primary/10 shadow-md",
									dim && "opacity-45",
								)}
								{...commonProps}
							>
								<span>{node.label}</span>
								<sup className="ml-1 text-muted-foreground">{node.count}</sup>
							</button>
						);
					}

					return (
						<I18nLink
							key={node.id}
							href={`/blog/${node.slug}`}
							onClick={(event) => {
								if (wasDragged.current) {
									event.preventDefault();
									wasDragged.current = false;
								}
							}}
							className={cn(
								"group absolute w-[min(13.5rem,68vw)] -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-lg border bg-background/94 p-2.5 shadow-sm backdrop-blur transition-all active:cursor-grabbing",
								active && "border-primary bg-primary/10 shadow-md",
								connected && !active && "border-primary/35",
								dim && "opacity-50",
							)}
							{...commonProps}
						>
							<div className="flex gap-3">
								{node.image ? (
									<img
										src={node.image}
										alt=""
										className="h-11 w-14 shrink-0 rounded-md border object-cover"
									/>
								) : null}
								<div className="min-w-0">
									<h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:underline">
										{node.label}
									</h3>
									<span className="mt-1 block text-[11px] text-muted-foreground tabular-nums">
										{node.date}
									</span>
								</div>
							</div>
						</I18nLink>
					);
				})}
			</div>

			<aside className="mt-3 rounded-lg border bg-card/55 p-4 shadow-sm">
				<div className="flex items-center justify-between gap-3">
					<p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
						{copy.focus}
					</p>
					<button
						type="button"
						title={copy.reset}
						aria-label={copy.reset}
						className="inline-flex h-8 w-8 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:text-foreground"
						onClick={() => {
							setGraphNodes(initialNodes);
							setActiveId(initialNodes.find((n) => n.kind === "post")?.id);
						}}
					>
						<RotateCcw className="h-4 w-4" />
					</button>
				</div>
				{activeNode ? (
					<div className="mt-4">
						<p className="text-lg font-semibold leading-snug">
							{activeNode.label}
						</p>
						<p className="mt-3 text-sm leading-6 text-muted-foreground">
							{activeNode.kind === "concept"
								? copy.conceptDescription(activeNode.count ?? 0)
								: copy.postDescription(activeEdges.size)}
						</p>
					</div>
				) : null}
			</aside>
		</div>
	);
}
