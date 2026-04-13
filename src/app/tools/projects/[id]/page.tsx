import { DIY_PROJECTS, PROJECT_MAP } from "@/data/projects";
import { buildAmazonUrl } from "@/data/products";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import AmazonProductLink from "@/components/tools/AmazonProductLink";
import { ROOM_TYPE_LABELS } from "@/types";

export function generateStaticParams() {
  return DIY_PROJECTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = PROJECT_MAP.get(id);
  if (!project) return {};

  const title = `${project.title}【設計図・材料リスト・費用】DIY棚の作り方`;
  const description = project.description.slice(0, 160);

  return {
    title,
    description,
    keywords: project.seoKeywords,
    openGraph: {
      title: `${title} | DIY棚メーカー`,
      description,
      type: "article",
      locale: "ja_JP",
      url: `https://diy-shelf-maker.kuras-plus.com/tools/projects/${id}`,
      siteName: "DIY棚メーカー by kuras-plus",
      images: [{ url: "/ogp/default-ogp.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/ogp/default-ogp.png"],
    },
    alternates: {
      canonical: `https://diy-shelf-maker.kuras-plus.com/tools/projects/${id}`,
    },
  };
}

const DIFFICULTY_LABELS = [
  "",
  "★ 超初心者向け",
  "★★ 初心者向け",
  "★★★ 中級者向け",
  "★★★★ 上級者向け",
  "★★★★★ 達人向け",
];

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = PROJECT_MAP.get(id);
  if (!project) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: project.title,
    description: project.description,
    totalTime: `PT${project.estimatedTime.replace(/[^0-9]/g, "")}H`,
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "JPY",
      value: project.estimatedCost,
    },
    step: project.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.description,
    })),
    supply: project.materials.map((m) => ({
      "@type": "HowToSupply",
      name: `${m.name} (${m.spec})`,
    })),
    tool: project.tools.map((t) => ({
      "@type": "HowToTool",
      name: t.name,
    })),
  };

  // 同じ部屋タイプの関連プロジェクト
  const relatedProjects = DIY_PROJECTS.filter(
    (p) => p.roomType === project.roomType && p.id !== project.id
  ).slice(0, 4);

  return (
    <div className="max-w-3xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb
        items={[
          { name: "ホーム", href: "/" },
          { name: "ツール一覧", href: "/tools" },
          { name: "プロジェクト一覧", href: "/tools/projects" },
          { name: project.title },
        ]}
      />

      {/* ヘッダー */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-100 mb-8">
        <div className="flex flex-wrap gap-2 mb-3">
          <Link
            href={`/tools/projects/room/${project.roomType}`}
            className="text-xs bg-white border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full hover:bg-amber-50 transition-colors"
          >
            {ROOM_TYPE_LABELS[project.roomType]}
          </Link>
          <span className="text-xs bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full">
            {DIFFICULTY_LABELS[project.difficulty]}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {project.title}
        </h1>
        <p className="mt-3 text-gray-600 leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* 基本情報 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <InfoCard label="概算費用" value={`約${project.estimatedCost.toLocaleString()}円`} />
        <InfoCard label="所要時間" value={project.estimatedTime} />
        <InfoCard
          label="完成サイズ"
          value={`${project.dimensions.w}×${project.dimensions.h}×${project.dimensions.d}cm`}
        />
        <InfoCard label="難易度" value={DIFFICULTY_LABELS[project.difficulty]} />
      </div>

      {/* タグ */}
      <div className="flex flex-wrap gap-2 mb-8">
        {project.tags.map((tag) => (
          <Link
            key={tag}
            href={`/tools/projects/tag/${encodeURIComponent(tag)}`}
            className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-amber-50 hover:text-amber-700 transition-colors"
          >
            {tag}
          </Link>
        ))}
      </div>

      {/* 材料リスト */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">材料リスト</h2>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  材料
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  規格
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">
                  数量
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">
                  単価
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">
                  小計
                </th>
              </tr>
            </thead>
            <tbody>
              {project.materials.map((m, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">
                    {m.amazonAsin ? (
                      <AmazonProductLink asin={m.amazonAsin}>
                        {m.name}
                      </AmazonProductLink>
                    ) : (
                      m.name
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{m.spec}</td>
                  <td className="px-4 py-3 text-right">{m.quantity}</td>
                  <td className="px-4 py-3 text-right">
                    ¥{m.unitPrice.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    ¥{(m.unitPrice * m.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-amber-50">
              <tr>
                <td colSpan={4} className="px-4 py-3 font-bold text-gray-800">
                  材料費合計
                </td>
                <td className="px-4 py-3 text-right font-bold text-amber-700">
                  ¥
                  {project.materials
                    .reduce((sum, m) => sum + m.unitPrice * m.quantity, 0)
                    .toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* 必要な工具 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">必要な工具</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {project.tools.map((tool, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3"
            >
              <span className="text-lg">
                {tool.optional ? "🔧" : "✅"}
              </span>
              <div>
                <span className="text-sm font-medium text-gray-800">
                  {tool.amazonKeyword ? (
                    <AmazonProductLink keyword={tool.amazonKeyword}>
                      {tool.name}
                    </AmazonProductLink>
                  ) : (
                    tool.name
                  )}
                </span>
                {tool.optional && (
                  <span className="ml-2 text-xs text-gray-400">
                    (あると便利)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 作り方（工程） */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">作り方</h2>
        <div className="space-y-4">
          {project.steps.map((step, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold text-sm shrink-0">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-gray-800">{step.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* おすすめ商品 */}
      {project.amazonProducts.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            おすすめ商品
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {project.amazonProducts.map((product, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-4"
              >
                <h3 className="font-medium text-gray-800 text-sm">
                  {product.name}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {product.description}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">
                    ¥{product.price.toLocaleString()}
                  </span>
                  <AmazonProductLink asin={product.asin}>
                    Amazonで見る →
                  </AmazonProductLink>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 関連ツールCTA */}
      <section className="mb-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 p-5">
        <h2 className="text-base font-bold text-gray-800 mb-3">
          このプロジェクトに役立つツール
        </h2>
        <div className="grid gap-2 sm:grid-cols-3">
          <Link
            href="/tools/strength-checker"
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-amber-300 transition-all text-sm"
          >
            <span>⚖️</span>
            <span className="font-medium text-gray-700">棚板強度チェッカー</span>
          </Link>
          <Link
            href="/tools/material-calculator"
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-amber-300 transition-all text-sm"
          >
            <span>🧮</span>
            <span className="font-medium text-gray-700">材料計算シミュレーター</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-amber-300 transition-all text-sm"
          >
            <span>📐</span>
            <span className="font-medium text-gray-700">棚エディタで設計</span>
          </Link>
        </div>
      </section>

      {/* 関連プロジェクト */}
      {relatedProjects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {ROOM_TYPE_LABELS[project.roomType]}の他のプロジェクト
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedProjects.map((rp) => (
              <Link
                key={rp.id}
                href={`/tools/projects/${rp.id}`}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-amber-300 hover:shadow-sm transition-all"
              >
                <h3 className="font-bold text-sm text-gray-800">{rp.title}</h3>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                  {rp.description}
                </p>
                <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                  <span>約{rp.estimatedCost.toLocaleString()}円</span>
                  <span>{rp.estimatedTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-sm font-bold text-gray-800">{value}</div>
    </div>
  );
}
