"use client";

import { useState, useEffect, useCallback } from "react";

interface Props {
  total: number;
  partsCount: number;
  pillarsCount: number;
  shelvesCount: number;
  onViewParts: () => void;
  onExportPdf: () => void;
}

const STORAGE_KEY = "diy-shelf-hide-completion-modal";

export default function CompletionModal({
  total,
  partsCount,
  pillarsCount,
  shelvesCount,
  onViewParts,
  onExportPdf,
}: Props) {
  const [open, setOpen] = useState(false);
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  // 設計完了条件: 柱2本以上 + 棚板1枚以上
  const isDesignComplete = pillarsCount >= 2 && shelvesCount >= 1;

  useEffect(() => {
    if (!isDesignComplete || hasShown) return;

    try {
      if (localStorage.getItem(STORAGE_KEY) === "true") return;
    } catch {
      // localStorage unavailable
    }

    setOpen(true);
    setHasShown(true);
  }, [isDesignComplete, hasShown]);

  const close = useCallback(() => {
    setOpen(false);
    if (doNotShowAgain) {
      try {
        localStorage.setItem(STORAGE_KEY, "true");
      } catch {
        // localStorage unavailable
      }
    }
  }, [doNotShowAgain]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={close}
    >
      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-black/40" />

      {/* モーダル */}
      <div
        className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="閉じる"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <p className="text-4xl mb-3">🎉</p>
          <h2 className="text-xl font-bold text-gray-800 mb-4">設計完了！</h2>

          <div className="flex justify-center gap-6 mb-5 text-sm text-gray-700">
            <div>
              <div className="text-2xl font-bold text-amber-600 font-mono">
                ¥{total.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">概算費用</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">
                {partsCount}点
              </div>
              <div className="text-xs text-gray-500 mt-0.5">必要な部材</div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => { close(); onViewParts(); }}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors"
            >
              📋 部材リストを確認 →
            </button>
            <button
              type="button"
              onClick={() => { close(); onExportPdf(); }}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              📄 PDFで保存
            </button>
          </div>

          <label className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500 cursor-pointer">
            <input
              type="checkbox"
              checked={doNotShowAgain}
              onChange={(e) => setDoNotShowAgain(e.target.checked)}
              className="rounded border-gray-300"
            />
            今後表示しない
          </label>
        </div>
      </div>
    </div>
  );
}
