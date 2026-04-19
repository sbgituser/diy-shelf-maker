import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "DIY棚ツール一覧【すべて無料】��計・計算サポート9選",
  description:
    "DIY棚づくりに役立つ無料ツール9選。木材カット計算・プロジ���クトDB・材料計算・強度チェック・耐荷重計算・費用見積��り・支柱比較・棚設計診断で、設計から材料選びまでサポート。",
  keywords: [
    "DIY 棚 ツール",
    "DIY 棚 設計図",
    "棚 耐荷重 計算",
    "DIY 木材 計算",
    "棚板 たわみ 計算",
    "DIY 費用 見積もり",
    "ラブリコ ディアウォール 比較",
    "棚 設計 診断",
  ],
  openGraph: {
    title: "DIY棚ツール一覧【すべて無料】設計・計算サポート7選 | DIY棚メーカー",
    description:
      "DIY棚づくりに役立つ無料ツール7選。プロジェクトDB・材料計算・強度チェック・耐荷重計算・費用見積もり・支柱比較・棚設計診断をまとめました。",
    type: "website",
    locale: "ja_JP",
    url: "https://diy-shelf-maker.kuras-plus.com/tools",
    siteName: "DIY棚メーカー by kuras-plus",
    images: [{ url: "/ogp/default-ogp.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ogp/default-ogp.png"],
  },
  alternates: {
    canonical: "https://diy-shelf-maker.kuras-plus.com/tools",
  },
};

const TOOLS = [
  {
    href: "/tools/wood-cut-calculator",
    icon: "🪚",
    name: "木材カット計算ツール",
    description:
      "天井高とアジャスターを選ぶだけで柱・棚板のカット寸法を自動算出。ホームセンター注文メモ付き。",
    guideHref: "/howto/shelf-wood-cutting-calculator",
  },
  {
    href: "/tools/projects",
    icon: "📦",
    name: "DIY棚プロジェクトDB",
    description:
      "50件以上のDIY棚プロジェクトを部屋タイプ×難易度×予算で検索。設計図・材料リスト・工程を掲載。",
    guideHref: "/tools/projects",
  },
  {
    href: "/tools/material-calculator",
    icon: "🧮",
    name: "材料計算シミュレーター",
    description:
      "棚の寸法を入力するだけで、必要な木材・金具・工具リストと概算費用を自動計算。Amazonリンク付き。",
    guideHref: "/tools/material-calculator",
  },
  {
    href: "/tools/strength-checker",
    icon: "🔬",
    name: "棚板強度チェッカー",
    description:
      "木材の種類と寸法、載せる物の重さを入力すると、たわみ量を計算し安全性を判定。改善提案も表示。",
    guideHref: "/tools/strength-checker",
  },
  {
    href: "/tools/shelf-load-calc",
    icon: "⚖️",
    name: "棚板耐荷重計算ツール",
    description:
      "棚板の材質・寸法から耐荷重・たわみ量を自動計算。パイン・MDF・合板など7種に対応。",
    guideHref: "/howto/shelf-load-calculator-guide",
  },
  {
    href: "/tools/material-cost-estimator",
    icon: "💰",
    name: "費用見積もりツール",
    description:
      "棚の寸法と材質を入力するだけで、木材・金具・ネジの費用を一括算出。買い物リストにも。",
    guideHref: "/howto/material-cost-estimator-guide",
  },
  {
    href: "/tools/support-system-picker",
    icon: "🔧",
    name: "支柱タイプ比較ツール",
    description:
      "ラブリコ・ディアウォール・ウォリストを耐荷重・価格・設置難易度で比較。最適な支柱がすぐ分かる。",
    guideHref: "/howto/support-system-picker-guide",
  },
  {
    href: "/tools/shelf-planner-quiz",
    icon: "📋",
    name: "棚設計診断ツール",
    description:
      "5つの質問に答えるだけで、最適な棚の設計プラン・材料リスト・費用目安を提案します。",
    guideHref: "/howto/shelf-planner-quiz-guide",
  },
  {
    href: "/tools/smart-home-power-calc",
    icon: "⚡",
    name: "スマートホーム電気代計算機",
    description:
      "スマートプラグ・照明・カメラなどIoTデバイスの電気代を自動計算。DIY棚×スマートホームの運用コスト試算に。",
    guideHref: "/tools/smart-home-power-calc",
  },
];

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "DIY棚づくりツール一覧",
  description:
    "DIY棚づくりに役立つ無料ツールを一覧で紹介。木材カット計算・プロジェクトDB・材料計算・強度チェック・耐荷重計算・費用見積もり・支柱比較・棚診断。",
  url: "https://diy-shelf-maker.kuras-plus.com/tools",
  hasPart: TOOLS.map((tool) => ({
    "@type": "WebApplication",
    name: tool.name,
    url: `https://diy-shelf-maker.kuras-plus.com${tool.href}`,
    applicationCategory: "UtilitiesApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  })),
};

export default function ToolsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <Breadcrumb
        items={[{ name: "ホーム", href: "/" }, { name: "ツール一覧" }]}
      />

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-100 mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          DIY棚づくりツール一覧
        </h1>
        <p className="mt-2 text-gray-600">
          棚の設計から材料選びまで、DIYに役立つ無料ツールをまとめました。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <div
            key={tool.href}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-amber-300 hover:shadow-md transition-all"
          >
            <span className="text-3xl">{tool.icon}</span>
            <h2 className="mt-3 text-lg font-bold text-gray-800">
              {tool.name}
            </h2>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              {tool.description}
            </p>
            <div className="mt-3 flex items-center gap-4">
              <Link
                href={tool.href}
                className="text-sm text-amber-600 font-medium hover:text-amber-700 transition-colors"
              >
                ツールを使う →
              </Link>
              <Link
                href={tool.guideHref}
                className="text-sm text-gray-500 hover:text-amber-600 transition-colors"
              >
                活用ガイド →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-10 bg-gray-50 rounded-xl border border-gray-200 p-5">
        <h2 className="text-base font-bold text-gray-800 mb-3">
          もっと詳しく学ぶ
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/howto"
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-all"
          >
            <span className="text-2xl">📖</span>
            <div>
              <div className="font-semibold text-gray-800 text-sm">作り方ガイド一覧</div>
              <div className="text-xs text-gray-500 mt-0.5">ラブリコ比較・賃貸DIY・本棚の作り方など</div>
            </div>
          </Link>
          <Link
            href="/templates"
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-all"
          >
            <span className="text-2xl">📐</span>
            <div>
              <div className="font-semibold text-gray-800 text-sm">テンプレート一覧</div>
              <div className="text-xs text-gray-500 mt-0.5">本棚・キッチン棚・シューズラックなど12種</div>
            </div>
          </Link>
          <Link
            href="/parts"
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-all"
          >
            <span className="text-2xl">🔧</span>
            <div>
              <div className="font-semibold text-gray-800 text-sm">パーツ辞典</div>
              <div className="text-xs text-gray-500 mt-0.5">アジャスター・木材・金具など37パーツ</div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
