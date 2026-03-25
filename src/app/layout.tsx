import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DIY棚シミュレーター | 賃貸でもOK！ディアウォール・ラブリコ設計ツール",
    template: "%s | DIY棚シミュレーター",
  },
  description:
    "天井高を入力するだけで、ディアウォール・ラブリコの木材カット寸法を自動計算。必要な部材リストと設計図も自動生成。賃貸でも壁を傷つけずにおしゃれな壁面収納をDIY。",
  keywords: [
    "ディアウォール",
    "ラブリコ",
    "DIY",
    "棚",
    "賃貸",
    "壁面収納",
    "2×4",
    "設計",
    "シミュレーター",
    "木材カット",
  ],
  openGraph: {
    title: "DIY棚シミュレーター | 賃貸OK！設計図自動生成",
    description:
      "天井高を入力 → 木材カット寸法・部材リスト・設計図を自動生成。ディアウォール/ラブリコ対応。",
    type: "website",
    locale: "ja_JP",
    siteName: "DIY棚シミュレーター by kuras-plus",
  },
  twitter: {
    card: "summary_large_image",
    title: "DIY棚シミュレーター",
    description: "天井高入力で木材カット寸法を自動計算。賃貸DIYの必需品。",
  },
  metadataBase: new URL("https://diy.kuras-plus.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {/* ヘッダー */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-xl">🪵</span>
              <span className="font-bold text-gray-800">DIY棚シミュレーター</span>
              <span className="text-xs text-gray-400 hidden sm:inline">
                by kuras-plus
              </span>
            </a>
            <nav className="flex items-center gap-4 text-sm">
              <a
                href="/"
                className="text-gray-600 hover:text-amber-600 transition-colors"
              >
                設計ツール
              </a>
              <a
                href="/guide"
                className="text-gray-600 hover:text-amber-600 transition-colors"
              >
                使い方ガイド
              </a>
            </nav>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="px-4 py-8">{children}</main>

        {/* フッター */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="text-center text-sm text-gray-500">
              <p>
                DIY棚シミュレーター — 賃貸でもOK！ディアウォール・ラブリコ設計ツール
              </p>
              <p className="mt-1">
                政府統計データに基づく信頼性の高い情報を提供 ·{" "}
                <a
                  href="https://kuras-plus.com"
                  className="text-amber-600 hover:underline"
                >
                  kuras-plus.com
                </a>
              </p>
              <p className="mt-2 text-xs text-gray-400">
                ※ 本ツールの計算結果は参考値です。実際の施工は各製品の取扱説明書に従ってください。
                <br />
                Amazonのアソシエイトとして、当サイトは適格販売により収入を得ています。
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
