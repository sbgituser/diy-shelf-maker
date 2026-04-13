import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import MaterialCalculatorClient from "@/components/tools/MaterialCalculatorClient";

export const metadata: Metadata = {
  title: "材料計算シミュレーター【DIY棚の費用を自動計算】木材・金具・工具リスト",
  description:
    "棚の寸法を入力するだけで、必要な木材・金具・工具のリストと概算費用を自動計算。ラブリコ・ディアウォール・自立式に対応。Amazonリンク付きでそのまま購入可能。",
  keywords: [
    "DIY 木材 計算",
    "棚 材料費",
    "DIY 費用 計算",
    "2×4 木材 何本",
    "棚 DIY 材料",
    "ラブリコ 材料 一覧",
  ],
  openGraph: {
    title: "材料計算シミュレーター【DIY棚の費用を自動計算】| DIY棚メーカー",
    description:
      "棚の寸法から必要な材料と費用を自動計算。木材・金具・工具のリストをAmazonリンク付きで表示。",
    type: "website",
    locale: "ja_JP",
    url: "https://diy-shelf-maker.kuras-plus.com/tools/material-calculator",
    siteName: "DIY棚メーカー by kuras-plus",
    images: [{ url: "/ogp/default-ogp.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ogp/default-ogp.png"],
  },
  alternates: {
    canonical:
      "https://diy-shelf-maker.kuras-plus.com/tools/material-calculator",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "DIY棚の材料費はどのくらいかかる？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "一般的な2×4材の壁面棚（幅60cm×高さ240cm×4段）の場合、ラブリコ使用で約8,000〜12,000円が目安です。自立式なら5,000〜8,000円程度で作れます。",
      },
    },
    {
      "@type": "Question",
      name: "棚板の木材はどれを選べばいい？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "軽い物を載せるなら1×4材やパイン集成材18mm、本や食器など重い物にはSPF 2×4材やパイン集成材25mmがおすすめです。見た目を重視するならメラミン化粧板が最適です。",
      },
    },
  ],
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "材料計算シミュレーター",
  description:
    "DIY棚の材料と費用を自動計算するツール",
  url: "https://diy-shelf-maker.kuras-plus.com/tools/material-calculator",
  applicationCategory: "UtilitiesApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
};

export default function MaterialCalculatorPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />

      <Breadcrumb
        items={[
          { name: "ホーム", href: "/" },
          { name: "ツール一覧", href: "/tools" },
          { name: "材料計算シミュレーター" },
        ]}
      />

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-100 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          材料計算シミュレーター
        </h1>
        <p className="mt-2 text-gray-600">
          棚の寸法と設置方法を入力すると、必要な木材・金具・工具のリストと
          概算費用を自動計算します。Amazonリンク付きでそのまま購入可能です。
        </p>
      </div>

      <MaterialCalculatorClient />

      {/* FAQ */}
      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-bold text-gray-800">よくある質問</h2>
        <details className="bg-white border border-gray-200 rounded-xl">
          <summary className="px-5 py-3 text-sm font-medium text-gray-800 cursor-pointer hover:bg-gray-50">
            DIY棚の材料費はどのくらいかかる？
          </summary>
          <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
            一般的な2×4材の壁面棚（幅60cm×高さ240cm×4段）の場合、ラブリコ使用で
            約8,000〜12,000円が目安です。自立式ならアジャスター分が不要なので
            5,000〜8,000円程度で作れます。
          </div>
        </details>
        <details className="bg-white border border-gray-200 rounded-xl">
          <summary className="px-5 py-3 text-sm font-medium text-gray-800 cursor-pointer hover:bg-gray-50">
            棚板の木材はどれを選べばいい？
          </summary>
          <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
            軽い物を載せるなら1×4材やパイン集成材18mm、本や食器など重い物には
            SPF 2×4材やパイン集成材25mmがおすすめです。見た目を重視するなら
            メラミン化粧板が最適です。合板は安価ですが木口の処理が必要です。
          </div>
        </details>
        <details className="bg-white border border-gray-200 rounded-xl">
          <summary className="px-5 py-3 text-sm font-medium text-gray-800 cursor-pointer hover:bg-gray-50">
            ラブリコとディアウォールの違いは？
          </summary>
          <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
            ラブリコはジャッキ式で微調整しやすく、ディアウォールはバネ式で取り付けが簡単です。
            耐荷重はどちらも柱1本あたり約20kg。重い物を載せるならラブリコ強力タイプ(40kg)や
            ウォリスト(30kg)がおすすめです。
          </div>
        </details>
      </section>
    </div>
  );
}
