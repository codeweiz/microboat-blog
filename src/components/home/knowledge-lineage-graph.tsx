"use client";

import { Minus, Plus, RotateCcw } from "lucide-react";
import { type PointerEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type LineageNode = {
	id: string;
	label: string;
	slug: string;
	image?: string;
	date: string;
	x: number;
	y: number;
};

type LineageEdge = {
	id: string;
	from: string;
	to: string;
	relation: "shared" | "link" | "series";
	weight: number;
};

type DragState = {
	id: string;
	startX: number;
	startY: number;
};

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

export function KnowledgeLineageGraph({
	nodes,
	edges,
}: {
	nodes: LineageNode[];
	edges: LineageEdge[];
}) {
	const router = useRouter();
	const initialNodes = useMemo(() => nodes, [nodes]);
	const [graphNodes, setGraphNodes] = useState(initialNodes);
	const [activeId, setActiveId] = useState(initialNodes[0]?.id);
	const [scale, setScale] = useState(1);
	const drag = useRef<DragState | null>(null);
	const boardRef = useRef<HTMLDivElement>(null);
	const nodeMap = new Map(graphNodes.map((node) => [node.id, node]));
	const activeEdges = new Set(
		edges
			.filter((edge) => edge.from === activeId || edge.to === activeId)
			.flatMap((edge) => [edge.from, edge.to]),
	);

	const pointFromEvent = (event: PointerEvent) => {
		const rect = boardRef.current?.getBoundingClientRect();
		if (!rect) {
			return { x: 50, y: 50 };
		}
		const x = ((event.clientX - rect.left) / rect.width) * 100;
		const y = ((event.clientY - rect.top) / rect.height) * 100;
		const scaledX = 50 + (x - 50) / scale;
		const scaledY = 50 + (y - 50) / scale;
		return {
			x: clamp(scaledX, 5, 95),
			y: clamp(scaledY, 8, 92),
		};
	};

	const moveNode = (id: string, x: number, y: number) => {
		setGraphNodes((current) =>
			current.map((node) => (node.id === id ? { ...node, x, y } : node)),
		);
	};
	const updateScale = (nextScale: number) => {
		setScale(clamp(Number(nextScale.toFixed(2)), 0.62, 1.75));
	};
	const reset = () => {
		setGraphNodes(initialNodes);
		setActiveId(initialNodes[0]?.id);
		setScale(1);
	};

	return (
		<div className="mt-5">
			<div
				ref={boardRef}
				className="relative min-h-[520px] overflow-hidden rounded-lg border bg-card/60 shadow-sm md:min-h-[500px]"
			>
				<div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:42px_42px] text-border/35" />
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_25%,rgba(130,95,72,0.16),transparent_34%),linear-gradient(135deg,transparent,rgba(255,255,255,0.3),transparent)]" />

				<div className="absolute top-3 right-3 z-20 flex rounded-md border bg-background/88 p-1 shadow-sm backdrop-blur">
					<button
						type="button"
						title="Zoom out"
						aria-label="Zoom out"
						className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
						onClick={() => updateScale(scale - 0.14)}
					>
						<Minus className="h-4 w-4" />
					</button>
					<button
						type="button"
						title="Reset"
						aria-label="Reset graph"
						className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
						onClick={reset}
					>
						<RotateCcw className="h-4 w-4" />
					</button>
					<button
						type="button"
						title="Zoom in"
						aria-label="Zoom in"
						className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
						onClick={() => updateScale(scale + 0.14)}
					>
						<Plus className="h-4 w-4" />
					</button>
				</div>

				<div
					className="absolute inset-0 transition-transform duration-300 ease-out"
					style={{ transform: `scale(${scale})`, transformOrigin: "50% 50%" }}
				>
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
							const highlighted =
								edge.from === activeId || edge.to === activeId;
							return (
								<line
									key={edge.id}
									x1={from.x}
									y1={from.y}
									x2={to.x}
									y2={to.y}
									stroke="currentColor"
									strokeWidth={highlighted ? 0.44 : 0.18}
									vectorEffect="non-scaling-stroke"
									className={cn(
										"transition-all duration-300",
										edge.relation === "shared" && "text-primary/28",
										edge.relation === "link" && "text-foreground/45",
										edge.relation === "series" &&
											"text-secondary-foreground/45",
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
						const size = active ? 72 : connected ? 62 : 54;
						return (
							<button
								key={node.id}
								type="button"
								title={node.label}
								className={cn(
									"group absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border bg-background/90 p-1 shadow-sm backdrop-blur transition-[opacity,box-shadow,border-color,transform] active:cursor-grabbing",
									active && "z-20 border-primary shadow-lg shadow-primary/10",
									connected && !active && "border-primary/45 shadow-md",
									dim && "opacity-40",
								)}
								style={{
									left: `${node.x}%`,
									top: `${node.y}%`,
									width: size,
									height: size,
								}}
								onClick={() => {
									setActiveId(node.id);
								}}
								onDoubleClick={() => {
									router.push(`/blog/${node.slug}`);
								}}
								onPointerDown={(event) => {
									event.currentTarget.setPointerCapture(event.pointerId);
									drag.current = {
										id: node.id,
										startX: event.clientX,
										startY: event.clientY,
									};
									setActiveId(node.id);
								}}
								onPointerMove={(event) => {
									if (drag.current?.id !== node.id) {
										return;
									}
									if (
										Math.abs(event.clientX - drag.current.startX) > 3 ||
										Math.abs(event.clientY - drag.current.startY) > 3
									) {
										event.preventDefault();
									}
									const point = pointFromEvent(event);
									moveNode(node.id, point.x, point.y);
								}}
								onPointerUp={(event) => {
									event.currentTarget.releasePointerCapture(event.pointerId);
									drag.current = null;
								}}
								onPointerCancel={() => {
									drag.current = null;
								}}
							>
								{node.image ? (
									<img
										src={node.image}
										alt=""
										className="h-full w-full rounded-full object-cover"
										draggable={false}
									/>
								) : (
									<span className="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs">
										{node.label.slice(0, 2)}
									</span>
								)}
								<span
									className={cn(
										"pointer-events-none absolute top-full left-1/2 mt-2 hidden max-w-52 -translate-x-1/2 rounded-md border bg-background/95 px-2 py-1 text-xs leading-snug shadow-sm",
										active && "block",
									)}
								>
									<span className="line-clamp-2">{node.label}</span>
									<span className="mt-0.5 block text-[10px] text-muted-foreground">
										{node.date}
									</span>
								</span>
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
