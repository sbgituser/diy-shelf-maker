import type { Metadata } from "next";
import Link from "next/link";
import { HOWTO_ARTICLES } from "@/data/howto-articles";
import { buildAmazonUrl } from "@/data/products";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "DIY棚の作り方ガイド一覧",
  description:
    "ラブリコ・ディアウォールの比較、賃貸での壁面収納、2×4材の本棚DIYなど、棚作りに役立つHow-to記事をまとめました。初心者から経験者まで使える実践ガイド。",
  keywords: [
    "DIY 棚 作り方",
    "ラブリコ 使い方",
    "ディアウォール 使い方",
    "壁面収納 DIY",
    "2×4 棚 作り方",
  ],
  openGraph: {
    title: "DIY棚の作り方ガイド一覧",
    description:
      "棚作りに役立つHow-to記事まとめ。ラブリコ・ディアウォール比較、賃貸OK壁面収納、木材カット計算方法など。",
    type: "website",
    locale: "ja_JP",
  },
  alternates: {
    canonical: "https://diy.kuras-plus.com/howto",
  },
};

export default function HowtoListPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* パンくずリスト */}
      <Breadcrumb
        items={[
          { name: "ホーム", href: "/" },
          { name: "作り方ガイド" },
        ]}
      />

      {/* ページヘッダー */}
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          DIY棚の作り方ガイド
        </h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          初心者から経験者まで使える実践的なDIYガイド。
          材料選びから組み立てまで、棚作りのノウハウを解説します。
        </p>
      </div>

      {/* 記事一覧 */}
      <div className="grid gap-6 sm:grid-cols-2">
        {HOWTO_ARTICLES.map((article) => (
          <Link
            key={article.slug}
            href={`/howto/${article.slug}`}
            className="group block bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-amber-300 transition-all"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl flex-shrink-0">{article.icon}</span>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                  {article.title}
                </h2>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {article.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {article.keywords.slice(0, 3).map((kw) => (
                    <span
                      key={kw}
                      className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Amazon材料CTA */}
      <div className="mt-10 bg-stone-50 border border-stone-200 rounded-xl p-6">
        <h2 className="text-base font-bold text-gray-800 mb-3">
          🛒 DIY棚の材料・工具をAmazonで揃える
        </h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            { keyword: "ラブリコ 2×4 アジャスター", label: "ラブリコ 2×4" },
            { keyword: "ディアウォール 2×4", label: "ディアウォール 2×4" },
            { keyword: "DIY 棚 材料 セット 2×4", label: "DIY棚 材料セット" },
            { keyword: "2×4 木材 SPF ホワイトウッド", label: "2×4材（SPF）" },
            { keyword: "電動ドライバー コードレス DIY 初心者", label: "電動ドライバー" },
            { keyword: "棚受け 金具 L字 DIY", label: "棚受け金具" },
          ].map((item) => (
            <a
              key={item.keyword}
              href={buildAmazonUrl(item.keyword)}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:border-amber-300 hover:text-amber-700 transition-all"
            >
              <span className="flex-shrink-0 text-amber-400">▸</span>
              {item.label}
            </a>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-400">※ Amazonアソシエイト・プログラムのリンクです</p>
      </div>

      {/* CTA */}
      <div className="mt-8 text-center bg-amber-50 rounded-xl p-8">
        <h2 className="text-lg font-bold text-gray-900">
          読んだら、すぐ設計してみよう
        </h2>
        <p className="mt-2 text-gray-600 text-sm">
          天井高を入力するだけで木材カット寸法・材料リストが自動生成されます
        </p>
        <Link
          href="/"
          className="inline-block mt-4 bg-amber-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors"
        >
          無料シミュレーターを使う →
        </Link>
      </div>
    </div>
  );
}
