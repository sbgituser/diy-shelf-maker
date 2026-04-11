import { FAQS, FAQ_CATEGORIES } from "@/data/faqs";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DIY棚のよくある質問30選【ラブリコ・ディアウォール・賃貸対応】",
  description:
    "DIY棚作りでよくある質問を30個厳選。ラブリコ・ディアウォール・耐荷重・賃貸・工具選びまで初心者の疑問に答えます。",
  keywords: [
    "DIY棚 初心者 何から",
    "ラブリコ 耐荷重 大丈夫",
    "ディアウォール ラブリコ 違い",
    "賃貸 DIY 棚 壁 傷つけない",
    "DIY棚 費用 いくら",
    "2×4材 とは",
    "ホームセンター 木材カット",
    "棚 グラつく 対策",
    "ラブリコ 賃貸 使える",
    "DIY棚 よくある質問",
  ],
  openGraph: {
    title: "DIY棚のよくある質問30選【ラブリコ・ディアウォール・賃貸対応】",
    description:
      "DIY棚作りでよくある質問を30個厳選。ラブリコ・ディアウォール・耐荷重・賃貸・工具選びまで初心者の疑問に答えます。",
    type: "website",
    locale: "ja_JP",
    url: "https://diy-shelf-maker.kuras-plus.com/faq",
    siteName: "DIY棚メーカー by kuras-plus",
    images: [{ url: "/ogp/default-ogp.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://diy-shelf-maker.kuras-plus.com/faq",
  },
};

const categoryOrder: (keyof typeof FAQ_CATEGORIES)[] = [
  "basic",
  "tool",
  "safety",
  "rental",
  "cost",
  "trouble",
];

// FAQPage JSON-LD 構造化データ
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.answer.replace(/<[^>]+>/g, ""),
    },
  })),
};

export default function FAQPage() {
  return (
    <>
      {/* JSON-LD 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-3xl mx-auto">
        {/* パンくずリスト */}
        <nav className="text-sm text-gray-500 mb-6" aria-label="パンくずリスト">
          <ol className="flex items-center gap-1">
            <li>
              <Link href="/" className="hover:text-amber-600 transition-colors">
                ホーム
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-800 font-medium">よくある質問</li>
          </ol>
        </nav>

        {/* ページヘッダー */}
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            DIY棚のよくある質問
            <span className="text-amber-600">30</span>選
          </h1>
          <p className="mt-3 text-gray-600 leading-relaxed">
            DIY棚作りの疑問を初心者向けにわかりやすく解説。ラブリコ・ディアウォールの選び方、耐荷重、賃貸での注意点、費用の目安まで幅広くカバーしています。
          </p>
        </header>

        {/* カテゴリナビゲーション */}
        <nav
          className="mb-8 flex flex-wrap gap-2"
          aria-label="カテゴリナビゲーション"
        >
          {categoryOrder.map((key) => {
            const cat = FAQ_CATEGORIES[key];
            return (
              <a
                key={key}
                href={`#${key}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-amber-300 hover:text-amber-700 transition-colors"
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </a>
            );
          })}
        </nav>

        {/* 検索案内 */}
        <div className="mb-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">🔍 質問を探すには：</span>
            キーボードの
            <kbd className="mx-1 px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">
              Ctrl
            </kbd>
            +
            <kbd className="mx-1 px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">
              F
            </kbd>
            （Macは
            <kbd className="mx-1 px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">
              ⌘
            </kbd>
            +
            <kbd className="mx-1 px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">
              F
            </kbd>
            ）でキーワード検索できます。
          </p>
        </div>

        {/* FAQ本体 */}
        <div className="space-y-10">
          {categoryOrder.map((key) => {
            const cat = FAQ_CATEGORIES[key];
            const items = FAQS.filter((f) => f.category === key);
            return (
              <section key={key} id={key}>
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                  <span>{cat.icon}</span>
                  {cat.label}
                  <span className="text-sm font-normal text-gray-400">
                    （{items.length}問）
                  </span>
                </h2>
                <div className="space-y-3">
                  {items.map((faq) => (
                    <details
                      key={faq.id}
                      className="group bg-white border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <summary className="flex items-start gap-3 px-5 py-4 cursor-pointer list-none hover:bg-amber-50/50 transition-colors [&::-webkit-details-marker]:hidden">
                        <span className="text-amber-500 font-bold flex-shrink-0 mt-0.5">
                          Q.
                        </span>
                        <span className="font-semibold text-gray-900 text-[15px] flex-1">
                          {faq.question}
                        </span>
                        <svg
                          className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5 transition-transform group-open:rotate-180"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </summary>
                      <div className="px-5 pb-4 pt-1">
                        <div className="flex items-start gap-3">
                          <span className="text-blue-500 font-bold flex-shrink-0">
                            A.
                          </span>
                          <p
                            className="text-gray-700 text-[15px] leading-relaxed [&_a]:text-amber-600 [&_a]:underline [&_a]:hover:text-amber-700"
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                          />
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-8 text-center text-white">
          <h2 className="text-xl font-bold">
            疑問が解決したら、さっそく設計してみませんか？
          </h2>
          <p className="mt-2 text-amber-100 text-sm">
            天井高を入力するだけ。カット寸法・材料リスト・設計図を無料で自動生成。
          </p>
          <Link
            href="/"
            className="inline-block mt-5 bg-white text-amber-600 font-bold px-7 py-3.5 rounded-lg hover:bg-amber-50 transition-colors shadow-sm text-base"
          >
            無料シミュレーターを試す →
          </Link>
        </div>

        {/* 関連ページリンク */}
        <div className="mt-10 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">関連ページ</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/howto"
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-all"
            >
              <span className="text-2xl flex-shrink-0">📖</span>
              <div>
                <span className="text-sm font-medium text-gray-700">作り方ガイド一覧</span>
                <p className="text-xs text-gray-500 mt-0.5">写真付きの詳しいDIY手順</p>
              </div>
            </Link>
            <Link
              href="/tools/shelf-load-calc"
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-all"
            >
              <span className="text-2xl flex-shrink-0">⚖️</span>
              <div>
                <span className="text-sm font-medium text-gray-700">耐荷重計算ツール</span>
                <p className="text-xs text-gray-500 mt-0.5">棚板の安全な荷重を計算</p>
              </div>
            </Link>
            <Link
              href="/parts"
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-all"
            >
              <span className="text-2xl flex-shrink-0">📚</span>
              <div>
                <span className="text-sm font-medium text-gray-700">パーツ辞典</span>
                <p className="text-xs text-gray-500 mt-0.5">37パーツの選び方・使い方</p>
              </div>
            </Link>
            <Link
              href="/tools/material-cost-estimator"
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-all"
            >
              <span className="text-2xl flex-shrink-0">💰</span>
              <div>
                <span className="text-sm font-medium text-gray-700">費用見積もりツール</span>
                <p className="text-xs text-gray-500 mt-0.5">材料費の概算を自動計算</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
