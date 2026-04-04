"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type {
  GridDesign,
  GridPillar,
  GridShelf,
  AdjusterBrand,
  DesignInput,
} from "@/types";
import type { AccessoryProduct, BracketType } from "@/types";
import { ADJUSTERS, LUMBER_SPECS, SHELF_BOARDS, ACCESSORY_MAP, BRACKET_MAP, BRACKETS } from "@/data/products";
import AccessoryModal from "../AccessoryModal";
import BracketModal from "../BracketModal";
import { SHELF_TEMPLATES } from "@/data/templates";
import { calculateGridParts } from "@/lib/grid-calculator";
import { exportDesignPdf } from "@/lib/pdf-export";
import PartsListTable from "../PartsListTable";
import RecommendedTools from "../RecommendedTools";
import ShareButtons from "../ShareButtons";

import { SNAP, SVG_W, SVG_H, M, DW, DH, DRAG_THRESHOLD } from "@/constants/grid";
import type { Mode } from "@/constants/grid";

import GridCanvas from "./GridCanvas";
import GridToolbar from "./GridToolbar";
import GridSidebar from "./GridSidebar";

// ── 初期デザイン ──
const INITIAL: GridDesign = {
  ceilingHeight: 2400,
  pillars: [
    { id: "p-1", x: 200, lumber: "2x4", adjuster: "labrico" },
    { id: "p-2", x: 800, lumber: "2x4", adjuster: "labrico" },
  ],
  shelves: [
    { id: "s-1", leftPillarId: "p-1", rightPillarId: "p-2", y: 400, material: "2x4-shelf", depth: 250 },
    { id: "s-2", leftPillarId: "p-1", rightPillarId: "p-2", y: 900, material: "2x4-shelf", depth: 250 },
    { id: "s-3", leftPillarId: "p-1", rightPillarId: "p-2", y: 1400, material: "2x4-shelf", depth: 250 },
  ],
  accessories: [],
  defaultBracketId: "shelf-support",
};

/** テンプレートのdefaultsからGridDesignを生成 */
function templateToGridDesign(defaults: Partial<DesignInput>): GridDesign {
  const ceilingHeight = defaults.fullHeight !== false ? 2400 : (defaults.unitHeight ?? 1800);
  const adjuster = (defaults.adjuster ?? "labrico") as AdjusterBrand;
  const lumber = defaults.pillarLumber ?? "2x4";
  const pillarCount = defaults.pillarCount ?? 2;
  const shelfCount = defaults.shelfCount ?? 3;
  const shelfWidth = defaults.shelfWidth ?? 500;
  const shelfDepth = defaults.shelfDepth ?? 250;
  const shelfMaterial = defaults.shelfMaterial ?? "2x4-shelf";

  const pillars: GridPillar[] = [];
  for (let i = 0; i < pillarCount; i++) {
    pillars.push({
      id: `p-${i + 1}`,
      x: 200 + i * shelfWidth,
      lumber,
      adjuster,
    });
  }

  const shelves: GridShelf[] = [];
  const minY = Math.round(ceilingHeight * 0.1);
  const maxY = Math.round(ceilingHeight * 0.85);
  const spacing = shelfCount > 1 ? (maxY - minY) / (shelfCount - 1) : 0;

  let shelfIdx = 1;
  for (let pi = 0; pi < pillarCount - 1; pi++) {
    for (let si = 0; si < shelfCount; si++) {
      const y = shelfCount === 1
        ? Math.round(ceilingHeight * 0.5)
        : Math.round(minY + spacing * si);
      const snappedY = Math.round(y / SNAP) * SNAP;
      shelves.push({
        id: `s-${shelfIdx}`,
        leftPillarId: pillars[pi].id,
        rightPillarId: pillars[pi + 1].id,
        y: snappedY,
        material: shelfMaterial,
        depth: shelfDepth,
      });
      shelfIdx++;
    }
  }

  return { ceilingHeight, pillars, shelves, accessories: [], defaultBracketId: "shelf-support" };
}

