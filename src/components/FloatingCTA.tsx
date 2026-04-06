"use client";

interface Props {
  total: number;
  visible: boolean;
}

export default function FloatingCTA({ total, visible }: Props) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-2 gap-3 h-12">
        <span className="text-sm text-gray-700 truncate">
          概算費用 <strong className="text-amber-700 font-mono">¥{total.toLocaleString()}</strong>
        </span>
        <button
          type="button"
          onClick={() => {
            document.getElementById("parts-list")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded transition-colors flex-shrink-0"
        >
          🛒 部材を購入する →
        </button>
      </div>
    </div>
  );
}
