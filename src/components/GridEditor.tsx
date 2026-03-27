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
import { ADJUSTERS, LUMBER_SPECS, SHELF_BOARDS } from "@/data/products";
import { SHELF_TEMPLATES } from "@/data/templates";
import { calculateGridParts } from "@/lib/grid-calculator";
import { exportDesignPdf } from "@/lib/pdf-export";
import PartsListTable from "./PartsListTable";
import ShareButtons from "./ShareButtons";

// ── 定数 ──
type Mode = "select" | "addPillar" | "addShelf";

const SNAP = 50; // mm 単位のスナップ
const GRID_VISUAL = 200; // mm 描画グリッド
const PILLAR_PX = 16; // 柱の描画幅 (px)
const DRAG_THRESHOLD = 5; // ドラッグ開始までの最小移動量 (SVG px)

const SVG_W = 800;
const SVG_H = 520;
const M = { top: 30, bottom: 40, left: 55, right: 25 };
const DW = SVG_W - M.left - M.right;
const DH = SVG_H - M.top - M.bottom;

const C = {
  pillar: "#C4A46A",
  pillarStroke: "#8B6914",
  pillarHover: "#D4B47A",
  shelf: "#D4A76A",
  shelfStroke: "#9B7530",
  shelfHover: "#E4B77A",
  selected: "#F59E0B",
  selectedStroke: "#D97706",
  selectedGlow: "rgba(245,158,11,0.25)",
  adjuster: "#666",
  grid: "#eee",
  gridMajor: "#ddd",
  ghost: "rgba(196,164,106,0.35)",
  ghostShelf: "rgba(212,167,106,0.35)",
  bg: "#FAFAF7",
};

