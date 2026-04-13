import Link from "next/link";
import type { DIYProject } from "@/types";

const DIFFICULTY_LABELS = ["", "★ 超初心者", "★★ 初心者", "★★★ 中級", "★★★★ 上級", "★★★★★ 達人"];
const DIFFICULTY_COLORS = [
  "",
  "text-green-600 bg-green-50",
  "text-emerald-600 bg-emerald-50",
  "text-amber-600 bg-amber-50",
  "text-orange-600 bg-orange-50",
  "text-red-600 bg-red-50",
];

export default function ProjectCard({ project }: { project: DIYProject }) {
  return (
    <Link
      href={`/tools/projects/${project.id}`}
      className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-amber-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-bold text-gray-800 leading-snug">
          {project.title}
        </h3>
        <span
          className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[project.difficulty]}`}
        >
          {DIFFICULTY_LABELS[project.difficulty]}
        </span>
      </div>

      <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-2">
        {project.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
        <span>約 {project.estimatedCost.toLocaleString()}円</span>
        <span>{project.estimatedTime}</span>
        <span>
          {project.dimensions.w}×{project.dimensions.h}×{project.dimensions.d}cm
        </span>
      </div>
    </Link>
  );
}
