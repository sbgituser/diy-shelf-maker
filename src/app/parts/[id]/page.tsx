import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import FaqAccordion from "@/components/FaqAccordion";
import { PART_CATEGORY_MAP } from "@/data/part-categories";
import { PARTS_DICTIONARY, PARTS_DICTIONARY_MAP } from "@/data/parts-dictionary";
import { buildAmazonUrl } from "@/data/products";

export function generateStaticParams() {
  return PARTS_DICTIONARY.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const part = PARTS_DICTIONARY_MAP[id];
  if (!part) return {};

  const title = `${part.name}｜仕様・耐荷重・価格｜DIY棚パーツ辞典`;
  const description = `${part.name}（${part.nameEn}）の仕様・耐荷重・価格を徹底解説。${part.description} DIY棚の部材選びの参考に。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ja_JP",
      url: `https://diy-shelf-maker.kuras-plus.com/parts/${id}`,
      siteName: "DIY棚シミュレーター by kuras-plus",
    },
    alternates: {
      canonical: `https://diy-shelf-maker.kuras-plus.com/parts/${id}`,
    },
  };
}

const difficultyLabel: Record<string, string> = {
  beginner: "初心者向け",
  intermediate: "中級者向け",
  advanced: "上級者向け",
};

const difficultyColor: Record<string, string> = {
  beginner: "bg-green-100 text-green-700 border-green-200",
  intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
  advanced: "bg-red-100 text-red-700 border-red-200",
};

export default async function PartDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const part = PARTS_DICTIONARY_MAP[id];
  if (!part) notFound();

  const cat = PART_CATEGORY_MAP[part.category];
  const relatedParts = part.relatedParts
    .map((rid) => PARTS_DICTIONARY_MAP[rid])
    .filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: part.name,
    description: part.description,
    url: `https://diy-shelf-maker.kuras-plus.com/parts/${part.id}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "JPY",
      price: part.priceRange,
      availability: "https://schema.org/InStock",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: part.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: "https://diy-shelf-maker.kuras-plus.com" },
      { "@type": "ListItem", position: 2, name: "パーツ辞典", item: "https://diy-shelf-maker.kuras-plus.com/parts" },
      { "@type": "ListItem", position: 3, name: cat?.name ?? part.category, item: `https://diy-shelf-maker.kuras-plus.com/parts/category/${cat?.slug ?? part.category}` },
      { "@type": "ListItem", position: 4, name: part.name, item: `https://diy-shelf-maker.kuras-plus.com/parts/${part.id}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <article className="max-w-3xl mx-auto">
        {/* 1. パンくずリスト */}
        <Breadcrumb
          items={[
            { name: "ホーム", href: "/" },
            { name: "パーツ辞典", href: "/parts" },
            { name: cat?.name ?? part.category, href: `/parts/category/${cat?.slug ?? part.category}` },
            { name: part.name },
          ]}
        />

        {/* 2. パーツ名 + カテゴリバッジ + 難易度バッジ */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-100 mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {cat && (
              <Link
                href={`/parts/category/${cat.slug}`}
                className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-amber-200 rounded-full text-xs font-medium text-amber-700 hover:bg-amber-50 transition-colors"
              >
                <span>{cat.icon}</span>
                {cat.name}
              </Link>
            )}
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${difficultyColor[part.difficulty]}`}
            >
              {difficultyLabel[part.difficulty]}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight mb-2">
            {part.name}
          </h1>
          <p className="text-sm text-gray-500 mb-4">{part.nameEn}</p>

          {/* 3. 概要テキスト */}
          <p className="text-gray-700 leading-relaxed">{part.description}</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <span className="text-sm text-gray-600">
              参考価格: <span className="font-semibold text-amber-700">{part.priceRange}</span>
            </span>
          </div>
        </div>

        {/* 4. スペック表 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">スペック・仕様</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {part.specs.map((spec, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 w-1/3">
                      {spec.label}
                    </th>
                    <td className="px-4 py-3 text-gray-600">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 5. 詳細説明 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {part.name}について詳しく
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-gray-700 leading-relaxed">{part.details}</p>
          </div>
        </section>

        {/* 6. 主な用途 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">主な用途</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <ul className="space-y-3">
              {part.useCases.map((useCase, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <span className="text-amber-500 mt-0.5 text-lg">●</span>
                  <span className="leading-relaxed">{useCase}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 7. 使用上のコツ */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">使用上のコツ・注意点</h2>
          <div className="bg-amber-50 rounded-xl border border-amber-100 p-5">
            <ul className="space-y-3">
              {part.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <span className="text-amber-600 mt-0.5">💡</span>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 8. FAQ（アコーディオン） */}
        {part.faq.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {part.name}のよくある質問
            </h2>
            <FaqAccordion items={part.faq} />
          </section>
        )}

        {/* 9. 関連パーツ */}
        {relatedParts.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">関連パーツ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedParts.map((rp) => {
                if (!rp) return null;
                const rpCat = PART_CATEGORY_MAP[rp.category];
                return (
                  <Link
                    key={rp.id}
                    href={`/parts/${rp.id}`}
                    className="bg-white rounded-xl border border-gray-200 p-4 hover:border-amber-300 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {rpCat && <span className="text-lg">{rpCat.icon}</span>}
                      <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors text-sm leading-tight">
                        {rp.name}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {rp.description}
                    </p>
                    <p className="mt-2 text-xs text-amber-600 font-medium">
                      詳しく見る →
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* 10. Amazon 検索ボタン */}
        <section className="mb-8">
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 sm:p-8 text-white text-center">
            <h2 className="text-lg font-bold mb-2">Amazonで{part.name}を探す</h2>
            <p className="text-amber-100 text-sm mb-4">
              最新の価格・レビューをAmazonでチェック
            </p>
            <a
              href={buildAmazonUrl(part.amazonKeyword)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-amber-600 font-bold rounded-lg hover:bg-amber-50 transition-colors"
            >
              Amazonで検索する
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <p className="mt-3 text-xs text-amber-200">
              ※ Amazonアソシエイトプログラムを利用しています
            </p>
          </div>
        </section>

        {/* ナビゲーション */}
        <div className="flex flex-wrap gap-3 justify-between">
          {cat && (
            <Link
              href={`/parts/category/${cat.slug}`}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:border-amber-300 transition-colors text-sm"
            >
              ← {cat.name}一覧へ
            </Link>
          )}
          <Link
            href="/parts"
            className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-700 font-medium rounded-lg hover:bg-amber-200 transition-colors text-sm"
          >
            パーツ辞典トップへ →
          </Link>
        </div>
      </article>
    </>
  );
}