const INITIAL: GridDesign = {
  ceilingHeight: 2400,
  pillars: [
    { id: "p-1", x: 200, lumber: "2x4", adjuster: "labrico" },
    { id: "p-2", x: 800, lumber: "2x4", adjuster: "labrico" },
  ],
  shelves: [
    { id: "s-1", leftPillarId: "p-1", rightPillarId: "p-2", y: 400, material: "pine-18", depth: 250 },
    { id: "s-2", leftPillarId: "p-1", rightPillarId: "p-2", y: 900, material: "pine-18", depth: 250 },
    { id: "s-3", leftPillarId: "p-1", rightPillarId: "p-2", y: 1400, material: "pine-18", depth: 250 },
  ],
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
  const shelfMaterial = defaults.shelfMaterial ?? "pine-18";

  // 柱の配置: 最初の柱をx=200に、間隔をshelfWidthに基づいて配置
  const pillars: GridPillar[] = [];
  for (let i = 0; i < pillarCount; i++) {
    pillars.push({
      id: `p-${i + 1}`,
      x: 200 + i * shelfWidth,
      lumber,
      adjuster,
    });
  }

  // 棚板を等間隔に配置（天井高の10%〜85%の範囲）
  const shelves: GridShelf[] = [];
  const minY = Math.round(ceilingHeight * 0.1);
  const maxY = Math.round(ceilingHeight * 0.85);
  const spacing = shelfCount > 1 ? (maxY - minY) / (shelfCount - 1) : 0;

  let shelfIdx = 1;
  // 各スパン（隣接する柱ペア）に棚を配置
  for (let pi = 0; pi < pillarCount - 1; pi++) {
    for (let si = 0; si < shelfCount; si++) {
      const y = shelfCount === 1
        ? Math.round(ceilingHeight * 0.5)
        : Math.round(minY + spacing * si);
      // SNAPに合わせる
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

  return { ceilingHeight, pillars, shelves };
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
  const svgRef = useRef<SVGSVGElement>(null);
  const nextId = useRef(10);
  const templateApplied = useRef(false);

  // テンプレートのクエリパラメータを読み取り、初期状態に適用
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

  // ── ドラッグ状態 ──
  // mousedown位置を記録し、DRAG_THRESHOLD以上動いた場合にのみドラッグ開始
  const dragRef = useRef<{
    id: string;
    type: "pillar" | "shelf";
    startSvgX: number;
    startSvgY: number;
    active: boolean; // threshold超えた＝実際にドラッグ中
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  /** クライアント座標 → mm 座標 (SNAPあり) */
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

  /** クライアント座標 → SVG 座標 (スナップなし、ドラッグ閾値計算用) */
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

  // ── 派生データ ──
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
          { id, leftPillarId: pair.left.id, rightPillarId: pair.right.id, y, material: "pine-18", depth: 250 },
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

  /** 全棚板の素材を一括変更 */
  const bulkChangeShelfMaterial = useCallback((materialId: string) => {
    setDesign((prev) => ({
      ...prev,
      shelves: prev.shelves.map((s) => ({ ...s, material: materialId })),
    }));
  }, []);

  // ══════════════════════════════════════════
  // イベントハンドラ（ドラッグ閾値方式）
  // ══════════════════════════════════════════

  /** キャンバス空白クリック */
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (isDragging) return;
      const pos = fromSvg(e.clientX, e.clientY);
      if (mode === "addPillar") addPillar(pos.x);
      else if (mode === "addShelf") addShelf(pos.x, pos.y);
      else setSelectedId(null);
    },
    [mode, fromSvg, addPillar, addShelf, isDragging],
  );

  /** マウス移動 — ドラッグ閾値チェック + 移動処理 */
  const handleCanvasMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const dr = dragRef.current;
      if (dr) {
        if (!dr.active) {
          // threshold 未到達 — 距離チェック
          const { sx, sy } = toSvgCoord(e.clientX, e.clientY);
          const dist = Math.hypot(sx - dr.startSvgX, sy - dr.startSvgY);
          if (dist < DRAG_THRESHOLD) return; // まだクリック扱い
          dr.active = true;
          setIsDragging(true);
        }

        // ドラッグ中の移動
        const pos = fromSvg(e.clientX, e.clientY);
        if (dr.type === "pillar") {
          const id = dr.id;
          setDesign((prev) => ({
            ...prev,
            pillars: prev.pillars.map((p) =>
              p.id === id ? { ...p, x: pos.x } : p,
            ),
          }));
        } else {
          const id = dr.id;
          setDesign((prev) => ({
            ...prev,
            shelves: prev.shelves.map((s) =>
              s.id === id ? { ...s, y: pos.y } : s,
            ),
          }));
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

  /** マウスアップ — ドラッグ完了 or クリック判定 */
  const handleCanvasMouseUp = useCallback(() => {
    const dr = dragRef.current;
    if (dr) {
      if (dr.active) {
        // 実際にドラッグした→短い遅延でフラグリセット
        dragRef.current = null;
        setTimeout(() => setIsDragging(false), 60);
      } else {
        // threshold未到達＝クリックだった → 選択のみ（mousedownで既に選択済み）
        dragRef.current = null;
      }
    }
  }, []);

  /** 要素の mousedown — 選択 + ドラッグ準備 */
  const handleElementMouseDown = useCallback(
    (id: string, type: "pillar" | "shelf", e: React.MouseEvent) => {
      if (mode !== "select") return;
      e.stopPropagation();
      e.preventDefault();
      // 即座に選択
      setSelectedId(id);
      // ドラッグ準備（閾値超えるまでは開始しない）
      const { sx, sy } = toSvgCoord(e.clientX, e.clientY);
      dragRef.current = { id, type, startSvgX: sx, startSvgY: sy, active: false };
    },
    [mode, toSvgCoord],
  );

  /** 要素のクリック — 選択トグル（ドラッグ後は無視） */
  const handleElementClick = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (isDragging) return;
      if (mode === "select") setSelectedId((prev) => (prev === id ? null : id));
    },
    [mode, isDragging],
  );

  // ── ゴーストプレビュー ──
  const ghostPillarX = mode === "addPillar" && hoverMm ? hoverMm.x : null;
  const ghostShelfPair = mode === "addShelf" && hoverMm ? findAdjacentPillars(hoverMm.x) : null;

  // ── グリッド線 ──
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

  return (
    <div className="max-w-5xl mx-auto">
      {/* ─── テンプレート適用通知 ─── */}
      {templateName && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
          <p className="text-sm text-amber-800">
            <span className="font-bold">✓ テンプレート「{templateName}」</span>を適用しました。天井高や棚数は自由に変更できます。
          </p>
          <button
            onClick={() => setTemplateName(null)}
            className="text-amber-600 hover:text-amber-800 text-sm ml-3 flex-shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* ─── ツールバー ─── */}
      <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex gap-1.5">
          {([
            { m: "select" as Mode, icon: "👆", label: "選択" },
            { m: "addPillar" as Mode, icon: "🪵", label: "柱を追加" },
            { m: "addShelf" as Mode, icon: "📏", label: "棚板を追加" },
          ] as const).map((btn) => (
            <button
              key={btn.m}
              onClick={() => { setMode(btn.m); setHoverMm(null); }}
              disabled={btn.m === "addShelf" && design.pillars.length < 2}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === btn.m
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
              }`}
            >
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>

        <div className="h-8 w-px bg-gray-200" />

        <button
          onClick={deleteSelected}
          disabled={!selectedId}
          className="px-3 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          削除
        </button>
        <button
          onClick={clearAll}
          disabled={design.pillars.length === 0}
          className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          全クリア
        </button>

        <div className="h-8 w-px bg-gray-200" />

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 whitespace-nowrap">天井高</label>
          <input
            type="number"
            value={design.ceilingHeight}
            onChange={(e) =>
              setDesign((prev) => ({
                ...prev,
                ceilingHeight: Math.max(1800, Math.min(3200, Number(e.target.value) || 2400)),
              }))
            }
            min={1800}
            max={3200}
            step={10}
            className="w-20 px-2 py-1.5 border border-gray-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
          />
          <span className="text-xs text-gray-500">mm</span>
        </div>

        {/* 棚板素材の一括変更 */}
        {design.shelves.length > 0 && (
          <>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 whitespace-nowrap">棚板素材</label>
              <select
                onChange={(e) => {
                  if (e.target.value) bulkChangeShelfMaterial(e.target.value);
                  e.target.value = "";
                }}
                defaultValue=""
                className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
              >
                <option value="" disabled>一括変更...</option>
                {SHELF_BOARDS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.thicknessMm}mm)
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div className="ml-auto text-xs text-gray-400">
          柱 {design.pillars.length}本 / 棚板 {design.shelves.length}枚
        </div>
      </div>

      {/* ─── モードヒント ─── */}
      {mode !== "select" && (
        <div className="mb-3 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
          {mode === "addPillar"
            ? "キャンバス上をクリックして柱を配置してください"
            : "2本の柱の間をクリックして棚板を配置してください"}
          <button
            onClick={() => { setMode("select"); setHoverMm(null); }}
            className="ml-3 text-xs underline text-amber-600 hover:text-amber-800"
          >
            キャンセル
          </button>
        </div>
      )}

      {/* ─── メインエリア: キャンバス + プロパティ ─── */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* キャンバス */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-2">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full"
            style={{
              cursor: isDragging ? "grabbing" : mode === "select" ? "default" : "crosshair",
              fontFamily: "'Noto Sans JP', sans-serif",
            }}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={() => { setHoverMm(null); setHoveredId(null); handleCanvasMouseUp(); }}
          >
            {/* SVGフィルタ定義 — 選択グロー */}
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

            {/* グリッド（主線・副線） */}
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
              const sx = toSvgX(Math.min(lp.x, rp.x));
              const ex = toSvgX(Math.max(lp.x, rp.x));
              const sy = toSvgY(shelf.y);
              const isSel = selectedId === shelf.id;
              const isHov = hoveredId === shelf.id && !isSel;
              const board = SHELF_BOARDS.find((b) => b.id === shelf.material);
              const thPx = Math.max((board?.thicknessMm ?? 18) * (DH / design.ceilingHeight), 4);
              const hitH = Math.max(thPx, 16);
              return (
                <g
                  key={shelf.id}
                  onClick={(e) => handleElementClick(shelf.id, e)}
                  onMouseDown={(e) => handleElementMouseDown(shelf.id, "shelf", e)}
                  onMouseEnter={() => mode === "select" && setHoveredId(shelf.id)}
                  onMouseLeave={() => setHoveredId((prev) => prev === shelf.id ? null : prev)}
                  style={{ cursor: mode === "select" ? (isDragging ? "grabbing" : isSel ? "grab" : "pointer") : "default" }}
                >
                  {/* ヒットエリア */}
                  <rect
                    x={sx}
                    y={sy - hitH / 2}
                    width={ex - sx}
                    height={hitH}
                    fill="transparent"
                  />
                  {/* 選択グロー */}
                  {isSel && (
                    <rect
                      x={sx - 2}
                      y={sy - thPx / 2 - 2}
                      width={ex - sx + 4}
                      height={thPx + 4}
                      fill="none"
                      stroke={C.selected}
                      strokeWidth="3"
                      rx="3"
                      opacity="0.3"
                      filter="url(#glow-sel)"
                    />
                  )}
                  {/* 本体 */}
                  <rect
                    x={sx}
                    y={sy - thPx / 2}
                    width={ex - sx}
                    height={thPx}
                    fill={isSel ? C.selected : isHov ? C.shelfHover : C.shelf}
                    stroke={isSel ? C.selectedStroke : isHov ? C.shelfStroke : C.shelfStroke}
                    strokeWidth={isSel ? 2 : isHov ? 1.5 : 1}
                    rx="1"
                  />
                  {/* 高さラベル */}
                  <text x={ex + 5} y={sy + 3} fontSize="8" fill={isSel ? C.selectedStroke : "#999"}>
                    {shelf.y}mm
                  </text>
                </g>
              );
            })}

            {/* 柱 */}
            {design.pillars.map((pillar) => {
              const px = toSvgX(pillar.x) - PILLAR_PX / 2;
              const isSel = selectedId === pillar.id;
              const isHov = hoveredId === pillar.id && !isSel;
              return (
                <g
                  key={pillar.id}
                  onClick={(e) => handleElementClick(pillar.id, e)}
                  onMouseDown={(e) => handleElementMouseDown(pillar.id, "pillar", e)}
                  onMouseEnter={() => mode === "select" && setHoveredId(pillar.id)}
                  onMouseLeave={() => setHoveredId((prev) => prev === pillar.id ? null : prev)}
                  style={{ cursor: mode === "select" ? (isDragging ? "grabbing" : isSel ? "grab" : "pointer") : "default" }}
                >
                  {/* ヒットエリア */}
                  <rect
                    x={px - 8}
                    y={M.top}
                    width={PILLAR_PX + 16}
                    height={DH}
                    fill="transparent"
                  />
                  {/* 選択グロー */}
                  {isSel && (
                    <rect
                      x={px - 3}
                      y={M.top - 2}
                      width={PILLAR_PX + 6}
                      height={DH + 4}
                      fill="none"
                      stroke={C.selected}
                      strokeWidth="3"
                      rx="4"
                      opacity="0.3"
                      filter="url(#glow-sel)"
                    />
                  )}
                  {/* 本体 */}
                  <rect
                    x={px}
                    y={M.top + (pillar.adjuster ? 6 : 0)}
                    width={PILLAR_PX}
                    height={DH - (pillar.adjuster ? 12 : 0)}
                    fill={isSel ? C.selected : isHov ? C.pillarHover : C.pillar}
                    stroke={isSel ? C.selectedStroke : isHov ? C.pillarStroke : C.pillarStroke}
                    strokeWidth={isSel ? 2 : isHov ? 1.5 : 1}
                    rx="2"
                  />
                  {/* 木目風ライン */}
                  {!isSel && Array.from({ length: 5 }).map((_, j) => (
                    <line
                      key={j}
                      x1={px + 2}
                      y1={M.top + 30 + j * (DH / 6)}
                      x2={px + PILLAR_PX - 2}
                      y2={M.top + 35 + j * (DH / 6)}
                      stroke={C.pillarStroke}
                      strokeWidth="0.5"
                      opacity="0.25"
                    />
                  ))}
                  {/* アジャスター */}
                  {pillar.adjuster && (
                    <>
                      <rect x={px - 1} y={M.top} width={PILLAR_PX + 2} height={6} fill={C.adjuster} rx="1" />
                      <rect x={px - 1} y={M.top + DH - 6} width={PILLAR_PX + 2} height={6} fill={C.adjuster} rx="1" />
                    </>
                  )}
                  {/* ホバー時のハイライトリング */}
                  {isHov && (
                    <rect
                      x={px - 2}
                      y={M.top - 1}
                      width={PILLAR_PX + 4}
                      height={DH + 2}
                      fill="none"
                      stroke={C.pillarStroke}
                      strokeWidth="1"
                      strokeDasharray="4,3"
                      rx="3"
                      opacity="0.5"
                    />
                  )}
                  {/* X位置ラベル */}
                  <text x={toSvgX(pillar.x)} y={M.top + DH + 15} textAnchor="middle" fontSize="8" fill={isSel ? C.selectedStroke : "#777"}>
                    {pillar.x}mm
                  </text>
                </g>
              );
            })}

            {/* ゴースト: 柱 */}
            {ghostPillarX !== null && (
              <rect
                x={toSvgX(ghostPillarX) - PILLAR_PX / 2}
                y={M.top}
                width={PILLAR_PX}
                height={DH}
                fill={C.ghost}
                stroke={C.pillarStroke}
                strokeWidth="1"
                strokeDasharray="4,4"
                rx="2"
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
                fill={C.ghostShelf}
                stroke={C.shelfStroke}
                strokeWidth="1"
                strokeDasharray="4,4"
                rx="1"
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

        {/* ─── プロパティパネル ─── */}
        <div className="space-y-4">
          {selectedElement?.type === "pillar" && (
            <PillarProps
              pillar={selectedElement.data}
              ceilingH={design.ceilingHeight}
              onUpdate={(u) => updatePillar(selectedElement.data.id, u)}
              onDelete={deleteSelected}
            />
          )}
          {selectedElement?.type === "shelf" && (
            <ShelfProps
              shelf={selectedElement.data}
              pMap={pillarMap}
              onUpdate={(u) => updateShelf(selectedElement.data.id, u)}
              onDelete={deleteSelected}
            />
          )}
          {!selectedElement && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-sm text-gray-500">
              <p className="font-medium text-gray-700 mb-2">操作ガイド</p>
              <ul className="space-y-1.5 text-xs">
                <li><strong>柱を追加</strong> — キャンバスをクリックで柱を配置</li>
                <li><strong>棚板を追加</strong> — 柱の間をクリックで棚板を配置</li>
                <li><strong>選択</strong> — 要素をクリックして設定を変更</li>
                <li><strong>ドラッグ</strong> — 選択した柱(横)・棚板(縦)をドラッグで移動</li>
                <li><strong>削除</strong> — 柱を削除すると接続された棚板も削除</li>
              </ul>
            </div>
          )}

          {/* 概算費用 */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h3 className="font-bold text-amber-800 text-sm mb-2">概算費用</h3>
            <p className="text-2xl font-bold text-amber-700 font-mono">
              ¥{result.totalEstimate.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              柱 {design.pillars.length}本 / 棚板 {design.shelves.length}枚
            </p>
          </div>
        </div>
      </div>

      {/* ─── 部材リスト ─── */}
      {result.partsList.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">必要な部材リスト</h2>
          <PartsListTable parts={result.partsList} total={result.totalEstimate} />
        </section>
      )}

      {/* ─── PDF出力 & SNS共有 ─── */}
      {design.pillars.length > 0 && (
        <section className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* PDF出力 */}
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

            {/* SNS共有 */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2">設計をシェア</h3>
              <ShareButtons design={design} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════
// 柱プロパティパネル
// ════════════════════════════════════════════════════
function PillarProps({
  pillar,
  ceilingH,
  onUpdate,
  onDelete,
}: {
  pillar: GridPillar;
  ceilingH: number;
  onUpdate: (u: Partial<GridPillar>) => void;
  onDelete: () => void;
}) {
  const adj = pillar.adjuster
    ? (() => {
        if (pillar.lumber === "1x4") {
          return ADJUSTERS[`${pillar.adjuster}_1x4`] ?? ADJUSTERS[pillar.adjuster];
        }
        return ADJUSTERS[pillar.adjuster];
      })()
    : null;
  const cutLen = adj ? ceilingH - adj.cutOffset : ceilingH;
  const lumber = LUMBER_SPECS[pillar.lumber] ?? LUMBER_SPECS["2x4"];

  const adjOptions: { value: string; label: string }[] = [
    { value: "labrico", label: "ラブリコ (-95mm)" },
    { value: "diawall", label: "ディアウォール (-45mm)" },
    { value: "labrico_strong", label: "ラブリコ強力 (-120mm)" },
    { value: "wallist", label: "ウォリスト (-60mm)" },
    { value: "none", label: "アジャスターなし" },
  ].filter((o) => {
    if (o.value === "none") return true;
    const a = ADJUSTERS[o.value];
    return a?.supportedLumber.includes(pillar.lumber);
  });

  return (
    <div className="bg-white rounded-xl border-2 border-amber-300 p-4 space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-amber-400" />
          柱の設定
        </h3>
        <button onClick={onDelete} className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors">
          削除
        </button>
      </div>

      <div>
        <label className="text-xs text-gray-500">位置</label>
        <p className="text-sm font-mono font-medium">{pillar.x}mm</p>
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">木材</label>
        <div className="grid grid-cols-2 gap-1.5">
          {(["2x4", "1x4"] as const).map((l) => {
            const sp = LUMBER_SPECS[l];
            if (!sp) return null;
            return (
              <button
                key={l}
                onClick={() => {
                  const u: Partial<GridPillar> = { lumber: l };
                  if (l === "1x4" && (pillar.adjuster === "wallist" || pillar.adjuster === "labrico_strong")) {
                    u.adjuster = "labrico";
                  }
                  onUpdate(u);
                }}
                className={`p-2 rounded-lg border text-xs transition-all ${
                  pillar.lumber === l
                    ? "border-amber-500 bg-amber-50 ring-1 ring-amber-300"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="font-medium">{sp.name.split(" ")[0]}</div>
                <div className="text-gray-400">
                  {sp.widthMm}x{sp.depthMm}mm
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">アジャスター</label>
        <select
          value={pillar.adjuster ?? "none"}
          onChange={(e) =>
            onUpdate({
              adjuster: e.target.value === "none" ? null : (e.target.value as AdjusterBrand),
            })
          }
          className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
        >
          {adjOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-2 border-t border-gray-100">
        <label className="text-xs text-gray-500">カット寸法</label>
        <p className="text-lg font-bold text-amber-700 font-mono">{cutLen}mm</p>
        <p className="text-xs text-gray-400">
          {lumber.name} /{" "}
          {adj ? `${adj.name}: ${ceilingH}mm - ${adj.cutOffset}mm` : `高さ${ceilingH}mm`}
        </p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════
// 棚板プロパティパネル
// ════════════════════════════════════════════════════
function ShelfProps({
  shelf,
  pMap,
  onUpdate,
  onDelete,
}: {
  shelf: GridShelf;
  pMap: Map<string, GridPillar>;
  onUpdate: (u: Partial<GridShelf>) => void;
  onDelete: () => void;
}) {
  const lp = pMap.get(shelf.leftPillarId);
  const rp = pMap.get(shelf.rightPillarId);
  const width = lp && rp ? Math.abs(rp.x - lp.x) : 0;
  const board = SHELF_BOARDS.find((b) => b.id === shelf.material) ?? SHELF_BOARDS[0];

  return (
    <div className="bg-white rounded-xl border-2 border-amber-300 p-4 space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
          <span className="inline-block w-3 h-8 rounded-sm bg-amber-400" style={{ width: 20, height: 3 }} />
          棚板の設定
        </h3>
        <button onClick={onDelete} className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors">
          削除
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <label className="text-xs text-gray-500">幅 (自動計算)</label>
          <p className="font-mono font-medium">{width}mm</p>
        </div>
        <div>
          <label className="text-xs text-gray-500">床からの高さ</label>
          <input
            type="number"
            value={shelf.y}
            onChange={(e) => onUpdate({ y: Math.max(100, Number(e.target.value) || 400) })}
            min={100}
            step={50}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-mono focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">材質</label>
        <select
          value={shelf.material}
          onChange={(e) => onUpdate({ material: e.target.value })}
          className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
        >
          {SHELF_BOARDS.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} ({b.thicknessMm}mm厚 /
              {b.strength === "heavy" ? " 高強度" : b.strength === "medium" ? " 中強度" : " 軽量"})
            </option>
          ))}
        </select>
      </div>

      {board.fixedDepthMm === 0 && (
        <div>
          <label className="text-xs text-gray-500 mb-1 block">奥行 (mm)</label>
          <input
            type="number"
            value={shelf.depth}
            onChange={(e) => onUpdate({ depth: Math.max(50, Number(e.target.value) || 250) })}
            min={50}
            max={450}
            step={10}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
          />
        </div>
      )}

      <div className="pt-2 border-t border-gray-100 text-xs text-gray-400">
        {board.name} / {width}x{board.fixedDepthMm || shelf.depth}x{board.thicknessMm}mm
      </div>
    </div>
  );
}
