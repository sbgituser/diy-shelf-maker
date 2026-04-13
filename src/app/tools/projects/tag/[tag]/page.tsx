import { DIY_PROJECTS, ALL_TAGS } from "@/data/projects";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import ProjectFilter from "@/components/tools/ProjectFilter";

export function generateStaticParams() {
  return ALL_TAGS.map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  if (!ALL_TAGS.includes(tag)) return {};

  const projects = DIY_PROJECTS.filter((p) => p.tags.includes(tag));

  return {
    title: `「${tag}」のDIY棚プロジェクト${projects.length}選【設計図・材料リスト付き】`,
    description: `「${tag}」に関連するDIY棚プロジェクト${projects.length}件。設計図・材料リスト・工程・費用概算を掲載。初心者でも作れる棚のDIYプランを検索・比較できます。`,
    openGraph: {
      title: `「${tag}」のDIY棚プロジェクト${projects.length}選 | DIY棚メーカー`,
      description: `「${tag}」に関連するDIY棚プロジェクトを掲載。設計図・材料リスト・費用概算付き。`,
      type: "website",
      locale: "ja_JP",
      url: `https://diy-shelf-maker.kuras-plus.com/tools/projects/tag/${encodeURIComponent(tag)}`,
      siteName: "DIY棚メーカー by kuras-plus",
      images: [{ url: "/ogp/default-ogp.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/ogp/default-ogp.png"],
    },
    alternates: {
      canonical: `https://diy-shelf-maker.kuras-plus.com/tools/projects/tag/${encodeURIComponent(tag)}`,
    },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  if (!ALL_TAGS.includes(tag)) notFound();

  const projects = DIY_PROJECTS.filter((p) => p.tags.includes(tag));

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb
        items={[
          { name: "ホーム", href: "/" },
          { name: "ツール一覧", href: "/tools" },
          { name: "プロジェクト一覧", href: "/tools/projects" },
          { name: `「${tag}」` },
        ]}
      />

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-100 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          「{tag}」のDIY棚プロジェクト
        </h1>
        <p className="mt-2 text-gray-600">
          「{tag}」に該当するDIY棚プロジェクト{projects.length}
          件を掲載しています。設計図・材料リスト・工程を無料で閲覧できます。
        </p>
      </div>

      <ProjectFilter projects={projects} initialTag={tag} />
    </div>
  );
}
