"use client";

import { buildAmazonUrl } from "@/data/products";

interface ToolItem {
  name: string;
  description: string;
  icon: string;
  keyword: string;
  priceRange: string;
}

const RECOMMENDED_TOOLS: ToolItem[] = [
  {
    name: "電動ドライバー",
    description: "ビス打ちに必須。DIY初心者にはコードレスの10.8Vがおすすめ。",
    icon: "🔨",
    keyword: "電動ドライバー DIY 初心者 コードレス",
    priceRange: "¥3,000〜8,000",
  },
  {
    name: "水平器",
    description: "棚板の水平を正確に出すために。スマホアプリより信頼性が高い。",
    icon: "📐",
    keyword: "水平器 DIY 棚 マグネット付き",
    priceRange: "¥500〜1,500",
  },
  {
    name: "メジャー（コンベックス）",
    description: "天井高の測定に。5.5m以上のロックタイプが便利。",
    icon: "📏",
    keyword: "メジャー コンベックス 5.5m ロック",
    priceRange: "¥500〜1,500",
  },
  {
    name: "サンドペーパーセット",
    description: "木材のバリ取り・仕上げに。#180〜#400のセットが便利。",
    icon: "✨",
    keyword: "サンドペーパー 木工 セット 紙やすり",
    priceRange: "¥300〜800",
  },
  {
    name: "木工用ボンド",
    description: "接合部の補強に。速乾タイプが作業効率◎。",
    icon: "🧴",
    keyword: "木工用ボンド 速乾 DIY",
    priceRange: "¥300〜600",
  },
  {
    name: "ワトコオイル（塗装）",
    description: "木材の保護と風合いアップに。初心者でも失敗しにくい。",
    icon: "🎨",
    keyword: "ワトコオイル 木材 塗装 DIY",
    priceRange: "¥1,500〜2,500",
  },
];

export default function RecommendedTools() {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold text-gray-800 mb-3">
        あると便利なDIY工具・資材
      </h2>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-sm text-gray-600">
            棚づくりに役立つ工具・資材をまとめました。初めてのDIYならまず電動ドライバーと水平器があると安心です。
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
          {RECOMMENDED_TOOLS.map((tool, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 border-b border-gray-100 sm:odd:border-r"
            >
              <span className="text-2xl flex-shrink-0">{tool.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium text-gray-800 text-sm">
                    {tool.name}
                  </h3>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {tool.priceRange}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  {tool.description}
                </p>
                <a
                  href={buildAmazonUrl(tool.keyword)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs font-medium hover:bg-amber-200 transition-colors"
                >
                  Amazonで探す
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
