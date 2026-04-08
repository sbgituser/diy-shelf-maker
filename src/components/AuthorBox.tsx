/**
 * 著者情報コンポーネント（E-E-A-T強化）
 * howto記事の冒頭・末尾に表示
 */

interface AuthorBoxProps {
  /** "header" = 記事冒頭の簡易表示, "footer" = 記事末尾の詳細表示 */
  variant: "header" | "footer";
  publishedAt: string;
  updatedAt: string;
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${y}年${Number(m)}月${Number(d)}日`;
}

export default function AuthorBox({
  variant,
  publishedAt,
  updatedAt,
}: AuthorBoxProps) {
  if (variant === "header") {
    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-3">
        <span className="flex items-center gap-1">
          <span className="text-amber-600 font-medium">✍️ DIY棚メーカー編集部</span>
        </span>
        <span>公開: {formatDate(publishedAt)}</span>
        {updatedAt !== publishedAt && (
          <span>更新: {formatDate(updatedAt)}</span>
        )}
      </div>
    );
  }

  // variant === "footer"
  return (
    <aside className="mt-10 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
      <h2 className="text-sm font-bold text-gray-800 mb-3">
        ✍️ 監修・執筆
      </h2>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
          🪵
        </div>
        <div>
          <p className="font-bold text-gray-900">DIY棚メーカー編集部</p>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
            DIY歴5年以上のスタッフが、実際に棚を作った経験をもとに情報をお届けしています。
            記事内の数値はメーカー公表値やJIS規格に基づき、価格情報は掲載時点のAmazon販売価格を参考にしています。
          </p>
          <p className="text-xs text-gray-400 mt-2">
            最終更新: {formatDate(updatedAt)}
          </p>
        </div>
      </div>
    </aside>
  );
}
