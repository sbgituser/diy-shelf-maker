"use client";

import React, { useMemo } from "react";
import type { GridDesign, GridPillar, GridShelf } from "@/types";
import type { GridAccessory } from "@/types";
import { SHELF_BOARDS, ACCESSORY_MAP } from "@/data/products";
import {
  GRID_COLORS as C,
} from "@/constants/colors";
import {
  SVG_W, SVG_H, M, DW, DH,
  PILLAR_PX, GRID_VISUAL,
} from "@/constants/grid";

// ── 個別SVG要素をReact.memoでラップ ──

interface PillarSvgProps {
  pillar: GridPillar;
  px: number;
  isSel: boolean;
  isHov: boolean;
  isDragging: boolean;
  mode: string;
  onMouseDown: (id: string, type: "pillar" | "shelf", e: React.MouseEvent) => void;
  onClick: (id: string, e: React.MouseEvent) => void;
  onMouseEnter: (id: string) => void;
  onMouseLeave: (id: string) => void;
  toSvgX: (mm: number) => number;
}

const PillarSvg = React.memo(function PillarSvg({
  pillar, px, isSel, isHov, isDragging, mode,
  onMouseDown, onClick, onMouseEnter, onMouseLeave, toSvgX,
}: PillarSvgProps) {
  return (
    <g
      onClick={(e) => onClick(pillar.id, e)}
      onMouseDown={(e) => onMouseDown(pillar.id, "pillar", e)}
      onMouseEnter={() => onMouseEnter(pillar.id)}
      onMouseLeave={() => onMouseLeave(pillar.id)}
      style={{ cursor: mode === "select" ? (isDragging ? "grabbing" : isSel ? "grab" : "pointer") : "default" }}
    >
      <rect x={px - 8} y={M.top} width={PILLAR_PX + 16} height={DH} fill="transparent" />
      {isSel && (
        <rect
          x={px - 3} y={M.top - 2} width={PILLAR_PX + 6} height={DH + 4}
          fill="none" stroke={C.selected} strokeWidth="3" rx="4" opacity="0.3"
          filter="url(#glow-sel)"
        />
      )}
      <rect
        x={px} y={M.top + (pillar.adjuster ? 6 : 0)}
        width={PILLAR_PX} height={DH - (pillar.adjuster ? 12 : 0)}
        fill={isSel ? C.selected : isHov ? C.pillarHover : C.pillar}
        stroke={isSel ? C.selectedStroke : C.pillarStroke}
        strokeWidth={isSel ? 2 : isHov ? 1.5 : 1}
        rx="2"
      />
      {!isSel && Array.from({ length: 5 }).map((_, j) => (
        <line
          key={j}
          x1={px + 2} y1={M.top + 30 + j * (DH / 6)}
          x2={px + PILLAR_PX - 2} y2={M.top + 35 + j * (DH / 6)}
          stroke={C.pillarStroke} strokeWidth="0.5" opacity="0.25"
        />
      ))}
      {pillar.adjuster && (
        <>
          <rect x={px - 1} y={M.top} width={PILLAR_PX + 2} height={6} fill={C.adjuster} rx="1" />
          <rect x={px - 1} y={M.top + DH - 6} width={PILLAR_PX + 2} height={6} fill={C.adjuster} rx="1" />
        </>
      )}
      {isHov && (
        <rect
          x={px - 2} y={M.top - 1} width={PILLAR_PX + 4} height={DH + 2}
          fill="none" stroke={C.pillarStroke} strokeWidth="1" strokeDasharray="4,3" rx="3" opacity="0.5"
        />
      )}
      <text x={toSvgX(pillar.x)} y={M.top + DH + 15} textAnchor="middle" fontSize="8" fill={isSel ? C.selectedStroke : "#777"}>
        {pillar.x}mm
      </text>
    </g>
  );
});