// ════════════════════════════════════════════════════
// メインコンポーネント
// ════════════════════════════════════════════════════
export default function GridEditor() {
  const searchParams = useSearchParams();
  const [design, setDesign] = useState<GridDesign>(INITIAL);
  const [mode, setMode] = useState<Mode>("select");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoverMm, setHoverMm] = useState<{ x: number; y: number } | null>(null);
  const [pdfExporting, setPdfExporting] = useState(false);
  const [templateName, setTemplateName] = useState<string | null>(null);
  const [accessoryModalOpen, setAccessoryModalOpen] = useState(false);
  const [accessoryTargetShelf, setAccessoryTargetShelf] = useState<{ shelfId: string; placement: "above" | "below" } | null>(null);
  const [bracketModalOpen, setBracketModalOpen] = useState(false);
  const [bracketTargetShelfId, setBracketTargetShelfId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nextId = useRef(10);
  const templateApplied = useRef(false);

  // ── パフォーマンス最適化: ドラッグ中のビジュアル位置をRefで管理 ──
  const [dragVisualPos, setDragVisualPos] = useState<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rafIdRef = useRef<number>(0);

  // テンプレートのクエリパラメータを読み取り
  useEffect(() => {
    if (templateApplied.current) return;
    const templateId = searchParams.get("template");
    if (templateId) {
      const template = SHELF_TEMPLATES.find((t) => t.id === templateId);
      if (template) {
        const gridDesign = templateToGridDesign(template.defaults);
        setDesign(gridDesign);
        setSelectedId(null);
        setTemplateName(template.name);
        nextId.current = gridDesign.pillars.length + gridDesign.shelves.length + 10;
        templateApplied.current = true;
      }
    }
  }, [searchParams]);

  // rAF クリーンアップ
  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // ── ドラッグ状態 ──
  const dragRef = useRef<{
    id: string;
    type: "pillar" | "shelf";
    startSvgX: number;
    startSvgY: number;
    active: boolean;
  } | null>(null);

  // ── 座標系 ──
  const maxX = useMemo(
    () => Math.max(1500, ...design.pillars.map((p) => p.x)) + 300,
    [design.pillars],
  );

  const toSvgX = useCallback((mm: number) => M.left + (mm / maxX) * DW, [maxX]);
  const toSvgY = useCallback(
    (mm: number) => M.top + DH - (mm / design.ceilingHeight) * DH,
    [design.ceilingHeight],
  );

  const fromSvg = useCallback(
    (cx: number, cy: number) => {
      if (!svgRef.current) return { x: 0, y: 0 };
      const r = svgRef.current.getBoundingClientRect();
      const sx = ((cx - r.left) / r.width) * SVG_W;
      const sy = ((cy - r.top) / r.height) * SVG_H;
      const mmX = Math.round(((sx - M.left) / DW) * maxX / SNAP) * SNAP;
      const mmY = Math.round(((M.top + DH - sy) / DH) * design.ceilingHeight / SNAP) * SNAP;
      return {
        x: Math.max(50, mmX),
        y: Math.max(100, Math.min(mmY, design.ceilingHeight - 100)),
      };
    },
    [maxX, design.ceilingHeight],
  );

  const toSvgCoord = useCallback(
    (cx: number, cy: number) => {
      if (!svgRef.current) return { sx: 0, sy: 0 };
      const r = svgRef.current.getBoundingClientRect();
      return {
        sx: ((cx - r.left) / r.width) * SVG_W,
        sy: ((cy - r.top) / r.height) * SVG_H,
      };
    },
    [],
  );

  // ── 派生データ (useMemoでキャッシュ) ──
  const sortedPillars = useMemo(
    () => [...design.pillars].sort((a, b) => a.x - b.x),
    [design.pillars],
  );
  const pillarMap = useMemo(
    () => new Map(design.pillars.map((p) => [p.id, p])),
    [design.pillars],
  );
  const result = useMemo(() => calculateGridParts(design), [design]);

  const selectedElement = useMemo(() => {
    if (!selectedId) return null;
    const p = design.pillars.find((v) => v.id === selectedId);
    if (p) return { type: "pillar" as const, data: p };
    const s = design.shelves.find((v) => v.id === selectedId);
    if (s) return { type: "shelf" as const, data: s };
    return null;
  }, [selectedId, design]);

  // ── 隣接柱を探す ──
  const findAdjacentPillars = useCallback(
    (x: number) => {
      for (let i = 0; i < sortedPillars.length - 1; i++) {
        if (x >= sortedPillars[i].x && x <= sortedPillars[i + 1].x) {
          return { left: sortedPillars[i], right: sortedPillars[i + 1] };
        }
      }
      return null;
    },
    [sortedPillars],
  );

  // ── アクション ──
  const addPillar = useCallback(
    (x: number) => {
      if (design.pillars.some((p) => Math.abs(p.x - x) < 100)) return;
      const id = `p-${nextId.current++}`;
      setDesign((prev) => ({
        ...prev,
        pillars: [...prev.pillars, { id, x, lumber: "2x4", adjuster: "labrico" }],
      }));
      setSelectedId(id);
      setMode("select");
    },
    [design.pillars],
  );

  const addShelf = useCallback(
    (x: number, y: number) => {
      const pair = findAdjacentPillars(x);
      if (!pair) return;
      const id = `s-${nextId.current++}`;
      setDesign((prev) => ({
        ...prev,
        shelves: [
          ...prev.shelves,
          { id, leftPillarId: pair.left.id, rightPillarId: pair.right.id, y, material: "2x4-shelf", depth: 250 },
        ],
      }));
      setSelectedId(id);
    },
    [findAdjacentPillars],
  );

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    setDesign((prev) => {
      if (prev.pillars.some((p) => p.id === selectedId)) {
        return {
          ...prev,
          pillars: prev.pillars.filter((p) => p.id !== selectedId),
          shelves: prev.shelves.filter(
            (s) => s.leftPillarId !== selectedId && s.rightPillarId !== selectedId,
          ),
        };
      }
      return { ...prev, shelves: prev.shelves.filter((s) => s.id !== selectedId) };
    });
    setSelectedId(null);
  }, [selectedId]);

  const updatePillar = useCallback((id: string, u: Partial<GridPillar>) => {
    setDesign((prev) => ({
      ...prev,
      pillars: prev.pillars.map((p) => (p.id === id ? { ...p, ...u } : p)),
    }));
  }, []);

  const updateShelf = useCallback((id: string, u: Partial<GridShelf>) => {
    setDesign((prev) => ({
      ...prev,
      shelves: prev.shelves.map((s) => (s.id === id ? { ...s, ...u } : s)),
    }));
  }, []);

  const clearAll = useCallback(() => {
    setDesign((prev) => ({ ...prev, pillars: [], shelves: [] }));
    setSelectedId(null);
  }, []);

  const bulkChangeShelfMaterial = useCallback((materialId: string) => {
    setDesign((prev) => ({
      ...prev,
      shelves: prev.shelves.map((s) => ({ ...s, material: materialId })),
    }));
  }, []);

  const addAccessory = useCallback((product: AccessoryProduct) => {
    if (!accessoryTargetShelf) return;
    const id = `a-${nextId.current++}`;
    setDesign((prev) => ({
      ...prev,
      accessories: [
        ...prev.accessories,
        {
          id,
          productId: product.id,
          shelfId: accessoryTargetShelf.shelfId,
          placement: accessoryTargetShelf.placement,
          offsetX: 100,
        },
      ],
    }));
    setAccessoryTargetShelf(null);
  }, [accessoryTargetShelf]);

  const deleteAccessory = useCallback((accId: string) => {
    setDesign((prev) => ({
      ...prev,
      accessories: prev.accessories.filter((a) => a.id !== accId),
    }));
  }, []);

  const changeBracket = useCallback((bracket: BracketType) => {
    if (!bracketTargetShelfId) return;
    setDesign((prev) => ({
      ...prev,
      shelves: prev.shelves.map((s) =>
        s.id === bracketTargetShelfId ? { ...s, bracketId: bracket.id } : s,
      ),
    }));
    setBracketTargetShelfId(null);
  }, [bracketTargetShelfId]);

  const bulkChangeBracket = useCallback((bracket: BracketType) => {
    setDesign((prev) => ({
      ...prev,
      defaultBracketId: bracket.id,
      shelves: prev.shelves.map((s) => ({ ...s, bracketId: bracket.id })),
    }));
  }, []);

  // ══════════════════════════════════════════
  // イベントハンドラ（ドラッグ: useRef+rAFパターン）
  // ══════════════════════════════════════════

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (isDraggingRef.current) return;
      const pos = fromSvg(e.clientX, e.clientY);
      if (mode === "addPillar") addPillar(pos.x);
      else if (mode === "addShelf") addShelf(pos.x, pos.y);
      else setSelectedId(null);
    },
    [mode, fromSvg, addPillar, addShelf],
  );

  const handleCanvasMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const dr = dragRef.current;
      if (dr) {
        if (!dr.active) {
          const { sx, sy } = toSvgCoord(e.clientX, e.clientY);
          const dist = Math.hypot(sx - dr.startSvgX, sy - dr.startSvgY);
          if (dist < DRAG_THRESHOLD) return;
          dr.active = true;
          isDraggingRef.current = true;
          setIsDragging(true);
        }

        // ドラッグ中: Refに位置を記録し、rAFでビジュアル更新のみ
        const pos = fromSvg(e.clientX, e.clientY);
        dragPosRef.current = pos;

        if (!rafIdRef.current) {
          rafIdRef.current = requestAnimationFrame(() => {
            rafIdRef.current = 0;
            setDragVisualPos({ ...dragPosRef.current });
          });
        }
        return;
      }

      // 通常のホバー処理
      if (mode === "select") {
        setHoverMm(null);
        return;
      }
      setHoverMm(fromSvg(e.clientX, e.clientY));
    },
    [mode, fromSvg, toSvgCoord],
  );

  const handleCanvasMouseUp = useCallback(() => {
    const dr = dragRef.current;
    if (dr) {
      if (dr.active) {
        // ドラッグ終了: 最終位置をdesign stateに反映
        const finalPos = dragPosRef.current;
        if (dr.type === "pillar") {
          setDesign((prev) => ({
            ...prev,
            pillars: prev.pillars.map((p) =>
              p.id === dr.id ? { ...p, x: finalPos.x } : p,
            ),
          }));
        } else {
          setDesign((prev) => ({
            ...prev,
            shelves: prev.shelves.map((s) =>
              s.id === dr.id ? { ...s, y: finalPos.y } : s,
            ),
          }));
        }
        dragRef.current = null;
        setDragVisualPos(null);
        isDraggingRef.current = false;
        setTimeout(() => setIsDragging(false), 60);
      } else {
        dragRef.current = null;
      }
    }
  }, []);

  const handleElementMouseDown = useCallback(
    (id: string, type: "pillar" | "shelf", e: React.MouseEvent) => {
      if (mode !== "select") return;
      e.stopPropagation();
      e.preventDefault();
      setSelectedId(id);
      const { sx, sy } = toSvgCoord(e.clientX, e.clientY);
      dragRef.current = { id, type, startSvgX: sx, startSvgY: sy, active: false };
    },
    [mode, toSvgCoord],
  );

  const handleElementClick = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (isDraggingRef.current) return;
      if (mode === "select") setSelectedId((prev) => (prev === id ? null : id));
    },
    [mode],
  );

  const handleCanvasLeave = useCallback(() => {
    setHoverMm(null);
    setHoveredId(null);
    handleCanvasMouseUp();
  }, [handleCanvasMouseUp]);

  // ── ゴーストプレビュー ──
  const ghostPillarX = mode === "addPillar" && hoverMm ? hoverMm.x : null;
  const ghostShelfPair = mode === "addShelf" && hoverMm ? findAdjacentPillars(hoverMm.x) : null;

  // ── ドラッグ中のターゲット情報 ──
  const dragTargetId = dragRef.current?.id ?? null;
  const dragTargetType = dragRef.current?.type ?? null;

  return (
    <div className="max-w-5xl mx-auto">
      <GridToolbar
        design={design}
        mode={mode}
        selectedId={selectedId}
        templateName={templateName}
        onSetMode={setMode}
        onDeleteSelected={deleteSelected}
        onClearAll={clearAll}
        onSetCeilingHeight={(h) => setDesign((prev) => ({ ...prev, ceilingHeight: h }))}
        onBulkChangeShelfMaterial={bulkChangeShelfMaterial}
        onSetHoverMm={() => setHoverMm(null)}
        onDismissTemplate={() => setTemplateName(null)}
      />

      {/* メインエリア: キャンバス + プロパティ */}
      <div className="grid lg:grid-cols-3 gap-4">
        <GridCanvas
          design={design}
          svgRef={svgRef}
          mode={mode}
          selectedId={selectedId}
          hoveredId={hoveredId}
          isDragging={isDragging}
          hoverMm={hoverMm}
          dragVisualPos={dragVisualPos}
          dragTargetId={dragTargetId}
          dragTargetType={dragTargetType}
          toSvgX={toSvgX}
          toSvgY={toSvgY}
          maxX={maxX}
          pillarMap={pillarMap}
          ghostPillarX={ghostPillarX}
          ghostShelfPair={ghostShelfPair}
          onCanvasClick={handleCanvasClick}
          onCanvasMove={handleCanvasMove}
          onCanvasMouseUp={handleCanvasMouseUp}
          onCanvasLeave={handleCanvasLeave}
          onElementMouseDown={handleElementMouseDown}
          onElementClick={handleElementClick}
          onSetHoveredId={setHoveredId}
        />

        <GridSidebar
          design={design}
          selectedId={selectedId}
          selectedElement={selectedElement}
          pillarMap={pillarMap}
          result={result}
          onUpdatePillar={updatePillar}
          onUpdateShelf={updateShelf}
          onDeleteSelected={deleteSelected}
          onDeleteAccessory={deleteAccessory}
          onSetDesign={(updater) => setDesign(updater)}
          onSetSelectedId={setSelectedId}
          onOpenBracketModal={(shelfId) => {
            setBracketTargetShelfId(shelfId);
            setBracketModalOpen(true);
          }}
          onOpenAccessoryModal={(shelfId, placement) => {
            setAccessoryTargetShelf({ shelfId, placement });
            setAccessoryModalOpen(true);
          }}
        />
      </div>

      {/* 部材リスト */}
      {result.partsList.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">必要な部材リスト</h2>
          <PartsListTable parts={result.partsList} total={result.totalEstimate} />
        </section>
      )}

      {/* おすすめ工具 */}
      {result.partsList.length > 0 && <RecommendedTools />}

      {/* PDF出力 & SNS共有 */}
      {design.pillars.length > 0 && (
        <section className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2">設計図をPDFで保存</h3>
              <button
                onClick={async () => {
                  setPdfExporting(true);
                  try {
                    await exportDesignPdf(design);
                  } catch (err) {
                    console.error("PDF export failed:", err);
                  } finally {
                    setPdfExporting(false);
                  }
                }}
                disabled={pdfExporting}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-wait transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <polyline points="9 15 12 18 15 15" />
                </svg>
                {pdfExporting ? "PDF生成中..." : "PDFダウンロード"}
              </button>
              <p className="text-xs text-gray-400 mt-1.5">設計図・部材リスト・寸法をA4サイズで出力</p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2">設計をシェア</h3>
              <ShareButtons design={design} />
            </div>
          </div>
        </section>
      )}

      {/* Modals */}
      <AccessoryModal
        open={accessoryModalOpen}
        onClose={() => { setAccessoryModalOpen(false); setAccessoryTargetShelf(null); }}
        onSelect={addAccessory}
      />
      <BracketModal
        open={bracketModalOpen}
        onClose={() => { setBracketModalOpen(false); setBracketTargetShelfId(null); }}
        onSelect={changeBracket}
        onBulkApply={bulkChangeBracket}
        currentBracketId={bracketTargetShelfId ? (design.shelves.find((s) => s.id === bracketTargetShelfId)?.bracketId ?? design.defaultBracketId) : design.defaultBracketId}
      />
    </div>
  );
}
