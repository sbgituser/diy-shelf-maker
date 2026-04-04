"use client";

import type { GridDesign } from "@/types";
import { SHELF_BOARDS } from "@/data/products";
import type { Mode } from "@/constants/grid";

interface GridToolbarProps {
  design: GridDesign;
  mode: Mode;
  selectedId: string | null;
  templateName: string | null;
  onSetMode: (mode: Mode) => void;
  onDeleteSelected: () => void;
  onClearAll: () => void;
  onSetCeilingHeight: (h: number) => void;
  onBulkChangeShelfMaterial: (materialId: string) => void;
  onSetHoverMm: (mm: null) => void;
  onDismissTemplate: () => void;
}

export default function GridToolbar({
  design, mode, selectedId, templateName,
  onSetMode, onDeleteSelected, onClearAll,
  onSetCeilingHeight, onBulkChangeShelfMaterial,
  onSetHoverMm, onDismissTemplate,
}: GridToolbarProps) {
  return (
    <>
      {/* テンプレート適用通知 */}
      {templateName && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
          <p className="text-sm text-amber-800">
            <span className="font-bold">✓ テンプレート「{templateName}」</span>を適用しました。天井高や棚数は自由に変更できます。
          </p>
          <button
            onClick={onDismissTemplate}
            className="text-amber-600 hover:text-amber-800 text-sm ml-3 flex-shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* ツールバー */}
      <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex gap-1.5">
          {([
            { m: "select" as Mode, icon: "👆", label: "選択" },
            { m: "addPillar" as Mode, icon: "🪵", label: "柱を追加" },
            { m: "addShelf" as Mode, icon: "📏", label: "棚板を追加" },
          ] as const).map((btn) => (
            <button
              key={btn.m}
              onClick={() => { onSetMode(btn.m); onSetHoverMm(null); }}
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
          onClick={onDeleteSelected}
          disabled={!selectedId}
          className="px-3 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          削除
        </button>
        <button
          onClick={onClearAll}
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
              onSetCeilingHeight(Math.max(1800, Math.min(3200, Number(e.target.value) || 2400)))
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
                  if (e.target.value) onBulkChangeShelfMaterial(e.target.value);
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

      {/* モードヒント */}
      {mode !== "select" && (
        <div className="mb-3 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
          {mode === "addPillar"
            ? "キャンバス上をクリックして柱を配置してください"
            : "2本の柱の間をクリックして棚板を配置してください"}
          <button
            onClick={() => { onSetMode("select"); onSetHoverMm(null); }}
            className="ml-3 text-xs underline text-amber-600 hover:text-amber-800"
          >
            キャンセル
          </button>
        </div>
      )}
    </>
  );
}
