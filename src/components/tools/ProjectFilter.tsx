"use client";

import { useState, useMemo } from "react";
import type { DIYProject, RoomType } from "@/types";
import { ROOM_TYPE_LABELS } from "@/types";
import ProjectCard from "./ProjectCard";

interface Props {
  projects: DIYProject[];
  initialRoomType?: RoomType;
  initialTag?: string;
}

export default function ProjectFilter({
  projects,
  initialRoomType,
  initialTag,
}: Props) {
  const [roomType, setRoomType] = useState<RoomType | "">(initialRoomType || "");
  const [difficulty, setDifficulty] = useState<number>(0);
  const [maxCost, setMaxCost] = useState<number>(0);
  const [tag, setTag] = useState<string>(initialTag || "");
  const [search, setSearch] = useState("");

  const allTags = useMemo(
    () => [...new Set(projects.flatMap((p) => p.tags))].sort(),
    [projects]
  );

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (roomType && p.roomType !== roomType) return false;
      if (difficulty && p.difficulty !== difficulty) return false;
      if (maxCost && p.estimatedCost > maxCost) return false;
      if (tag && !p.tags.includes(tag)) return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack = `${p.title} ${p.description} ${p.tags.join(" ")} ${p.seoKeywords.join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [projects, roomType, difficulty, maxCost, tag, search]);

  const roomTypes: RoomType[] = [
    "1r", "1k", "1ldk", "family", "kids", "kitchen", "entrance", "workspace",
  ];

  return (
    <div>
      {/* 検索バー */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="キーワードで検索（例: 本棚、賃貸、ラブリコ）"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
        />
      </div>

      {/* フィルタ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <select
          value={roomType}
          onChange={(e) => setRoomType(e.target.value as RoomType | "")}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
        >
          <option value="">部屋タイプ</option>
          {roomTypes.map((rt) => (
            <option key={rt} value={rt}>
              {ROOM_TYPE_LABELS[rt]}
            </option>
          ))}
        </select>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
        >
          <option value={0}>難易度</option>
          <option value={1}>★ 超初心者</option>
          <option value={2}>★★ 初心者</option>
          <option value={3}>★★★ 中級</option>
          <option value={4}>★★★★ 上級</option>
          <option value={5}>★★★★★ 達人</option>
        </select>

        <select
          value={maxCost}
          onChange={(e) => setMaxCost(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
        >
          <option value={0}>予算</option>
          <option value={3000}>〜3,000円</option>
          <option value={5000}>〜5,000円</option>
          <option value={10000}>〜10,000円</option>
          <option value={15000}>〜15,000円</option>
          <option value={20000}>〜20,000円</option>
          <option value={30000}>〜30,000円</option>
        </select>

        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
        >
          <option value="">タグ</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* 件数 */}
      <p className="text-sm text-gray-500 mb-4">
        {filtered.length}件のプロジェクト
      </p>

      {/* 結果 */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">該当するプロジェクトがありません</p>
          <p className="text-sm">フィルタ条件を変更してお試しください</p>
        </div>
      )}
    </div>
  );
}
