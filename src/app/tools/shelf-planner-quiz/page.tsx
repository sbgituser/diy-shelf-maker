import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import FaqAccordion from "@/components/FaqAccordion";
import ShelfPlannerQuizClient from "@/components/tools/ShelfPlannerQuizClient";

export const metadata: Metadata = {
  title: "棚DIY初心者診断【無料】5問であなたに最適な棚を提案",
  description:
    "5つの質問に答えるだけで最適なDIY棚の設計プランを提案。設置場所・収納物・予算・スキルに合わせた材料リスト・費用目安も自動算出。棚設計シミュレーターと連携してすぐ設計を開始できます。",
  keywords: [
    "DIY 棚 おすすめ",
    "棚 DIY 初心者",
    "DIY 棚 診断",
    "棚 プランナー",
    "棚 何を作る",
    "DIY 棚 材料",
    "棚 費用 目安",
    "賃貸 DIY 棚 おすすめ",
  ],
  openGraph: {
    title: "棚DIY初心者診断【無料】5問であなたに最適な棚を提案 | DIY棚メーカー",
    description:
      "5つの質問に答えるだけで最適なDIY棚の設計プランを提案。材料リスト・費用目安も自動算出。",
    type: "website",
    locale: "ja_JP",
    url: "https://diy-shelf-maker.kuras-plus.com/tools/shelf-planner-quiz",
    siteName: "DIY棚メーカー by kuras-plus",
    images: [{ url: "/ogp/default-ogp.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ogp/default-ogp.png"],
  },
  alternates: {
    canonical:
      "https://diy-shelf-maker.kuras-plus.com/tools/shelf-planner-quiz",
  },
};

const FAQ_ITEMS = [
  {
    question: "診断結果はどのくらい正確ですか？",
    answer:
      "5つの質問（設置場所・収納物・住居タイプ・予算・経験レベル）をもとに、8タイプの棚からスコアリングで最適な2タイプを選出します。あくまで参考ですが、初心者が最初の一歩を決める目安として活用いただけます。",
  },
  {
    question: "賃貸でもDIY棚は作れますか？",
    answer:
      "はい。ディアウォールやラブリコなど突っ張り式のアジャスターを使えば、壁に穴を開けずに棚を設置できます。診断で「賃貸」を選ぶと、壁穴不要のタイプが優先的に提案されます。",
  },
  {
    question: "材料はどこで買えますか？",
    answer:
      "診断結果の各材料にはAmazonの検索リンクが付いています。ホームセンター（カインズ・コーナン・DCM等）でも同等品が手に入ります。2×4材のカットはホームセンターの木材カットサービスが便利です。",
  },
  {
    question: "費用目安はどのくらい正確ですか？",
    answer:
      "材料費の一般的な価格帯をもとにした目安です。購入先や時期によって変動します。より正確な見積もりは「費用見積もりツール」で材料ごとに計算できます。",
  },
  {
    question: "診断結果の棚をもっと詳しく設計したいときは？",
    answer:
      "結果画面の「シミュレーターで設計する」ボタンから棚シミュレーターへ進めます。柱の本数・棚板の枚数・寸法などを細かく調整でき、設計図と部材リストが自動生成されます。",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "DIY棚プランナー診断",
    description:
      "5つの質問に答えるだけで最適なDIY棚の設計プラン・材料リスト・費用目安を提案する診断ツール。",
    url: "https://diy-shelf-maker.kuras-plus.com/tools/shelf-planner-quiz",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
    },
    author: {
      "@type": "Organization",
      name: "kuras-plus",
      url: "https://kuras-plus.com",
    },
    publisher: {
      "@type": "Organization",
      name: "kuras-plus",
      url: "https://kuras-plus.com",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "ホーム",
          item: "https://diy-shelf-maker.kuras-plus.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "ツール一覧",
          item: "https://diy-shelf-maker.kuras-plus.com/tools",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "DIY棚プランナー診断",
          item: "https://diy-shelf-maker.kuras-plus.com/tools/shelf-planner-quiz",
        },
      ],
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  },
];

export default function ShelfPlannerQuizPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto">
        <Breadcrumb
          items={[
            { name: "ホーム", href: "/" },
            { name: "ツール一覧", href: "/tools" },
            { name: "DIY棚プランナー診断" },
          ]}
        />

        {/* ヒーローセクション */}
        <section className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 sm:p-8 border border-rose-100 mb-10">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl">🧩</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
                DIY棚プランナー診断
              </h1>
              <p className="mt-2 text-gray-600 leading-relaxed max-w-2xl">
                5つの質問に答えるだけで、あなたにピッタリのDIY棚タイプを診断。
                設計プラン・必要材料・費用目安・作り方の手順まで、まとめてご提案します。
              </p>
            </div>
          </div>
        </section>

        {/* 診断ツール本体 */}
        <ShelfPlannerQuizClient />

        {/* FAQ */}
        <section className="mt-12 mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            よくある質問
          </h2>
          <FaqAccordion items={FAQ_ITEMS} />
        </section>

        {/* 関連リンク */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-5">関連ページ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="/"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              <p className="text-2xl mb-2">🪵</p>
              <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors text-sm">
                棚シミュレーター
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                棚のレイアウトを設計・部材リストを自動生成
              </p>
            </a>
            <a
              href="/tools/shelf-load-calc"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              <p className="text-2xl mb-2">📐</p>
              <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors text-sm">
                棚板耐荷重計算ツール
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                板材・厚み・スパンから安全荷重を計算
              </p>
            </a>
            <a
              href="/tools/material-cost-estimator"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              <p className="text-2xl mb-2">💰</p>
              <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors text-sm">
                木材費用見積もり
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                材料費を詳しくシミュレーション
              </p>
            </a>
          </div>
        </section>

        {/* 関連する作り方ガイド */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-5">関連する作り方ガイド</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="/howto/labrico-vs-diawall"
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              <span className="text-xl flex-shrink-0">⚖️</span>
              <div>
                <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors text-sm">ラブリコ vs ディアウォール徹底比較</h3>
                <p className="mt-1 text-xs text-gray-500">固定方式・耐荷重・価格の違いを解説</p>
              </div>
            </a>
            <a
              href="/howto/rental-wall-storage-guide"
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              <span className="text-xl flex-shrink-0">🏠</span>
              <div>
                <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors text-sm">賃貸でもできる壁面収納ガイド</h3>
                <p className="mt-1 text-xs text-gray-500">賃貸OK・原状回復できるDIY棚の作り方</p>
              </div>
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
