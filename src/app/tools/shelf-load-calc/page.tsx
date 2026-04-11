import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import FaqAccordion from "@/components/FaqAccordion";
import ShelfLoadCalcClient from "@/components/tools/ShelfLoadCalcClient";
import { WOOD_MATERIALS } from "@/constants/shelfLoadCalc";
import { buildAmazonUrl } from "@/data/products";

export const metadata: Metadata = {
  title: "DIY棚の耐荷重計算ツール【無料】棚板たわみ量も自動算出",
  description:
    "DIY棚の耐荷重を無料で計算できるツール。パイン・MDF・合板など7種の板材に対応し、棚板のたわみ量と棚受け間隔の推奨値も自動算出。棚板選びの失敗を防ぐ安全設計をサポートします。",
  keywords: [
    "棚板 耐荷重 計算",
    "棚板 たわみ 計算",
    "棚板 厚み 目安",
    "本棚 棚板 耐荷重",
    "棚受け 間隔 目安",
    "パイン集成材 耐荷重",
    "MDF 耐荷重",
    "DIY 棚板 選び方",
  ],
  openGraph: {
    title: "DIY棚の耐荷重計算ツール【無料】棚板たわみ量も自動算出 | DIY棚メーカー",
    description:
      "DIY棚の耐荷重を無料で計算。パイン・MDF・合板など7種の板材に対応し、棚板のたわみ量と棚受け間隔の推奨値も自動算出。",
    type: "website",
    locale: "ja_JP",
    url: "https://diy-shelf-maker.kuras-plus.com/tools/shelf-load-calc",
    siteName: "DIY棚メーカー by kuras-plus",
    images: [{ url: "/ogp/default-ogp.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ogp/default-ogp.png"],
  },
  alternates: {
    canonical: "https://diy-shelf-maker.kuras-plus.com/tools/shelf-load-calc",
  },
};

const FAQ_ITEMS = [
  {
    question: "棚板の耐荷重の計算方法は？",
    answer:
      "棚板の耐荷重は、板材の曲げ強度・厚み・幅・スパン（棚受け間の距離）から材料力学の公式で算出します。本ツールでは安全係数3を適用し、実際の破壊荷重の1/3を最大耐荷重として表示しています。",
  },
  {
    question: "本棚の棚板は何mm厚がいい？",
    answer:
      "文庫本や漫画なら18mm厚のパイン集成材で棚受け間隔600mm以内が目安です。ハードカバーやA4ファイルなど重いものを載せる場合は24mm厚、またはスパンを短くしてください。",
  },
  {
    question: "たわみを防ぐには？",
    answer:
      "たわみを減らすには①厚い板材を使う②棚受け間隔（スパン）を短くする③弾性率の高い板材（タモ集成材やSPF材）を選ぶ④3点支持にする、の4つが有効です。",
  },
  {
    question: "パイン集成材とMDFの違いは？",
    answer:
      "パイン集成材は天然木の風合いがあり弾性率が高くたわみにくいですが価格はやや高め。MDFは均一で加工しやすく安価ですが、弾性率が低くたわみやすい・水に弱い点に注意が必要です。",
  },
  {
    question: "棚受けの間隔の目安は？",
    answer:
      "一般的な目安は、18mm厚パイン集成材なら450〜600mm、24mm厚なら600〜900mmです。載せるものの重さによっても変わるため、本ツールで具体的な推奨値を確認してください。",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "棚板耐荷重計算ツール",
    description:
      "DIY棚の棚板が何kg耐えられるか自動計算。パイン・MDF・合板など7種の板材に対応。",
    url: "https://diy-shelf-maker.kuras-plus.com/tools/shelf-load-calc",
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
          name: "棚板耐荷重計算ツール",
          item: "https://diy-shelf-maker.kuras-plus.com/tools/shelf-load-calc",
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

export default function ShelfLoadCalcPage() {
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
            { name: "棚板耐荷重計算ツール" },
          ]}
        />

        {/* ヒーローセクション */}
        <section className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 sm:p-8 border border-indigo-100 mb-10">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl">📐</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
                棚板耐荷重計算ツール
              </h1>
              <p className="mt-2 text-gray-600 leading-relaxed max-w-2xl">
                板材の種類・厚み・幅・スパン・支持方式を入力すると、最大耐荷重とたわみ量を自動計算。
                「この棚板に本を何冊載せられる？」がすぐにわかります。
              </p>
            </div>
          </div>
        </section>

        {/* 計算ツール本体 */}
        <ShelfLoadCalcClient />

        {/* 板材比較テーブル */}
        <section className="mt-12 mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            板材スペック比較表
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    板材
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">
                    密度
                    <br />
                    <span className="text-xs font-normal text-gray-400">
                      kg/m³
                    </span>
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">
                    曲げ強度
                    <br />
                    <span className="text-xs font-normal text-gray-400">
                      MPa
                    </span>
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">
                    弾性率
                    <br />
                    <span className="text-xs font-normal text-gray-400">
                      MPa
                    </span>
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">
                    参考価格
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">
                    Amazon
                  </th>
                </tr>
              </thead>
              <tbody>
                {WOOD_MATERIALS.map((m, i) => (
                  <tr
                    key={m.id}
                    className={
                      i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {m.name}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {m.density}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {m.bendingStrength}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {m.elasticModulus.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-500 text-xs">
                      {m.priceRange}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <a
                        href={buildAmazonUrl(m.amazonKeyword)}
                        target="_blank"
                        rel="noopener noreferrer nofollow sponsored"
                        className="text-xs text-indigo-600 hover:text-indigo-700 hover:underline"
                      >
                        検索 →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
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
              href="/parts/category/bracket"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              <p className="text-2xl mb-2">🔩</p>
              <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors text-sm">
                棚受け金具一覧
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                L字金具・チャンネルサポート等を比較
              </p>
            </a>
            <a
              href="/templates"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              <p className="text-2xl mb-2">📋</p>
              <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors text-sm">
                テンプレート一覧
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                人気の棚デザインをワンクリックで設計開始
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
