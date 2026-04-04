"use client";

import type { GridShelf, GridPillar } from "@/types";
import { SHELF_BOARDS, BRACKET_MAP, BRACKETS } from "@/data/products";

interface ShelfEditModalProps {
  shelf: GridShelf;
  pMap: Map<string, GridPillar>;
  onUpdate: (u: Partial<GridShelf>) => void;
  onDelete: () => void;
  onOpenBracketModal: () => void;
  onOpenAccessoryModal: (placement: "above" | "below") => void;
  currentBracketId: string;
}

export default function ShelfEditModal({
  shelf, pMap, onUpdate, onDelete,
  onOpenBracketModal, onOpenAccessoryModal, currentBracketId,
}: ShelfEditModalProps) {
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

      {/* 棚受け金具 */}
      <div>
        <label className="text-xs text-gray-500 mb-1 block">棚受け金具</label>
        <button
          onClick={onOpenBracketModal}
          className="w-full text-left px-3 py-2 border border-gray-300 rounded-lg text-sm hover:border-amber-400 hover:bg-amber-50 transition-all flex items-center justify-between"
        >
          <span>{(BRACKET_MAP.get(currentBracketId) ?? BRACKETS[0]).icon} {(BRACKET_MAP.get(currentBracketId) ?? BRACKETS[0]).name}</span>
          <span className="text-gray-400 text-xs">変更</span>
        </button>
      </div>

      {/* 装飾品追加 */}
      <div>
        <label className="text-xs text-gray-500 mb-1 block">装飾品</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onOpenAccessoryModal("above")}
            className="px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-amber-300 hover:bg-amber-50 transition-all"
          >
            ⬆ 棚板の上に追加
          </button>
          <button
            onClick={() => onOpenAccessoryModal("below")}
            className="px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-amber-300 hover:bg-amber-50 transition-all"
          >
            ⬇ 棚板の下に追加
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100 text-xs text-gray-400">
        {board.name} / {width}x{board.fixedDepthMm || shelf.depth}x{board.thicknessMm}mm
      </div>
    </div>
  );
}
