"use client";

import { useState } from "react";
import { WOOD_PROPERTIES } from "@/data/wood-properties";
import {
  calculateStrength,
  type StrengthInput,
  type StrengthResult,
} from "@/lib/strength-calc";

const SUPPORT_LABELS = {
  "both-ends": "両端支持（一般的）",
  cantilever: "片持ち（壁付け棚など）",
  "three-point": "3点支持（中間に支柱）",
} as const;

const RATING_STYLES = {
  safe: "bg-green-50 border-green-200 text-green-800",
  caution: "bg-amber-50 border-amber-200 text-amber-800",
  danger: "bg-red-50 border-red-200 text-red-800",
};

export default function StrengthCheckerClient() {
  const [input, setInput] = useState<StrengthInput>({
    woodType: "spf",
    spanMm: 600,
    thicknessMm: 19,
    depthMm: 89,
    loadKg: 10,
    supportType: "both-ends",
  });

  const [result, setResult] = useState<StrengthResult | null>(null);

  function handleCalc() {
    const r = calculateStrength(input);
    setResult(r);
  }

  function update(key: keyof StrengthInput, value: string | number) {
    setInput((prev) => ({ ...prev, [key]: value }));
    setResult(null);
  }

  return (
    <div className="space-y-6">
      {/* 入力フォーム */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-lg font-bold text-gray-800 mb-4">条件を入力</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">木材の種類</span>
            <select
              value={input.woodType}
              onChange={(e) => update("woodType", e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
            >
              {WOOD_PROPERTIES.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">支持方法</span>
            <select
              value={input.supportType}
              onChange={(e) =>
                update("supportType", e.target.value as StrengthInput["supportType"])
              }
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
            >
              {(Object.keys(SUPPORT_LABELS) as Array<keyof typeof SUPPORT_LABELS>).map(
                (key) => (
                  <option key={key} value={key}>
                    {SUPPORT_LABELS[key]}
                  </option>
                )
              )}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              棚板の幅（スパン）(mm)
            </span>
            <input
              type="number"
              value={input.spanMm}
              onChange={(e) => update("spanMm", Number(e.target.value))}
              min={100}
              max={2000}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              棚板の厚さ (mm)
            </span>
            <input
              type="number"
              value={input.thicknessMm}
              onChange={(e) => update("thicknessMm", Number(e.target.value))}
              min={5}
              max={100}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              棚板の奥行 (mm)
            </span>
            <input
              type="number"
              value={input.depthMm}
              onChange={(e) => update("depthMm", Number(e.target.value))}
              min={50}
              max={600}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              載せる物の重さ (kg)
            </span>
            <input
              type="number"
              value={input.loadKg}
              onChange={(e) => update("loadKg", Number(e.target.value))}
              min={0.5}
              max={200}
              step={0.5}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
            />
          </label>
        </div>

        <button
          onClick={handleCalc}
          className="mt-5 w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
        >
          強度を計算する
        </button>
      </div>

      {/* 結果 */}
      {result && (
        <div
          className={`border rounded-xl p-5 ${RATING_STYLES[result.safetyRating]}`}
        >
          <div className="text-2xl font-bold mb-2">{result.safetyLabel}</div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs opacity-70">たわみ量</div>
              <div className="text-lg font-bold">
                {result.deflectionMm.toFixed(2)} mm
              </div>
            </div>
            <div>
              <div className="text-xs opacity-70">推奨最大荷重</div>
              <div className="text-lg font-bold">
                {result.maxRecommendedLoadKg.toFixed(1)} kg
              </div>
            </div>
          </div>

          {result.suggestions.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">改善提案:</div>
              <ul className="text-sm space-y-1">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="shrink-0">💡</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
