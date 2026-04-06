import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import DesktopNav from "@/components/DesktopNav";
import MobileMenu from "@/components/MobileMenu";
import ToastContainer from "@/components/Toast";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: true,
});

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
    images: [{ url: "/ogp/default-ogp.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DIY棚シミュレーター | 棚設計を無料でシミュレーション",
    description:
      "天井高入力で木材カット寸法を自動計算。部材リストと設計図も生成。賃貸DIYに。",
    images: ["/ogp/default-ogp.png"],
  },
  metadataBase: new URL("https://diy-shelf-maker.kuras-plus.com"),
};

// サイト共通 Organization JSON-LD
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "kuras-plus",
  url: "https://kuras-plus.com",
  logo: "https://diy-shelf-maker.kuras-plus.com/ogp/default-ogp.png",
  sameAs: [],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={notoSansJP.className}>
      <head>
        <link rel="dns-prefetch" href="https://www.amazon.co.jp" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <GoogleAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />

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
            <DesktopNav />
            <MobileMenu />
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="px-4 py-8">{children}</main>

        <ToastContainer />

        {/* フッター */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6 text-sm">
              <a href="/" className="text-gray-600 hover:text-amber-600 transition-colors">設計ツール</a>
              <a href="/templates" className="text-gray-600 hover:text-amber-600 transition-colors">テンプレート一覧</a>
              <a href="/howto" className="text-gray-600 hover:text-amber-600 transition-colors">作り方ガイド</a>
              <a href="/guide" className="text-gray-600 hover:text-amber-600 transition-colors">使い方ガイド</a>
              <a href="/parts" className="text-gray-600 hover:text-amber-600 transition-colors">パーツ辞典</a>
              <a href="/tools/shelf-load-calc" className="text-gray-600 hover:text-amber-600 transition-colors">耐荷重計算</a>
              <a href="/tools/material-cost-estimator" className="text-gray-600 hover:text-amber-600 transition-colors">費用見積もり</a>
              <a href="/tools/support-system-picker" className="text-gray-600 hover:text-amber-600 transition-colors">支柱比較</a>
              <a href="/tools/shelf-planner-quiz" className="text-gray-600 hover:text-amber-600 transition-colors">棚診断</a>
            </nav>
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
