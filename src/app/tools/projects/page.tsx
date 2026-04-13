import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import ProjectFilter from "@/components/tools/ProjectFilter";
import { DIY_PROJECTS } from "@/data/projects";
import Link from "next/link";
import { ROOM_TYPE_LABELS } from "@/types";
import type { RoomType } from "@/types";

export const metadata: Metadata = {
  title: "DIY棚プロジェクト50選【設計図・材料リスト付き】部屋別・難易度別で検索",
  description:
    "DIY棚・収納家具のプロジェクト50件以上を部屋タイプ×難易度×予算で検索。各プロジェクトには設計図・材料リスト・工程・費用概算を掲載。賃貸OK・100均活用・GW向けなど条件で絞り込み可能。",
  keywords: [
    "DIY 棚 設計図",
    "棚 DIY 初心者",
    "本棚 DIY 作り方",
    "賃貸 棚 DIY",
    "ラブリコ 棚 作り方",
    "GW DIY 棚",
    "週末 DIY 初心者",
  ],
  openGraph: {
    title: "DIY棚プロジェクト50選【設計図・材料リスト付き】| DIY棚メーカー",
    description:
      "部屋タイプ×難易度×予算でDIY棚プロジェクトを検索。設計図・材料リスト・工程・費用概算を掲載。",
    type: "website",
    locale: "ja_JP",
    url: "https://diy-shelf-maker.kuras-plus.com/tools/projects",
    siteName: "DIY棚メーカー by kuras-plus",
    images: [{ url: "/ogp/default-ogp.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ogp/default-ogp.png"],
  },
  alternates: {
    canonical: "https://diy-shelf-maker.kuras-plus.com/tools/projects",
  },
};

const roomTypes: RoomType[] = [
  "1r", "1k", "1ldk", "family", "kids", "kitchen", "entrance", "workspace",
];

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "DIY棚プロジェクトデータベース",
  description:
    "DIY棚・収納家具のプロジェクト50件以上を部屋タイプ×難易度×予算で検索。",
  url: "https://diy-shelf-maker.kuras-plus.com/tools/projects",
  numberOfItems: DIY_PROJECTS.length,
};

export default function ProjectsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <Breadcrumb
        items={[
          { name: "ホーム", href: "/" },
          { name: "ツール一覧", href: "/tools" },
          { name: "プロジェクト一覧" },
        ]}
      />

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-100 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          DIY棚プロジェクト {DIY_PROJECTS.length}選
        </h1>
        <p className="mt-2 text-gray-600">
          部屋タイプ・難易度・予算からぴったりのDIY棚プロジェクトを見つけましょう。
          設計図・材料リスト・工程を無料で閲覧できます。
        </p>
      </div>

      {/* 部屋タイプ別リンク */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-3">
          部屋タイプから探す
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {roomTypes.map((rt) => {
            const count = DIY_PROJECTS.filter((p) => p.roomType === rt).length;
            return (
              <Link
                key={rt}
                href={`/tools/projects/room/${rt}`}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-amber-300 hover:shadow-sm transition-all"
              >
                <span className="text-sm font-medium text-gray-700">
                  {ROOM_TYPE_LABELS[rt]}
                </span>
                <span className="text-xs text-gray-400">{count}件</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* フィルタ付き一覧 */}
      <ProjectFilter projects={DIY_PROJECTS} />
    </div>
  );
}
