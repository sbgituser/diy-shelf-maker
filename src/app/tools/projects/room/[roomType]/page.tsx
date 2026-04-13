import { DIY_PROJECTS } from "@/data/projects";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import ProjectFilter from "@/components/tools/ProjectFilter";
import { ROOM_TYPE_LABELS, ROOM_TYPE_DESCRIPTIONS } from "@/types";
import type { RoomType } from "@/types";

const ROOM_TYPES: RoomType[] = [
  "1r", "1k", "1ldk", "family", "kids", "kitchen", "entrance", "workspace",
];

export function generateStaticParams() {
  return ROOM_TYPES.map((roomType) => ({ roomType }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ roomType: string }>;
}): Promise<Metadata> {
  const { roomType } = await params;
  if (!ROOM_TYPES.includes(roomType as RoomType)) return {};

  const label = ROOM_TYPE_LABELS[roomType as RoomType];
  const projects = DIY_PROJECTS.filter((p) => p.roomType === roomType);

  return {
    title: `${label}向けDIY棚プロジェクト${projects.length}選【設計図・材料リスト付き】`,
    description: ROOM_TYPE_DESCRIPTIONS[roomType as RoomType],
    openGraph: {
      title: `${label}向けDIY棚プロジェクト${projects.length}選 | DIY棚メーカー`,
      description: ROOM_TYPE_DESCRIPTIONS[roomType as RoomType],
      type: "website",
      locale: "ja_JP",
      url: `https://diy-shelf-maker.kuras-plus.com/tools/projects/room/${roomType}`,
      siteName: "DIY棚メーカー by kuras-plus",
      images: [{ url: "/ogp/default-ogp.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/ogp/default-ogp.png"],
    },
    alternates: {
      canonical: `https://diy-shelf-maker.kuras-plus.com/tools/projects/room/${roomType}`,
    },
  };
}

export default async function RoomTypePage({
  params,
}: {
  params: Promise<{ roomType: string }>;
}) {
  const { roomType } = await params;
  if (!ROOM_TYPES.includes(roomType as RoomType)) notFound();

  const rt = roomType as RoomType;
  const projects = DIY_PROJECTS.filter((p) => p.roomType === rt);
  const label = ROOM_TYPE_LABELS[rt];

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb
        items={[
          { name: "ホーム", href: "/" },
          { name: "ツール一覧", href: "/tools" },
          { name: "プロジェクト一覧", href: "/tools/projects" },
          { name: `${label}向け` },
        ]}
      />

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-100 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {label}向けDIY棚プロジェクト
        </h1>
        <p className="mt-2 text-gray-600">
          {ROOM_TYPE_DESCRIPTIONS[rt]}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          {projects.length}件のプロジェクト
        </p>
      </div>

      <ProjectFilter projects={projects} initialRoomType={rt} />
    </div>
  );
}
