import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { PART_CATEGORIES, PART_CATEGORY_MAP } from "@/data/part-categories";
import { PARTS_BY_CATEGORY } from "@/data/parts-dictionary";

export function generateStaticParams() {
  return PART_CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = PART_CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return {};

  const title = `${cat.name}の種類と選び方｜DIYパーツ辞典`;
  const description = `${cat.name}（${cat.nameEn}）の種類と選び方を徹底解説。${cat.description}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ja_JP",
      url: `https://diy-shelf-maker.kuras-plus.com/parts/category/${slug}`,
      siteName: "DIY棚シミュレーター by kuras-plus",
    },
    alternates: {
      canonical: `https://diy-shelf-maker.kuras-plus.com/parts/category/${slug}`,
    },
  };
}

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

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = PART_CATEGORIES.find((c) => c.slug === slug);
  if (!cat) notFound();

  const parts = PARTS_BY_CATEGORY[cat.id] ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cat.name}の種類と選び方`,
    description: cat.description,
    url: `https://diy-shelf-maker.kuras-plus.com/parts/category/${slug}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://diy-shelf-maker.kuras-plus.com" },
        { "@type": "ListItem", position: 2, name: "パーツ辞典", item: "https://diy-shelf-maker.kuras-plus.com/parts" },
        { "@type": "ListItem", position: 3, name: cat.name, item: `https://diy-shelf-maker.kuras-plus.com/parts/category/${slug}` },
      ],
    },
  };

  // suppress unused variable warning
  void PART_CATEGORY_MAP;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto">
        <Breadcrumb
          items={[
            { name: "ホーム", href: "/" },
            { name: "パーツ辞典", href: "/parts" },
            { name: cat.name },
          ]}
        />

        {/* ヘッダー */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-100 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{cat.icon}</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
                {cat.name}の種類と選び方
              </h1>
              <p className="text-sm text-gray-500 mt-1">{cat.nameEn}</p>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed mt-3">
            {cat.description}
          </p>
          <p className="mt-3 text-sm font-medium text-amber-700">
            {parts.length}パーツを掲載
          </p>
        </section>

        {/* パーツ一覧 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            {cat.name}のパーツ一覧
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {parts.map((part) => (
              <Link
                key={part.id}
                href={`/parts/${part.id}`}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:border-amber-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-bold text-gray-800 group-hover:text-amber-600 transition-colors text-base leading-tight">
                    {part.name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${difficultyColor[part.difficulty]}`}
                  >
                    {difficultyLabel[part.difficulty]}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  {part.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="text-amber-600 font-medium">
                    参考価格: {part.priceRange}
                  </span>
                  <span className="text-amber-500 group-hover:translate-x-1 transition-transform inline-block">
                    詳しく見る →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 他のカテゴリへのリンク */}
        <section className="mt-12">
          <h2 className="text-lg font-bold text-gray-800 mb-4">他のカテゴリも見る</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PART_CATEGORIES.filter((c) => c.id !== cat.id).map((c) => (
              <Link
                key={c.id}
                href={`/parts/category/${c.slug}`}
                className="bg-white rounded-lg border border-gray-200 p-3 text-center hover:border-amber-300 hover:shadow-sm transition-all group"
              >
                <div className="text-2xl mb-1">{c.icon}</div>
                <p className="text-xs font-medium text-gray-700 group-hover:text-amber-600 transition-colors leading-tight">
                  {c.name}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* パーツ辞典TOPへ */}
        <div className="mt-8 text-center">
          <Link
            href="/parts"
            className="inline-flex items-center px-5 py-2.5 bg-amber-100 text-amber-700 font-medium rounded-lg hover:bg-amber-200 transition-colors text-sm"
          >
            ← パーツ辞典トップへ戻る
          </Link>
        </div>
      </div>
    </>
  );
}