interface ShelfSvgProps {
  shelf: GridShelf;
  sx: number;
  ex: number;
  sy: number;
  thPx: number;
  isSel: boolean;
  isHov: boolean;
  isDragging: boolean;
  mode: string;
  onMouseDown: (id: string, type: "pillar" | "shelf", e: React.MouseEvent) => void;
  onClick: (id: string, e: React.MouseEvent) => void;
  onMouseEnter: (id: string) => void;
  onMouseLeave: (id: string) => void;
}

const ShelfSvg = React.memo(function ShelfSvg({
  shelf, sx, ex, sy, thPx, isSel, isHov, isDragging, mode,
  onMouseDown, onClick, onMouseEnter, onMouseLeave,
}: ShelfSvgProps) {
  const hitH = Math.max(thPx, 16);
  return (
    <g
      onClick={(e) => onClick(shelf.id, e)}
      onMouseDown={(e) => onMouseDown(shelf.id, "shelf", e)}
      onMouseEnter={() => onMouseEnter(shelf.id)}
      onMouseLeave={() => onMouseLeave(shelf.id)}
      style={{ cursor: mode === "select" ? (isDragging ? "grabbing" : isSel ? "grab" : "pointer") : "default" }}
    >
      <rect x={sx} y={sy - hitH / 2} width={ex - sx} height={hitH} fill="transparent" />
      {isSel && (
        <rect
          x={sx - 2} y={sy - thPx / 2 - 2} width={ex - sx + 4} height={thPx + 4}
          fill="none" stroke={C.selected} strokeWidth="3" rx="3" opacity="0.3"
          filter="url(#glow-sel)"
        />
      )}
      <rect
        x={sx} y={sy - thPx / 2} width={ex - sx} height={thPx}
        fill={isSel ? C.selected : isHov ? C.shelfHover : C.shelf}
        stroke={isSel ? C.selectedStroke : C.shelfStroke}
        strokeWidth={isSel ? 2 : isHov ? 1.5 : 1}
        rx="1"
      />
      <text x={ex + 5} y={sy + 3} fontSize="8" fill={isSel ? C.selectedStroke : "#999"}>
        {shelf.y}mm
      </text>
    </g>
  );
});

// ── GridCanvas本体 ──

interface GridCanvasProps {
  design: GridDesign;
  svgRef: React.RefObject<SVGSVGElement | null>;
  mode: string;
  selectedId: string | null;
  hoveredId: string | null;
  isDragging: boolean;
  hoverMm: { x: number; y: number } | null;
  dragVisualPos: { x: number; y: number } | null;
  dragTargetId: string | null;
  dragTargetType: "pillar" | "shelf" | null;
  toSvgX: (mm: number) => number;
  toSvgY: (mm: number) => number;
  maxX: number;
  pillarMap: Map<string, GridPillar>;
  ghostPillarX: number | null;
  ghostShelfPair: { left: GridPillar; right: GridPillar } | null;
  onCanvasClick: (e: React.MouseEvent<SVGSVGElement>) => void;
  onCanvasMove: (e: React.MouseEvent<SVGSVGElement>) => void;
  onCanvasMouseUp: () => void;
  onCanvasLeave: () => void;
  onElementMouseDown: (id: string, type: "pillar" | "shelf", e: React.MouseEvent) => void;
  onElementClick: (id: string, e: React.MouseEvent) => void;
  onSetHoveredId: (id: string | null) => void;
}

