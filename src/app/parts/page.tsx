import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { PART_CATEGORIES } from "@/data/part-categories";
import { PARTS_DICTIONARY, PARTS_BY_CATEGORY } from "@/data/parts-dictionary";

export const metadata: Metadata = {
  title: "DIYパーツ辞典｜突っ張り棚の材料・金具・工具を徹底解説",
  description:
    "突っ張り棚DIYに使うパーツを徹底解説。ラブリコ・ディアウォール等のアジャスター、SPF材、棚板、棚受け金具、ネジ、塗料、工具まで8カテゴリ37パーツをわかりやすく紹介します。",
  keywords: [
    "DIY パーツ 辞典",
    "突っ張り棚 材料",
    "ラブリコ ディアウォール 違い",
    "2×4材 棚板 種類",
    "棚受け金具 選び方",
    "DIY 工具 初心者",
    "木材 塗装 ワトコオイル",
  ],
  openGraph: {
    title: "DIYパーツ辞典｜突っ張り棚の材料・金具・工具を徹底解説",
    description:
      "突っ張り棚DIYに使うパーツを8カテゴリ37パーツで徹底解説。選び方・使い方・FAQ付き。",
    type: "website",
    locale: "ja_JP",
    url: "https://diy-shelf-maker.kuras-plus.com/parts",
    siteName: "DIY棚シミュレーター by kuras-plus",
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
      </div>
    </>
  );
}
