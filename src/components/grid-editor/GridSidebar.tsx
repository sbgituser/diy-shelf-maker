"use client";

import type { GridDesign, GridPillar, GridShelf } from "@/types";
import type { AccessoryProduct, BracketType } from "@/types";
import { ACCESSORY_MAP } from "@/data/products";
import PillarEditModal from "./PillarEditModal";
import ShelfEditModal from "./ShelfEditModal";

interface SelectedElement {
  type: "pillar" | "shelf";
  data: GridPillar | GridShelf;
}

interface GridSidebarProps {
  design: GridDesign;
  selectedId: string | null;
  selectedElement: SelectedElement | null;
  pillarMap: Map<string, GridPillar>;
  result: { partsList: { category: string }[]; totalEstimate: number };
  onUpdatePillar: (id: string, u: Partial<GridPillar>) => void;
  onUpdateShelf: (id: string, u: Partial<GridShelf>) => void;
  onDeleteSelected: () => void;
  onDeleteAccessory: (accId: string) => void;
  onSetDesign: (updater: (prev: GridDesign) => GridDesign) => void;
  onSetSelectedId: (id: string) => void;
  onOpenBracketModal: (shelfId: string) => void;
  onOpenAccessoryModal: (shelfId: string, placement: "above" | "below") => void;
}

export default function GridSidebar({
  design, selectedId, selectedElement, pillarMap, result,
  onUpdatePillar, onUpdateShelf, onDeleteSelected,
  onDeleteAccessory, onSetDesign, onSetSelectedId,
  onOpenBracketModal, onOpenAccessoryModal,
}: GridSidebarProps) {
  return (
    <div className="space-y-4">
      {selectedElement?.type === "pillar" && (
        <PillarEditModal
          pillar={selectedElement.data as GridPillar}
          ceilingH={design.ceilingHeight}
          onUpdate={(u) => onUpdatePillar((selectedElement.data as GridPillar).id, u)}
          onDelete={onDeleteSelected}
        />
      )}
      {selectedElement?.type === "shelf" && (
        <ShelfEditModal
          shelf={selectedElement.data as GridShelf}
          pMap={pillarMap}
          onUpdate={(u) => onUpdateShelf((selectedElement.data as GridShelf).id, u)}
          onDelete={onDeleteSelected}
          onOpenBracketModal={() => onOpenBracketModal((selectedElement.data as GridShelf).id)}
          onOpenAccessoryModal={(placement) => onOpenAccessoryModal((selectedElement.data as GridShelf).id, placement)}
          currentBracketId={(selectedElement.data as GridShelf).bracketId ?? design.defaultBracketId}
        />
      )}
      {(() => {
        const selAcc = design.accessories.find((a) => a.id === selectedId);
        if (!selAcc) return null;
        const product = ACCESSORY_MAP.get(selAcc.productId);
        if (!product) return null;
        return (
          <div className="bg-white rounded-xl border-2 border-amber-300 p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                <span className="text-lg">{product.icon}</span>
                装飾品の設定
              </h3>
              <button
                onClick={() => onDeleteAccessory(selAcc.id)}
                className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                削除
              </button>
            </div>
            <div>
              <p className="text-sm font-medium">{product.name}</p>
              <p className="text-xs text-gray-500">{product.description}</p>
              <p className="text-xs font-medium text-amber-600 mt-1">¥{product.priceYen.toLocaleString()}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">配置</label>
              <select
                value={selAcc.placement}
                onChange={(e) => {
                  const placement = e.target.value as "above" | "below";
                  onSetDesign((prev) => ({
                    ...prev,
                    accessories: prev.accessories.map((a) =>
                      a.id === selAcc.id ? { ...a, placement } : a,
                    ),
                  }));
                }}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
              >
                <option value="above">棚板の上</option>
                <option value="below">棚板の下</option>
              </select>
            </div>
          </div>
        );
      })()}
      {!selectedElement && !design.accessories.find((a) => a.id === selectedId) && (
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
  );
}
