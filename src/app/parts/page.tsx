import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { PART_CATEGORIES } from "@/data/part-categories";
import { PARTS_DICTIONARY, PARTS_BY_CATEGORY } from "@/data/parts-dictionary";
import { HOWTO_ARTICLES } from "@/data/howto-articles";

export const metadata: Metadata = {
  title: "DIY棚パーツ辞典【2026年版】材料・金具37種の選び方を徹底解説",
  description:
    "DIY棚の材料・金具を8カテゴリ37パーツで徹底解説。ラブリコ・ディアウォール等のアジャスター、2×4材、棚板、棚受け金具の選び方がわかるパーツ辞典。部材選びに迷ったらまずチェック。",
  keywords: [
    "DIY パーツ 辞典",
    "突っ張り棚 材料",
    "ラブリコ ディアウォール 違い",
    "2×4材 棚板 種類",
    "棚受け金具 選び方",
    "DIY 初心者 工具 おすすめ",
    "木材 塗装 ワトコオイル",
  ],
  openGraph: {
    title: "DIY棚パーツ辞典【2026年版】材料・金具37種の選び方を徹底解説 | DIY棚メーカー",
    description:
      "DIY棚の材料・金具を8カテゴリ37パーツで徹底解説。ラブリコ・ディアウォール等のアジャスター、2×4材、棚板、棚受け金具の選び方がわかるパーツ辞典。",
    type: "website",
    locale: "ja_JP",
    url: "https://diy-shelf-maker.kuras-plus.com/parts",
    siteName: "DIY棚メーカー by kuras-plus",
    images: [{ url: "/ogp/default-ogp.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ogp/default-ogp.png"],
  },
  alternates: {
    canonical: "https://diy-shelf-maker.kuras-plus.com/parts",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "DIYパーツ辞典",
  description:
    "突っ張り棚DIYに使うパーツを8カテゴリ37パーツで徹底解説。選び方・使い方・FAQ付き。",
  url: "https://diy-shelf-maker.kuras-plus.com/parts",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: "https://diy-shelf-maker.kuras-plus.com" },
      { "@type": "ListItem", position: 2, name: "パーツ辞典", item: "https://diy-shelf-maker.kuras-plus.com/parts" },
    ],
  },
};

const difficultyLabel: Record<string, string> = {
  beginner: "初心者向け",
  intermediate: "中級者向け",
  advanced: "上級者向け",
};

const difficultyColor: Record<string, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-yellow-100 text-yellow-700",
  advanced: "bg-red-100 text-red-700",
};

export default function PartsPage() {
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
            { name: "パーツ辞典" },
          ]}
        />

        {/* ヒーローセクション */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-100 mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
            DIYパーツ辞典
          </h1>
          <p className="mt-3 text-gray-600 leading-relaxed max-w-2xl">
            突っ張り棚DIYに必要な材料・金具・工具を{PARTS_DICTIONARY.length}パーツ、
            {PART_CATEGORIES.length}カテゴリに分けて徹底解説。
            選び方・使い方・よくある質問まで初心者にもわかりやすく紹介します。
          </p>
        </section>

        {/* カテゴリカード一覧 */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-5">カテゴリから探す</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {PART_CATEGORIES.map((cat) => {
              const count = (PARTS_BY_CATEGORY[cat.id] ?? []).length;
              return (
                <Link
                  key={cat.id}
                  href={`/parts/category/${cat.slug}`}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:border-amber-300 hover:shadow-sm transition-all group"
                >
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors text-sm leading-tight">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {cat.description.slice(0, 40)}...
                  </p>
                  <p className="mt-2 text-xs font-medium text-amber-600">
                    {count}パーツ →
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* カテゴリ別 全パーツ一覧 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-5">パーツ一覧（カテゴリ別）</h2>
          <div className="space-y-10">
            {PART_CATEGORIES.map((cat) => {
              const parts = PARTS_BY_CATEGORY[cat.id] ?? [];
              if (parts.length === 0) return null;
              return (
                <div key={cat.id}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{cat.name}</h3>
                      <p className="text-xs text-gray-500">{cat.nameEn}</p>
                    </div>
                    <Link
                      href={`/parts/category/${cat.slug}`}
                      className="ml-auto text-xs text-amber-600 hover:text-amber-700 font-medium"
                    >
                      カテゴリページ →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {parts.map((part) => (
                      <Link
                        key={part.id}
                        href={`/parts/${part.id}`}
                        className="bg-white rounded-xl border border-gray-200 p-4 hover:border-amber-300 hover:shadow-sm transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors text-sm leading-tight">
                            {part.name}
                          </h4>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${difficultyColor[part.difficulty]}`}
                          >
                            {difficultyLabel[part.difficulty]}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                          {part.description}
                        </p>
                        <p className="mt-2 text-xs text-amber-600 font-medium">
                          参考価格: {part.priceRange}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 関連する作り方ガイド */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-5">パーツ選びに役立つガイド</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {HOWTO_ARTICLES.filter((a) =>
              a.keywords.some((kw) =>
                /アジャスター|ラブリコ|ディアウォール|木材|金具|工具|パーツ|材料/.test(kw)
              )
            ).slice(0, 4).map((a) => (
              <Link
                key={a.slug}
                href={`/howto/${a.slug}`}
                className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:border-amber-300 hover:shadow-sm transition-all group"
              >
                <span className="text-2xl flex-shrink-0">{a.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors text-sm">
                    {a.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {a.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 関連コンテンツへのクロスリンク */}
        <section className="mt-10 bg-gray-50 rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-bold text-gray-800 mb-3">
            あわせてチェック
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link
              href="/templates"
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-all"
            >
              <span className="text-2xl">📐</span>
              <div>
                <div className="font-semibold text-gray-800 text-sm">テンプレートから選ぶ</div>
                <div className="text-xs text-gray-500 mt-0.5">本棚・キッチン棚など12種のテンプレート</div>
              </div>
            </Link>
            <Link
              href="/howto"
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-all"
            >
              <span className="text-2xl">📖</span>
              <div>
                <div className="font-semibold text-gray-800 text-sm">作り方ガイドを読む</div>
                <div className="text-xs text-gray-500 mt-0.5">ラブリコ比較・賃貸DIY・初心者ガイドなど</div>
              </div>
            </Link>
            <Link
              href="/tools"
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-all"
            >
              <span className="text-2xl">🛠️</span>
              <div>
                <div className="font-semibold text-gray-800 text-sm">無料ツールを使う</div>
                <div className="text-xs text-gray-500 mt-0.5">耐荷重計算・費用見積もり・支柱比較</div>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
