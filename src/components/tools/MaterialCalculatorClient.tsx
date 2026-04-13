"use client";

import { useState } from "react";
import {
  calculateMaterials,
  type MaterialCalcInput,
  type MaterialCalcResult,
  type ShelfBoardType,
  type ShelfMountType,
} from "@/lib/material-calc";
import { buildAmazonUrl } from "@/data/products";

const BOARD_TYPE_LABELS: Record<ShelfBoardType, string> = {
  "spf-2x4": "SPF 2×4材 (38mm厚・高強度)",
  "spf-1x4": "SPF 1×4材 (19mm厚・軽量)",
  "pine-18": "パイン集成材 18mm厚",
  "pine-25": "パイン集成材 25mm厚",
  "plywood-12": "合板 12mm厚",
  "melamine-16": "化粧板（メラミン）16mm厚",
};

const MOUNT_TYPE_LABELS: Record<ShelfMountType, string> = {
  labrico: "ラブリコ（ジャッキ式）",
  diawall: "ディアウォール（バネ式）",
  wallist: "ウォリスト（ネジ式）",
  freestanding: "自立式（アジャスターなし）",
};

export default function MaterialCalculatorClient() {
  const [input, setInput] = useState<MaterialCalcInput>({
    widthCm: 60,
    heightCm: 240,
    depthCm: 25,
    shelfCount: 4,
    boardType: "spf-2x4",
    mountType: "labrico",
  });

  const [result, setResult] = useState<MaterialCalcResult | null>(null);

  function handleCalc() {
    const r = calculateMaterials(input);
    setResult(r);
  }

  function update(key: keyof MaterialCalcInput, value: string | number) {
    setInput((prev) => ({ ...prev, [key]: value }));
    setResult(null);
  }

  const lumberItems = result?.items.filter((i) => i.category === "lumber") || [];
  const hardwareItems = result?.items.filter((i) => i.category === "hardware") || [];
  const toolItems = result?.items.filter((i) => i.category === "tool") || [];

  return (
    <div className="space-y-6">
      {/* 入力フォーム */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-lg font-bold text-gray-800 mb-4">棚の仕様を入力</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">棚の幅 (cm)</span>
            <input
              type="number"
              value={input.widthCm}
              onChange={(e) => update("widthCm", Number(e.target.value))}
              min={20}
              max={300}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">棚の高さ (cm)</span>
            <input
              type="number"
              value={input.heightCm}
              onChange={(e) => update("heightCm", Number(e.target.value))}
              min={50}
              max={300}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">棚の奥行 (cm)</span>
            <input
              type="number"
              value={input.depthCm}
              onChange={(e) => update("depthCm", Number(e.target.value))}
              min={10}
              max={60}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">棚板の枚数</span>
            <input
              type="number"
              value={input.shelfCount}
              onChange={(e) => update("shelfCount", Number(e.target.value))}
              min={1}
              max={10}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">棚板の木材タイプ</span>
            <select
              value={input.boardType}
              onChange={(e) => update("boardType", e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
            >
              {(Object.keys(BOARD_TYPE_LABELS) as ShelfBoardType[]).map((key) => (
                <option key={key} value={key}>
                  {BOARD_TYPE_LABELS[key]}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">設置方法</span>
            <select
              value={input.mountType}
              onChange={(e) => update("mountType", e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
            >
              {(Object.keys(MOUNT_TYPE_LABELS) as ShelfMountType[]).map((key) => (
                <option key={key} value={key}>
                  {MOUNT_TYPE_LABELS[key]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          onClick={handleCalc}
          className="mt-5 w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
        >
          材料を計算する
        </button>
      </div>

      {/* 結果 */}
      {result && (
        <div className="space-y-6">
          {/* 概要 */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="text-sm text-amber-700 mb-1">合計概算費用</div>
            <div className="text-3xl font-bold text-amber-800">
              ¥{result.totalCost.toLocaleString()}
            </div>
            <div className="mt-2 text-sm text-amber-600">
              柱 {result.pillarCount}本（{result.pillarLengthMm}mm）/ 棚板 {input.shelfCount}枚（{result.shelfWidthMm}mm幅）
            </div>
          </div>

          {/* 木材リスト */}
          <MaterialSection title="木材" items={lumberItems} />

          {/* 金具リスト */}
          <MaterialSection title="金具・ネジ" items={hardwareItems} />

          {/* 工具リスト */}
          <MaterialSection title="必要な工具（持っていない場合）" items={toolItems} />
        </div>
      )}
    </div>
  );
}

function MaterialSection({
  title,
  items,
}: {
  title: string;
  items: MaterialCalcResult["items"];
}) {
  if (items.length === 0) return null;
  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
        <span className="text-sm font-medium text-gray-500">
          小計 ¥{subtotal.toLocaleString()}
        </span>
      </div>
      <table className="w-full text-sm">
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="border-b border-gray-100 last:border-0">
              <td className="px-4 py-3">
                <a
                  href={buildAmazonUrl(item.amazonKeyword)}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="text-amber-600 hover:text-amber-700 transition-colors"
                >
                  {item.name}
                </a>
                {item.spec && (
                  <span className="ml-2 text-xs text-gray-400">
                    {item.spec}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right text-gray-500">
                {item.quantity}点
              </td>
              <td className="px-4 py-3 text-right font-medium">
                ¥{item.subtotal.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
