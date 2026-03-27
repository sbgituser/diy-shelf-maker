import type { Metadata } from "next";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default:
      "DIY棚シミュレーター | 棚レイアウト設計・木材カット寸法を無料で自動計算",
    template: "%s | DIY棚シミュレーター",
  },
  description:
    "棚のレイアウトを無料でシミュレーション。天井高を入力するだけでディアウォール・ラブリコの木材カット寸法を自動計算し、部材リストと設計図を生成。賃貸でも壁を傷つけずにDIY。",
  keywords: [
    "棚 レイアウト シミュレーション 無料",
    "棚 設計 ツール",
    "DIY 棚 サイズ 計算",
    "ディアウォール",
    "ラブリコ",
    "DIY 棚",
    "賃貸 壁面収納",
    "2×4 棚",
    "木材カット 計算",
    "棚 設計図",
  ],
  openGraph: {
    title: "DIY棚シミュレーター | 棚レイアウト設計を無料で",
    description:
      "天井高を入力 → 木材カット寸法・部材リスト・設計図を自動生成。ディアウォール/ラブリコ対応の無料ツール。",
    type: "website",
    locale: "ja_JP",
    siteName: "DIY棚シミュレーター by kuras-plus",
  },
  twitter: {
    card: "summary_large_image",
    title: "DIY棚シミュレーター | 棚設計を無料でシミュレーション",
    description:
      "天井高入力で木材カット寸法を自動計算。部材リストと設計図も生成。賃貸DIYに。",
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
        <GoogleAnalytics />

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
                href="/templates"
                className="text-gray-600 hover:text-amber-600 transition-colors"
              >
                テンプレート
              </a>
              <a
                href="/howto"
                className="text-gray-600 hover:text-amber-600 transition-colors"
              >
                作り方ガイド
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
