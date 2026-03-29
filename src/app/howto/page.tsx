import type { Metadata } from "next";
import Link from "next/link";
import { HOWTO_ARTICLES, type HowtoArticle } from "@/data/howto-articles";
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
    images: [{ url: "/ogp/howto-list.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ogp/howto-list.png"],
  },
  alternates: {
    canonical: "https://diy-shelf-maker.kuras-plus.com/howto",
  },
};

function getCategory(article: HowtoArticle): string {
  const text = [article.slug, article.title, ...article.keywords].join(" ");
  if (/beginner|初心者|入門/.test(text)) return "初心者向け";
  if (/比較|vs-diawall|labrico-vs/.test(text)) return "アジャスター選び";
  if (/kitchen|キッチン|調味料/.test(text)) return "キッチン";
  if (/shoe|シューズ|靴|entrance|玄関/.test(text)) return "玄関";
  if (/desk|デスク/.test(text)) return "デスク・書斎";
  if (/closet|クローゼット|押入れ/.test(text)) return "クローゼット";
  if (/laundry|ランドリー|洗濯|洗面/.test(text)) return "洗面所・ランドリー";
  if (/kids|子供|絵本|cat|猫/.test(text)) return "子供部屋・ペット";
  if (/garage|ガレージ|物置/.test(text)) return "ガレージ・物置";
  if (/balcony|ベランダ|plant|グリーン/.test(text)) return "ベランダ・屋外";
  if (/賃貸|rental|no-hole|pegboard|wall-storage|収納/.test(text)) return "収納・壁面";
  return "DIYノウハウ";
}

const CATEGORY_ORDER = [
  "初心者向け",
  "アジャスター選び",
  "収納・壁面",
  "キッチン",
  "玄関",
  "デスク・書斎",
  "クローゼット",
  "洗面所・ランドリー",
  "子供部屋・ペット",
  "ベランダ・屋外",
  "ガレージ・物置",
  "DIYノウハウ",
];

export default function HowtoListPage() {
  // カテゴリ別グルーピング
  const grouped = new Map<string, HowtoArticle[]>();
  for (const article of HOWTO_ARTICLES) {
    const cat = getCategory(article);
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(article);
  }
  // 定義順で並べ、残りは末尾
  const orderedCategories = [
    ...CATEGORY_ORDER.filter((c) => grouped.has(c)),
    ...[...grouped.keys()].filter((c) => !CATEGORY_ORDER.includes(c)),
  ];

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

      {/* カテゴリ別記事一覧 */}
      <div className="space-y-10">
        {orderedCategories.map((category) => {
          const articles = grouped.get(category)!;
          return (
            <section key={category}>
              <h2 className="text-base font-bold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                {category}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {articles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/howto/${article.slug}`}
                    className="group block bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-amber-300 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl flex-shrink-0">{article.icon}</span>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                          {article.title}
                        </h3>
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
            </section>
          );
        })}
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
