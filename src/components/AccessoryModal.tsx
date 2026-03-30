"use client";

import { useState, useMemo, useEffect } from "react";
import type { AccessoryProduct, AccessoryCategory } from "@/types";
import { ACCESSORIES } from "@/data/products";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (product: AccessoryProduct) => void;
}

const CATEGORY_LABELS: Record<AccessoryCategory, { label: string; icon: string }> = {
  divider: { label: "仕切り", icon: "📚" },
  hook: { label: "フック・掛け", icon: "🪝" },
  holder: { label: "ホルダー・収納", icon: "🧺" },
  tray: { label: "トレー", icon: "🗃️" },
  lighting: { label: "照明", icon: "💡" },
  other: { label: "その他", icon: "🔧" },
};

export default function AccessoryModal({ open, onClose, onSelect }: Props) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<AccessoryCategory | "all">("all");

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const filtered = useMemo(() => {
    let items = ACCESSORIES;
    if (categoryFilter !== "all") {
      items = items.filter((a) => a.category === categoryFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return items;
  }, [search, categoryFilter]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">装飾品を追加</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pt-4 pb-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="キーワードで検索..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
            autoFocus
          />
        </div>

        {/* Category filter */}
        <div className="px-5 pb-3 flex gap-1.5 flex-wrap">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              categoryFilter === "all"
                ? "bg-amber-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            すべて
          </button>
          {(Object.entries(CATEGORY_LABELS) as [AccessoryCategory, { label: string; icon: string }][]).map(
            ([cat, { label, icon }]) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  categoryFilter === cat
                    ? "bg-amber-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {icon} {label}
              </button>
            ),
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              該当する装飾品がありません
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800 text-sm group-hover:text-amber-700">
                          {item.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {CATEGORY_LABELS[item.category].label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      <p className="text-xs font-medium text-amber-600 mt-1">
                        ¥{item.priceYen.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-gray-300 group-hover:text-amber-400 text-lg flex-shrink-0">
                      +
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
