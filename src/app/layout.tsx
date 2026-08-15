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
      "棚の設計シミュレーション【無料】2×4材の設計図・材料費を自動計算 | DIY棚メーカー",
    template: "%s | DIY棚メーカー",
  },
  description:
    "棚の設計シミュレーションが無料でできるDIYツール。天井高を入力するだけでディアウォール・ラブリコの木材カット寸法を自動計算し、部材リストと設計図を生成。賃貸でも壁を傷つけずにDIY棚が作れます。",
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
    title: "棚の設計シミュレーション【無料】DIY棚の設計図を自動作成 | DIY棚メーカー",
    description:
      "棚の設計シミュレーションが無料でできるDIYツール。天井高を入力するだけで木材カット寸法・部材リスト・設計図を自動生成。ラブリコ・ディアウォール対応。",
    type: "website",
    locale: "ja_JP",
    siteName: "DIY棚シミュレーター by kuras-plus",
    images: [{ url: "/ogp/default-ogp.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "棚の設計シミュレーション【無料】DIY棚の設計図を自動作成",
    description:
      "棚の設計シミュレーションが無料でできるDIYツール。天井高入力で木材カット寸法を自動計算。賃貸OK。",
    images: ["/ogp/default-ogp.png"],
  },
  metadataBase: new URL("https://diy-shelf-maker.kuras-plus.com"),
};

// サイト共通 Organization JSON-LD
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DIY棚メーカー編集部",
  url: "https://diy-shelf-maker.kuras-plus.com",
  parentOrganization: {
    "@type": "Organization",
    name: "kuras-plus",
    url: "https://kuras-plus.com",
  },
  logo: "https://diy-shelf-maker.kuras-plus.com/ogp/default-ogp.png",
  description: "DIY歴5年以上のスタッフが、実際に棚を作った経験をもとに情報をお届けしています。",
  sameAs: [],
};

// サイト共通 WebSite JSON-LD（Google検索のサイト認識を促進）
const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "DIY棚シミュレーター",
  alternateName: "DIY Shelf Maker",
  url: "https://diy-shelf-maker.kuras-plus.com",
  description:
    "天井高を入力するだけでディアウォール・ラブリコの木材カット寸法を自動計算し、部材リストと設計図を生成する無料ツール。",
  publisher: {
    "@type": "Organization",
    name: "kuras-plus",
    url: "https://kuras-plus.com",
  },
  inLanguage: "ja",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
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
            <nav className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6 text-sm">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">設計</h3>
                <ul className="space-y-1.5">
                  <li><a href="/" className="text-gray-600 hover:text-amber-600 transition-colors">設計ツール</a></li>
                  <li><a href="/templates" className="text-gray-600 hover:text-amber-600 transition-colors">テンプレート一覧</a></li>
                  <li><a href="/templates/bookshelf" className="text-gray-600 hover:text-amber-600 transition-colors">本棚テンプレート</a></li>
                  <li><a href="/templates/labrico-wall-storage" className="text-gray-600 hover:text-amber-600 transition-colors">壁面収納テンプレート</a></li>
                  <li><a href="/templates/rental-kitchen-rack" className="text-gray-600 hover:text-amber-600 transition-colors">キッチン棚テンプレート</a></li>
                  <li><a href="/guide" className="text-gray-600 hover:text-amber-600 transition-colors">使い方ガイド</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">学ぶ</h3>
                <ul className="space-y-1.5">
                  <li><a href="/howto" className="text-gray-600 hover:text-amber-600 transition-colors">作り方ガイド一覧</a></li>
                  <li><a href="/howto/labrico-vs-diawall" className="text-gray-600 hover:text-amber-600 transition-colors">ラブリコ vs ディアウォール比較</a></li>
                  <li><a href="/howto/beginner-diy-shelf-design" className="text-gray-600 hover:text-amber-600 transition-colors">初心者向け棚設計ガイド</a></li>
                  <li><a href="/howto/rental-wall-storage-guide" className="text-gray-600 hover:text-amber-600 transition-colors">賃貸壁面収納ガイド</a></li>
                  <li><a href="/parts" className="text-gray-600 hover:text-amber-600 transition-colors">パーツ辞典</a></li>
                  <li><a href="/parts/category/adjuster" className="text-gray-600 hover:text-amber-600 transition-colors">アジャスター一覧</a></li>
                  <li><a href="/parts/category/lumber" className="text-gray-600 hover:text-amber-600 transition-colors">木材一覧</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">ツール</h3>
                <ul className="space-y-1.5">
                  <li><a href="/tools" className="text-gray-600 hover:text-amber-600 transition-colors">ツール一覧</a></li>
                  <li><a href="/tools/shelf-load-calc" className="text-gray-600 hover:text-amber-600 transition-colors">耐荷重計算</a></li>
                  <li><a href="/tools/material-cost-estimator" className="text-gray-600 hover:text-amber-600 transition-colors">費用見積もり</a></li>
                  <li><a href="/tools/support-system-picker" className="text-gray-600 hover:text-amber-600 transition-colors">支柱比較</a></li>
                  <li><a href="/tools/shelf-planner-quiz" className="text-gray-600 hover:text-amber-600 transition-colors">棚診断</a></li>
                  <li><a href="/tools/wood-cut-calculator" className="text-gray-600 hover:text-amber-600 transition-colors">木材カット計算</a></li>
                  <li><a href="/tools/material-calculator" className="text-gray-600 hover:text-amber-600 transition-colors">材料計算</a></li>
                  <li><a href="/tools/strength-checker" className="text-gray-600 hover:text-amber-600 transition-colors">棚板強度チェック</a></li>
                  <li><a href="/tools/projects" className="text-gray-600 hover:text-amber-600 transition-colors">プロジェクトDB</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">サイト情報</h3>
                <ul className="space-y-1.5">
                  <li><a href="/faq" className="text-gray-600 hover:text-amber-600 transition-colors">よくある質問</a></li>
                  <li>
                    <a
                      href="https://kuras-plus.com"
                      className="text-gray-600 hover:text-amber-600 transition-colors"
                    >
                      運営: kuras-plus
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://kuras-plus.com/contact"
                      className="text-gray-600 hover:text-amber-600 transition-colors"
                    >
                      お問い合わせ
                    </a>
                  </li>
                </ul>
                <h3 className="font-semibold text-gray-800 mb-2 mt-4">運営者の他のサイト</h3>
                <ul className="space-y-1.5">
                  <li>
                    <a
                      href="https://books.kuras-plus.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-amber-600 transition-colors"
                    >
                      Books Tools — 気分から漫画・小説を探せる発見サイト
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
            <div className="text-center text-sm text-gray-500 border-t border-gray-100 pt-6">
              <p>
                DIY棚シミュレーター — 賃貸でもOK！ディアウォール・ラブリコ設計ツール
              </p>
              <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                運営: kuras-plus ／ 編集: DIY棚メーカー編集部
                <br />
                ※ 本サイトの計算結果・価格情報は参考値です。実際の施工は各製品の取扱説明書に従ってください。
                <br />
                ※ 耐荷重はメーカー公表値に基づく目安です。安全のため余裕を持った設計をおすすめします。
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
