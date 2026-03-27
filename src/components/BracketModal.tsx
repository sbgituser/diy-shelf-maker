"use client";

import type { BracketType } from "@/types";
import { BRACKETS } from "@/data/products";

interface Props {
  open: boolean;
  onClose: () => void;
  /** 個別の棚板に適用する場合のコールバック */
  onSelect: (bracket: BracketType) => void;
  /** 全棚板に一括適用するコールバック */
  onBulkApply: (bracket: BracketType) => void;
  /** 現在選択中の棚受けID */
  currentBracketId?: string;
}

export default function BracketModal({
  open,
  onClose,
  onSelect,
  onBulkApply,
  currentBracketId,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">棚受け金具を選択</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* List */}
        <div className="p-5 space-y-2">
          {BRACKETS.map((bracket) => {
            const isActive = currentBracketId === bracket.id;
            return (
              <div
                key={bracket.id}
                className={`p-3 rounded-xl border transition-all ${
                  isActive
                    ? "border-amber-400 bg-amber-50"
                    : "border-gray-200 hover:border-amber-300 hover:bg-amber-50/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{bracket.icon ?? "🔩"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800 text-sm">
                        {bracket.name}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-medium bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">
                          選択中
                        </span>
                      )}
                    </div>
                    {bracket.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{bracket.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-medium text-amber-600">
                        ¥{bracket.pricePerPair.toLocaleString()}/組
                      </span>
                      <span className="text-xs text-gray-400">
                        耐荷重 {bracket.maxLoadKg}kg
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-3 ml-9">
                  <button
                    onClick={() => {
                      onSelect(bracket);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                  >
                    この棚板に適用
                  </button>
                  <button
                    onClick={() => {
                      onBulkApply(bracket);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    全棚板に一括適用
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
