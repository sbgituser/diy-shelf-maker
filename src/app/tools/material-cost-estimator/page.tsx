import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import FaqAccordion from "@/components/FaqAccordion";
import MaterialCostEstimatorClient from "@/components/tools/MaterialCostEstimatorClient";

export const metadata: Metadata = {
  title: "DIY棚の費用計算ツール【無料】部材費用を自動見積もり",
  description:
    "DIY棚の材料費を無料で自動見積もり。棚の寸法と材質を入力するだけで、木材・金具・ネジの費用を一括算出。ホームセンターでの買い物リストとしても使えます。",
  keywords: [
    "DIY 棚 費用",
    "棚 材料費 見積もり",
    "DIY 木材 費用 計算",
    "棚 作る いくら",
    "ディアウォール 費用",
    "ラブリコ 費用",
    "DIY 棚 材料リスト",
    "ホームセンター 木材 価格",
  ],
  openGraph: {
    title: "DIY棚の費用計算ツール【無料】部材費用を自動見積もり",
    description:
      "DIY棚の材料費を無料で自動見積もり。棚の寸法と材質を入力するだけで、木材・金具・ネジの費用を一括算出。ホームセンターでの買い物リストとしても使えます。",
    type: "website",
    locale: "ja_JP",
    url: "https://diy-shelf-maker.kuras-plus.com/tools/material-cost-estimator",
    siteName: "DIY棚シミュレーター by kuras-plus",
  },
  alternates: {
    canonical:
      "https://diy-shelf-maker.kuras-plus.com/tools/material-cost-estimator",
  },
};

const FAQ_ITEMS = [
  {
    question: "DIYで棚を作るといくらかかる？",
    answer:
      "材質や大きさによりますが、ラブリコ／ディアウォールで3〜5段の棚を作る場合、材料費は5,000〜15,000円程度が目安です。工具を既にお持ちなら材料費だけで済みます。本ツールで寸法を入力すると具体的な見積もりが出ます。",
  },
  {
    question: "ホームセンターとネット通販、どちらが安い？",
    answer:
      "木材はホームセンターの方が安い傾向があり、カットサービスも利用できます。一方、金具やアジャスター（ディアウォール・ラブリコ）はAmazon等のネット通販の方が安い場合が多いです。比較して購入するのがおすすめです。",
  },
  {
    question: "表示価格は正確ですか？",
    answer:
      "本ツールの価格は参考価格（税込目安）です。実際の価格は販売店や時期、地域によって変動します。最新価格は各材料のAmazonリンクや最寄りのホームセンターでご確認ください。",
  },
  {
    question: "工具は何が必要？",
    answer:
      "最低限必要なのはドリルドライバー（ネジ締め用）、メジャー、水平器です。木材のカットはホームセンターのカットサービスを利用すれば、のこぎりは不要です。サンドペーパーは仕上げの研磨に使います。",
  },
  {
    question: "見積もりの材料リストを買い物メモにできますか？",
    answer:
      "はい。見積もり結果の「印刷 / 保存」ボタンからブラウザの印刷機能でPDF保存や紙への印刷ができます。ホームセンターでの買い物リストとしてそのままご利用いただけます。",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "DIY棚 木材費用見積もりツール",
    description:
      "DIY棚の材料費を自動見積もり。棚の寸法と材質を入力するだけで、必要な木材・金具・ネジのリストと参考費用を算出。",
    url: "https://diy-shelf-maker.kuras-plus.com/tools/material-cost-estimator",
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
          name: "木材費用見積もりツール",
          item: "https://diy-shelf-maker.kuras-plus.com/tools/material-cost-estimator",
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

export default function MaterialCostEstimatorPage() {
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
            { name: "木材費用見積もりツール" },
          ]}
        />

        {/* ヒーローセクション */}
        <section className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 sm:p-8 border border-emerald-100 mb-10">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl">💰</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
                DIY棚 木材費用見積もりツール
              </h1>
              <p className="mt-2 text-gray-600 leading-relaxed max-w-2xl">
                棚の寸法・材質・支柱方式を入力すると、必要な木材・金具・ネジ等の材料リストと参考費用を自動計算。
                「この棚を作るのにいくらかかる？」がすぐにわかります。
              </p>
            </div>
          </div>
        </section>

        {/* 見積もりツール本体 */}
        <MaterialCostEstimatorClient />

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
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-emerald-300 hover:shadow-sm transition-all group"
            >
              <p className="text-2xl mb-2">🪵</p>
              <h3 className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors text-sm">
                棚シミュレーター
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                棚のレイアウトを設計・部材リストを自動生成
              </p>
            </a>
            <a
              href="/tools/shelf-load-calc"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-emerald-300 hover:shadow-sm transition-all group"
            >
              <p className="text-2xl mb-2">📐</p>
              <h3 className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors text-sm">
                棚板耐荷重計算ツール
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                板材の厚み・スパンから安全な荷重を計算
              </p>
            </a>
            <a
              href="/parts"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-emerald-300 hover:shadow-sm transition-all group"
            >
              <p className="text-2xl mb-2">📦</p>
              <h3 className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors text-sm">
                パーツ辞典
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                金具・木材・塗装材の選び方を詳しく解説
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
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-sm transition-all group"
            >
              <span className="text-xl flex-shrink-0">⚖️</span>
              <div>
                <h3 className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors text-sm">ラブリコ vs ディアウォール徹底比較</h3>
                <p className="mt-1 text-xs text-gray-500">固定方���・耐荷重・価格の違いを解説</p>
              </div>
            </a>
            <a
              href="/howto/rental-wall-storage-guide"
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-sm transition-all group"
            >
              <span className="text-xl flex-shrink-0">🏠</span>
              <div>
                <h3 className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors text-sm">賃貸でもできる壁面収納ガイド</h3>
                <p className="mt-1 text-xs text-gray-500">賃貸OK・原状回復できるDIY棚の作り方</p>
              </div>
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
