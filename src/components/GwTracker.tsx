"use client";

import { useEffect } from "react";
import { trackGwContentView, trackGwAmazonClick } from "@/lib/analytics";

/** GW記事の閲覧イベントを送信するクライアントコンポーネント */
export function GwViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    trackGwContentView(slug);
  }, [slug]);
  return null;
}

/** GW記事内Amazonリンクのクリックイベント送信ラッパー */
export function GwAmazonLink({
  slug,
  label,
  href,
  children,
}: {
  slug: string;
  label: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow sponsored"
      className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold py-1.5 px-3 rounded transition-colors"
      onClick={() => trackGwAmazonClick(slug, label)}
    >
      {children}
    </a>
  );
}
