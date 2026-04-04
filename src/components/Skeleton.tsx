/** GridEditor のスケルトンUI */
export function GridEditorSkeleton() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* ツールバー */}
      <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex gap-1.5">
          {[80, 100, 110].map((w, i) => (
            <div key={i} className="h-9 rounded-lg bg-gray-200 animate-skeleton" style={{ width: w }} />
          ))}
        </div>
        <div className="h-8 w-px bg-gray-200" />
        <div className="h-9 w-16 rounded-lg bg-gray-200 animate-skeleton" />
        <div className="h-9 w-20 rounded-lg bg-gray-200 animate-skeleton" />
        <div className="h-8 w-px bg-gray-200" />
        <div className="h-9 w-32 rounded-lg bg-gray-200 animate-skeleton" />
      </div>

      {/* メインエリア */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* キャンバス */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="w-full aspect-[800/520] bg-gray-100 animate-skeleton" />
        </div>
        {/* サイドバー */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <div className="h-4 w-24 bg-gray-200 rounded animate-skeleton" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-3 bg-gray-200 rounded animate-skeleton" style={{ width: `${70 + i * 5}%` }} />
              ))}
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="h-4 w-20 bg-amber-200 rounded animate-skeleton mb-2" />
            <div className="h-8 w-32 bg-amber-200 rounded animate-skeleton" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** 汎用ページスケルトン */
export function PageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="h-4 w-48 bg-gray-200 rounded animate-skeleton mb-6" />
      <div className="h-8 w-64 bg-gray-200 rounded animate-skeleton mb-4" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-4 bg-gray-200 rounded animate-skeleton" style={{ width: `${80 + i * 5}%` }} />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="h-10 w-10 bg-gray-200 rounded animate-skeleton mb-3" />
            <div className="h-5 w-32 bg-gray-200 rounded animate-skeleton mb-2" />
            <div className="h-3 bg-gray-200 rounded animate-skeleton" style={{ width: "90%" }} />
            <div className="h-3 bg-gray-200 rounded animate-skeleton mt-1" style={{ width: "70%" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