export default function GridCanvas({
  design, svgRef, mode, selectedId, hoveredId, isDragging,
  hoverMm, dragVisualPos, dragTargetId, dragTargetType,
  toSvgX, toSvgY, maxX, pillarMap,
  ghostPillarX, ghostShelfPair,
  onCanvasClick, onCanvasMove, onCanvasMouseUp, onCanvasLeave,
  onElementMouseDown, onElementClick, onSetHoveredId,
}: GridCanvasProps) {
  const xLines = useMemo(() => {
    const a: number[] = [];
    for (let x = 0; x <= maxX; x += GRID_VISUAL) a.push(x);
    return a;
  }, [maxX]);

  const yLines = useMemo(() => {
    const a: number[] = [];
    for (let y = 0; y <= design.ceilingHeight; y += GRID_VISUAL) a.push(y);
    return a;
  }, [design.ceilingHeight]);

  const handleMouseEnter = (id: string) => {
    if (mode === "select") onSetHoveredId(id);
  };
  const handleMouseLeave = (id: string) => {
    onSetHoveredId(null);
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-2">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full"
        style={{
          cursor: isDragging ? "grabbing" : mode === "select" ? "default" : "crosshair",
          fontFamily: "'Noto Sans JP', sans-serif",
        }}
        onClick={onCanvasClick}
        onMouseMove={onCanvasMove}
        onMouseUp={onCanvasMouseUp}
        onMouseLeave={onCanvasLeave}
      >
        <defs>
          <filter id="glow-sel" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feFlood floodColor={C.selectedGlow} result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width={SVG_W} height={SVG_H} fill={C.bg} rx="8" />

        {/* グリッド */}
        {xLines.map((x) => (
          <line
            key={`gx-${x}`}
            x1={toSvgX(x)} y1={M.top} x2={toSvgX(x)} y2={M.top + DH}
            stroke={x % 400 === 0 ? C.gridMajor : C.grid}
            strokeWidth={x % 400 === 0 ? "0.8" : "0.4"}
          />
        ))}
        {yLines.map((y) => (
          <line
            key={`gy-${y}`}
            x1={M.left} y1={toSvgY(y)} x2={M.left + DW} y2={toSvgY(y)}
            stroke={y % 400 === 0 ? C.gridMajor : C.grid}
            strokeWidth={y % 400 === 0 ? "0.8" : "0.4"}
          />
        ))}

        {/* Y軸ラベル */}
        {yLines
          .filter((y) => y % 400 === 0 && y > 0)
          .map((y) => (
            <text key={`yl-${y}`} x={M.left - 5} y={toSvgY(y) + 3} textAnchor="end" fontSize="8" fill="#bbb">
              {y}
            </text>
          ))}

        {/* 天井・床 */}
        <line x1={M.left - 10} y1={M.top} x2={M.left + DW + 10} y2={M.top} stroke="#aaa" strokeWidth="2" strokeDasharray="8,4" />
        <text x={M.left - 15} y={M.top + 4} textAnchor="end" fontSize="9" fill="#999">天井</text>
        <line x1={M.left - 10} y1={M.top + DH} x2={M.left + DW + 10} y2={M.top + DH} stroke="#888" strokeWidth="2" />
        <text x={M.left - 15} y={M.top + DH + 4} textAnchor="end" fontSize="9" fill="#999">床</text>

        {/* 棚板 */}
        {design.shelves.map((shelf) => {
          const lp = pillarMap.get(shelf.leftPillarId);
          const rp = pillarMap.get(shelf.rightPillarId);
          if (!lp || !rp) return null;

          // ドラッグ中のビジュアル位置
          const shelfY = (dragTargetId === shelf.id && dragTargetType === "shelf" && dragVisualPos)
            ? dragVisualPos.y
            : shelf.y;

          const sx = toSvgX(Math.min(lp.x, rp.x));
          const ex = toSvgX(Math.max(lp.x, rp.x));
          const sy = toSvgY(shelfY);
          const board = SHELF_BOARDS.find((b) => b.id === shelf.material);
          const thPx = Math.max((board?.thicknessMm ?? 18) * (DH / design.ceilingHeight), 4);
          return (
            <ShelfSvg
              key={shelf.id}
              shelf={shelf}
              sx={sx} ex={ex} sy={sy} thPx={thPx}
              isSel={selectedId === shelf.id}
              isHov={hoveredId === shelf.id && selectedId !== shelf.id}
              isDragging={isDragging}
              mode={mode}
              onMouseDown={onElementMouseDown}
              onClick={onElementClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          );
        })}

        {/* 装飾品アイコン */}
        {design.accessories.map((acc) => {
          const product = ACCESSORY_MAP.get(acc.productId);
          const shelf = design.shelves.find((s) => s.id === acc.shelfId);
          if (!product || !shelf) return null;
          const lp = pillarMap.get(shelf.leftPillarId);
          const rp = pillarMap.get(shelf.rightPillarId);
          if (!lp || !rp) return null;
          const shelfSx = toSvgX(Math.min(lp.x, rp.x));
          const accSvgX = shelfSx + (acc.offsetX / Math.abs(rp.x - lp.x)) * (toSvgX(Math.max(lp.x, rp.x)) - shelfSx);
          const board = SHELF_BOARDS.find((b) => b.id === shelf.material);
          const thPx = Math.max((board?.thicknessMm ?? 18) * (DH / design.ceilingHeight), 4);
          const accSvgY = acc.placement === "above"
            ? toSvgY(shelf.y) - thPx / 2 - 14
            : toSvgY(shelf.y) + thPx / 2 + 4;
          const isAccSel = selectedId === acc.id;
          return (
            <g
              key={acc.id}
              onClick={(e) => { e.stopPropagation(); onSetHoveredId(null); onElementClick(acc.id, e); }}
              style={{ cursor: "pointer" }}
            >
              {isAccSel && (
                <rect
                  x={accSvgX - 10} y={accSvgY - 2} width={20} height={16}
                  fill="none" stroke={C.selected} strokeWidth="2" rx="3" opacity="0.5"
                />
              )}
              <text x={accSvgX} y={accSvgY + 10} textAnchor="middle" fontSize="12" style={{ userSelect: "none" }}>
                {product.icon}
              </text>
            </g>
          );
        })}

        {/* 柱 */}
        {design.pillars.map((pillar) => {
          // ドラッグ中のビジュアル位置
          const pillarX = (dragTargetId === pillar.id && dragTargetType === "pillar" && dragVisualPos)
            ? dragVisualPos.x
            : pillar.x;
          const px = toSvgX(pillarX) - PILLAR_PX / 2;
          return (
            <PillarSvg
              key={pillar.id}
              pillar={pillar}
              px={px}
              isSel={selectedId === pillar.id}
              isHov={hoveredId === pillar.id && selectedId !== pillar.id}
              isDragging={isDragging}
              mode={mode}
              onMouseDown={onElementMouseDown}
              onClick={onElementClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              toSvgX={(mm) => toSvgX(
                (dragTargetId === pillar.id && dragTargetType === "pillar" && dragVisualPos)
                  ? dragVisualPos.x : mm
              )}
            />
          );
        })}

        {/* ゴースト: 柱 */}
        {ghostPillarX !== null && (
          <rect
            x={toSvgX(ghostPillarX) - PILLAR_PX / 2} y={M.top}
            width={PILLAR_PX} height={DH}
            fill={C.ghost} stroke={C.pillarStroke} strokeWidth="1" strokeDasharray="4,4" rx="2"
            pointerEvents="none"
          />
        )}

        {/* ゴースト: 棚板 */}
        {ghostShelfPair && hoverMm && (
          <rect
            x={toSvgX(ghostShelfPair.left.x)}
            y={toSvgY(hoverMm.y) - 3}
            width={toSvgX(ghostShelfPair.right.x) - toSvgX(ghostShelfPair.left.x)}
            height={6}
            fill={C.ghostShelf} stroke={C.shelfStroke} strokeWidth="1" strokeDasharray="4,4" rx="1"
            pointerEvents="none"
          />
        )}

        {/* 空状態の案内 */}
        {design.pillars.length === 0 && (
          <text x={SVG_W / 2} y={SVG_H / 2} textAnchor="middle" fontSize="13" fill="#aaa">
            「柱を追加」ボタンを押し、キャンバスをクリックして柱を配置
          </text>
        )}
      </svg>
    </div>
  );
}
