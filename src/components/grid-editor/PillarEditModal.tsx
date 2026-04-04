"use client";

import type { GridPillar, AdjusterBrand } from "@/types";
import { ADJUSTERS, LUMBER_SPECS } from "@/data/products";

interface PillarEditModalProps {
  pillar: GridPillar;
  ceilingH: number;
  onUpdate: (u: Partial<GridPillar>) => void;
  onDelete: () => void;
}

export default function PillarEditModal({ pillar, ceilingH, onUpdate, onDelete }: PillarEditModalProps) {
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
