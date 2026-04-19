import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import FaqAccordion from "@/components/FaqAccordion";
import SmartHomePowerCalcClient from "@/components/tools/SmartHomePowerCalcClient";
import { buildAmazonUrl } from "@/data/products";

export const metadata: Metadata = {
  title: "スマートホーム電気代計算ツール【無料】IoTデバイスの電気代を自動計算",
  description:
    "スマートプラグ・スマート照明・IoTセンサーなど、スマートホームデバイスの電気代を自動計算。DIY棚にスマートデバイスを組み合わせる際の電気代シミュレーションに。",
  keywords: [
    "スマートホーム 電気代",
    "IoT 電気代 計算",
    "スマートプラグ 電力",
    "DIY棚 スマートホーム",
  ],
  openGraph: {
    title:
      "スマートホーム電気代計算ツール【無料】IoTデバイスの電気代を自動計算 | DIY棚メーカー",
    description:
      "スマートプラグ・スマート照明・IoTセンサーなど、スマートホームデバイスの電気代を自動計算。DIY棚にスマートデバイスを組み合わせる際の電気代シミュレーションに。",
    type: "website",
    locale: "ja_JP",
    url: "https://diy-shelf-maker.kuras-plus.com/tools/smart-home-power-calc",
    siteName: "DIY棚メーカー by kuras-plus",
    images: [{ url: "/ogp/default-ogp.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ogp/default-ogp.png"],
  },
  alternates: {
    canonical:
      "https://diy-shelf-maker.kuras-plus.com/tools/smart-home-power-calc",
  },
};

const FAQ_ITEMS = [
  {
    question: "スマートホームデバイスの電気代はどのくらいですか？",
    answer:
      "スマートプラグ1台（1W）を24時間稼働で月間約22円。10台でも月220円程度で、節電効果の方がはるかに大きいです。",
  },
  {
    question: "DIY棚にスマートデバイスを組み込むメリットは？",
    answer:
      "LED照明の自動点灯、スマートプラグでの家電管理、センサーで温湿度モニタリングなど多彩な活用が可能です。特にラブリコ棚なら配線を柱に沿わせてすっきり設置できます。",
  },
  {
    question: "電気料金単価の目安は？",
    answer:
      "2026年現在、日本の一般家庭は約28〜35円/kWhが目安です。電力会社・プランにより異なります。",
  },
  {
    question: "スマートデバイスの待機電力は無視できますか？",
    answer:
      "はい。多くのスマートデバイスの待機電力は0.5〜3W程度で、月10〜70円と非常に小さいです。節電効果と比べると無視できるレベルです。",
  },
  {
    question: "太陽光パネルとの組み合わせは？",
    answer:
      "小型ソーラーパネル（10W）とバッテリーで、屋外設置のIoTセンサーやカメラの電源を自給できます。ベランダDIY棚との相性も良いです。",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "スマートホーム電気代計算ツール",
    description:
      "スマートプラグ・スマート照明・IoTセンサーなど、スマートホームデバイスの電気代を自動計算。",
    url: "https://diy-shelf-maker.kuras-plus.com/tools/smart-home-power-calc",
    applicationCategory: "UtilitiesApplication",
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
          name: "スマートホーム電気代計算ツール",
          item: "https://diy-shelf-maker.kuras-plus.com/tools/smart-home-power-calc",
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

export default function SmartHomePowerCalcPage() {
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
            { name: "スマートホーム電気代計算ツール" },
          ]}
        />

        {/* ヒーローセクション */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-indigo-100 mb-10">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl">⚡</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
                スマートホーム電気代計算ツール
              </h1>
              <p className="mt-2 text-gray-600 leading-relaxed max-w-2xl">
                スマートプラグ・スマート照明・IoTセンサーなど、DIY棚に組み込むスマートデバイスの電気代を自動計算。
                月間・年間・10年間のランニングコストがすぐにわかります。
              </p>
            </div>
          </div>
        </section>

        {/* 計算ツール本体 */}
        <SmartHomePowerCalcClient />

        {/* 使い方ガイド */}
        <section className="mt-12 mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            使い方ガイド
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <h3 className="font-semibold text-gray-800 text-sm">
                  デバイスを選ぶ
                </h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                スマートプラグ・照明・リモコンなど7種類から選択。消費電力が自動入力されます。
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <h3 className="font-semibold text-gray-800 text-sm">
                  条件を設定
                </h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                稼働時間・台数・電気料金単価を入力。カスタム入力なら消費電力も自由に設定できます。
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <h3 className="font-semibold text-gray-800 text-sm">
                  結果を確認
                </h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                月間・年間・10年間の電気代とkWhを自動計算。DIY棚への設置コストの目安に。
              </p>
            </div>
          </div>
        </section>

        {/* DIY棚 × スマートホーム活用例 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            DIY棚 × スマートホーム活用例
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-amber-50 rounded-xl border border-amber-100 p-5">
              <h3 className="font-semibold text-gray-800 text-sm mb-2">
                ラブリコ棚 + LEDテープ + スマートプラグ
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                ラブリコ棚にLEDテープライトを設置し、スマートプラグで自動ON/OFF。
                帰宅時に自動点灯する間接照明棚を月わずか約30円で実現。
              </p>
            </div>
            <div className="bg-amber-50 rounded-xl border border-amber-100 p-5">
              <h3 className="font-semibold text-gray-800 text-sm mb-2">
                本棚 + ネットワークカメラで蔵書管理
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                DIY本棚にネットワークカメラを設置して蔵書を管理。
                8Wのカメラを24時間稼働しても月約178円と低コスト。
              </p>
            </div>
          </div>
        </section>

        {/* おすすめスマートデバイス */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            DIY棚におすすめのスマートデバイス
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href={buildAmazonUrl("スマートプラグ 消費電力モニター")}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              <p className="text-2xl mb-2">🔌</p>
              <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors text-sm">
                スマートプラグ（消費電力モニター付き）
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                家電の消費電力を計測しながらスマホで遠隔操作。棚照明の自動化に最適。
              </p>
              <span className="mt-2 inline-block text-xs text-indigo-600 group-hover:text-indigo-700">
                Amazonで探す →
              </span>
            </a>
            <a
              href={buildAmazonUrl("スマート LED テープライト")}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              <p className="text-2xl mb-2">💡</p>
              <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors text-sm">
                スマートLEDテープライト
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                棚板の裏面に貼るだけで間接照明に。スマホで色や明るさを調整可能。
              </p>
              <span className="mt-2 inline-block text-xs text-indigo-600 group-hover:text-indigo-700">
                Amazonで探す →
              </span>
            </a>
            <a
              href={buildAmazonUrl("SwitchBot スマートリモコン")}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              <p className="text-2xl mb-2">📡</p>
              <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors text-sm">
                スマートリモコン（SwitchBot等）
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                棚に設置して家中の赤外線リモコンをスマホ1台に集約。待機電力わずか2W。
              </p>
              <span className="mt-2 inline-block text-xs text-indigo-600 group-hover:text-indigo-700">
                Amazonで探す →
              </span>
            </a>
            <a
              href={buildAmazonUrl("ネットワークカメラ 室内")}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              <p className="text-2xl mb-2">📷</p>
              <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors text-sm">
                ネットワークカメラ（室内用）
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                DIY棚の上段に設置してペット見守りや防犯に。外出先からスマホで確認。
              </p>
              <span className="mt-2 inline-block text-xs text-indigo-600 group-hover:text-indigo-700">
                Amazonで探す →
              </span>
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            よくある質問
          </h2>
          <FaqAccordion items={FAQ_ITEMS} />
        </section>

        {/* 関連ページ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-5">関連ページ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
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
            </Link>
            <Link
              href="/tools/material-cost-estimator"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              <p className="text-2xl mb-2">💰</p>
              <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors text-sm">
                費用見積もりツール
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                木材・金具・ネジの費用を一括算出
              </p>
            </Link>
            <Link
              href="/tools/wood-cut-calculator"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              <p className="text-2xl mb-2">🪚</p>
              <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors text-sm">
                木材カット計算ツール
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                天井高とアジャスターからカット寸法を自動算出
              </p>
            </Link>
            <Link
              href="/howto/labrico-vs-diawall"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              <p className="text-2xl mb-2">⚖️</p>
              <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors text-sm">
                ラブリコ vs ディアウォール比較
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                固定方式・耐荷重・価格の違いを徹底解説
              </p>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
