import type { Metadata } from "next";
import Link from "next/link";
import { HOWTO_ARTICLES } from "@/data/howto-articles";

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

      {/* CTA */}
      <div className="mt-12 text-center bg-amber-50 rounded-xl p-8">
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
