"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import type { PartItem } from "@/types";
import { formatCutPlanLines, formatCutPlanText } from "@/lib/cut-optimizer";

interface Props {
  parts: PartItem[];
  total: number;
}

const CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
  adjuster: { label: "アジャスター", icon: "🔧" },
  lumber: { label: "木材", icon: "🪵" },
  shelf: { label: "棚板", icon: "📏" },
  bracket: { label: "棚受け金具", icon: "🔩" },
  screw: { label: "ネジ類", icon: "📌" },
  accessory: { label: "装飾品", icon: "✨" },
};

/** 柱・棚板(木材)のカテゴリ。定尺材から切り出す「必要な部材」の本体 */
const MATERIAL_CATEGORIES = new Set(["lumber", "shelf"]);

/** カット割付の詳細(ホームセンター持参用メモ)。展開・コピーができる */
function CutPlanDetail({ part }: { part: PartItem }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const plan = part.cutPlan;
  if (!plan) return null;

  const handleCopy = useCallback(async () => {
    const text = formatCutPlanText(plan, part.name);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [plan, part.name]);

  return (
    <div className="mt-1.5">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="text-xs font-medium text-amber-700 hover:text-amber-800 underline underline-offset-2"
      >
        {expanded ? "カット割付を閉じる" : `カット割付を見る（${plan.barsNeeded}本分）`}
      </button>
      {expanded && (
        <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="font-mono text-xs text-gray-700 space-y-0.5 whitespace-pre-wrap break-all">
            {formatCutPlanLines(plan).map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 py-1 px-2.5 rounded transition-colors"
          >
            {copied ? "✓ コピーしました" : "📋 このメモをコピー"}
          </button>
        </div>
      )}
    </div>
  );
}

/** 部材テーブル本体(見出し行+部材行)。柱・棚板テーブルとアジャスター等テーブルで共用 */
function PartsTable({ parts, ariaLabel }: { parts: PartItem[]; ariaLabel: string }) {
  if (parts.length === 0) return null;
  return (
    <div className="overflow-x-auto" role="region" aria-label={ariaLabel} tabIndex={0}>
      <table className="w-full text-sm">
        <caption className="sr-only">{ariaLabel}（部材名・数量・単価・小計・購入リンク）</caption>
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th scope="col" className="px-4 py-3 text-left text-gray-600 font-medium">
              部材
            </th>
            <th scope="col" className="px-4 py-3 text-center text-gray-600 font-medium w-16">
              数量
            </th>
            <th scope="col" className="px-4 py-3 text-right text-gray-600 font-medium w-24">
              単価
            </th>
            <th scope="col" className="px-4 py-3 text-right text-gray-600 font-medium w-24">
              小計
            </th>
            <th scope="col" className="px-4 py-3 text-center text-gray-600 font-medium w-28">
              購入
            </th>
          </tr>
        </thead>
        <tbody>
          {parts.map((part, i) => {
            const cat = CATEGORY_LABELS[part.category] ?? {
              label: part.category,
              icon: "📦",
            };
            return (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-start gap-2">
                    <span className="text-base">{cat.icon}</span>
                    <div>
                      <div className="font-bold text-gray-900">{part.name}</div>
                      {part.note && (
                        <div className="text-xs text-gray-500 mt-0.5">{part.note}</div>
                      )}
                      <CutPlanDetail part={part} />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center font-mono text-gray-700">
                  {part.quantity}
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-600">
                  ¥{part.unitPrice.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-gray-900 bg-amber-50/50">
                  ¥{part.subtotal.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center">
                  <a
                    href={part.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold py-1.5 px-3 rounded transition-colors"
                  >
                    🛒 Amazonで見る
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function PartsListTable({ parts, total }: Props) {
  // 柱・棚板(定尺材からカットする本体の部材)と、
  // アジャスター・棚受け金具・ネジ・装飾品(付属品)を分けて表示する
  const materialParts = parts.filter((p) => MATERIAL_CATEGORIES.has(p.category));
  const accessoryParts = parts.filter((p) => !MATERIAL_CATEGORIES.has(p.category));

  return (
    <div id="parts-list" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {materialParts.length > 0 && (
        <div>
          <h3 className="px-4 pt-4 pb-2 text-sm font-bold text-gray-700">
            🪵 柱・棚板(カットする木材)
          </h3>
          <PartsTable parts={materialParts} ariaLabel="柱・棚板の部材リスト" />
        </div>
      )}

      {accessoryParts.length > 0 && (
        <div className={materialParts.length > 0 ? "border-t border-gray-200" : ""}>
          <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-2">
            <h3 className="text-sm font-bold text-gray-700">
              🔧 アジャスター・棚受け金具・装飾品
            </h3>
            <Link
              href="/parts"
              className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-800 underline underline-offset-2 whitespace-nowrap"
            >
              📖 パーツ辞典で選び方を見る →
            </Link>
          </div>
          <PartsTable parts={accessoryParts} ariaLabel="アジャスター・棚受け金具・装飾品の部材リスト" />
        </div>
      )}

      {/* 合計 */}
      <div className="flex items-center justify-between px-4 py-4 bg-amber-50 border-t border-amber-200">
        <span className="text-sm font-medium text-gray-700">
          参考合計金額 (税込目安)
        </span>
        <span className="text-2xl font-bold text-amber-700 font-mono">
          ¥{total.toLocaleString()}
        </span>
      </div>

      {/* まとめて購入CTA */}
      {parts.length > 0 && (
        <div className="px-4 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-700">
                必要な材料をAmazonでまとめて購入
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                各部材のAmazonボタンから個別に購入できます
              </p>
            </div>
            <a
              href={`https://www.amazon.co.jp/s?k=${encodeURIComponent("DIY 棚 2×4 ラブリコ セット")}&tag=kurasplus-22`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors shadow-sm whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              Amazonで材料を探す
            </a>
          </div>
        </div>
      )}

      {/* 注意書き */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          ※ 価格は参考値です。実際の価格は購入先・時期により異なります。
          木材はホームセンターでのカットサービス利用がおすすめです。
        </p>
      </div>
    </div>
  );
}
