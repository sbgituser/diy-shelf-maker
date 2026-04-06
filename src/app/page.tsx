import DesignForm from "@/components/DesignForm";
import ErrorBoundary from "@/components/ErrorBoundary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "DIY棚設計シミュレーター【無料】つっぱり棚の設計図・部材リストを自動作成",
  description:
    "ラブリコ・ディアウォールを使ったDIY棚の設計ツール。天井高を入力するだけで木材カット寸法、必要な部材リスト、費用概算を自動計算。賃貸OKの壁面収納を無料で設計できます。",
  keywords: [
    "DIY 棚 設計",
    "つっぱり棚 DIY",
    "ラブリコ 棚 作り方",
    "ディアウォール 棚",
    "壁面収納 DIY",
    "賃貸 壁面収納",
    "棚 設計 シミュレーション",
    "DIY 棚 木材 カット 計算",
    "棚 レイアウト ツール",
    "2×4 棚 計算",
  ],
  openGraph: {
    title: "DIY棚設計シミュレーター【無料】つっぱり棚の設計図・部材リストを自動作成",
    description:
      "ラブリコ・ディアウォールを使ったDIY棚の設計ツール。天井高を入力するだけで木材カット寸法、必要な部材リスト、費用概算を自動計算。賃貸OKの壁面収納を無料で設計できます。",
    type: "website",
    locale: "ja_JP",
    url: "https://diy-shelf-maker.kuras-plus.com",
    siteName: "DIY棚シミュレーター by kuras-plus",
    images: [{ url: "/ogp/default-ogp.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ogp/default-ogp.png"],
  },
  alternates: {
    canonical: "https://diy-shelf-maker.kuras-plus.com",
  },
};

// JSON-LD 構造化データ（SoftwareApplication）
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "DIY棚シミュレーター",
  description:
    "天井高を入力するだけでディアウォール・ラブリコの木材カット寸法を自動計算。必要な部材リストと設計図も自動生成する無料のDIY棚設計ツール。",
  url: "https://diy-shelf-maker.kuras-plus.com",
  applicationCategory: "DesignApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
  },
  featureList: [
    "木材カット寸法の自動計算",
    "部材リスト自動生成",
    "設計図PDF出力",
    "ディアウォール・ラブリコ・ウォリスト対応",
    "2×4材・1×4材対応",
  ],
  inLanguage: "ja",
  author: {
    "@type": "Organization",
    name: "kuras-plus",
    url: "https://kuras-plus.com",
  },
  datePublished: "2026-03-27",
  dateModified: "2026-04-05",
  isAccessibleForFree: true,
};

// HowTo JSON-LD（棚設計の手順）
const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "DIYで突っ張り棚を設計・作成する方法",
  description:
    "ディアウォール・ラブリコを使った突っ張り棚のDIY手順。天井高の測定からカット寸法の計算、部材の購入、組み立てまでを解説。",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "天井高を測定する",
      text: "設置場所の天井高をメジャーで正確に測定します。場所によって数mm異なることがあるため、複数箇所を測りましょう。",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "アジャスターを選択する",
      text: "ディアウォール・ラブリコ・ウォリストなど、用途に応じたアジャスターを選びます。シミュレーターで比較できます。",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "木材カット寸法を計算する",
      text: "シミュレーターに天井高を入力し、アジャスターに応じたカット寸法と必要な部材リストを自動生成します。",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "部材を購入・カットする",
      text: "生成された部材リストをもとに、ホームセンターで2×4材と金具を購入。カットサービスを利用すると正確です。",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "柱を立てて棚を組み立てる",
      text: "アジャスターを取り付けた柱を設置し、棚受け金具で棚板を固定します。水平器で水平を確認して完成。",
    },
  ],
  tool: [
    { "@type": "HowToTool", name: "メジャー" },
    { "@type": "HowToTool", name: "電動ドライバー" },
    { "@type": "HowToTool", name: "水平器" },
  ],
};

export default function Home() {
  return (
    <>
      {/* JSON-LD 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      {/* ヒーローセクション */}
      <section className="max-w-5xl mx-auto mb-10">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-100">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
            DIY棚設計シミュレーター
            <br className="sm:hidden" />
            — つっぱり棚の設計図を<span className="text-amber-600">無料</span>で作成
          </h1>
          <p className="mt-3 text-gray-600 leading-relaxed max-w-2xl">
            天井高を入力するだけで、ディアウォール・ラブリコの
            <strong className="text-amber-700">木材カット寸法</strong>を自動計算。
            <strong className="text-amber-700">必要な部材リスト</strong>と
            <strong className="text-amber-700">設計図</strong>
            も自動で生成します。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["完全無料", "登録不要", "ブラウザだけ", "壁に穴をあけない"].map(
              (tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 bg-white/80 border border-amber-200 rounded-full text-xs font-medium text-amber-700"
                >
                  ✓ {tag}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* メインツール */}
      <ErrorBoundary>
        <DesignForm />
      </ErrorBoundary>

      {/* パーツ辞典へのリンクセクション */}
      <section className="max-w-5xl mx-auto mt-12 mb-4">
        <a
          href="/parts"
          className="block bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100 hover:border-amber-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">📚</span>
            <div>
              <h2 className="text-lg font-bold text-gray-800 group-hover:text-amber-600 transition-colors">
                DIYパーツ辞典
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                ラブリコ・ディアウォール・2×4材・棚板・棚受け金具・工具など、突っ張り棚DIYに必要な
                8カテゴリ・37パーツを徹底解説。選び方・使い方・FAQ付き。
              </p>
            </div>
            <span className="ml-auto text-amber-600 font-medium text-sm flex-shrink-0 group-hover:translate-x-1 transition-transform">
              見る →
            </span>
          </div>
        </a>
      </section>

      {/* SEO用テキストコンテンツ */}
      <section className="max-w-3xl mx-auto mt-16 space-y-8 text-gray-700 leading-relaxed text-sm">
        <h2 className="text-xl font-bold text-gray-800">
          ディアウォール・ラブリコとは？
        </h2>
        <p>
          ディアウォールやラブリコは、2×4材（ツーバイフォー）に取り付けて天井と床の間に突っ張ることで、
          壁や天井を傷つけずに柱を立てられるDIYアイテムです。
          賃貸住宅でも壁面収納や飾り棚を設置でき、退去時にはそのまま取り外せるため原状回復も簡単。
          近年の在宅ワーク需要もあり、デスク周りの収納整理として人気が高まっています。
        </p>

        <h2 className="text-xl font-bold text-gray-800">
          木材のカット寸法の計算方法
        </h2>
        <p>
          2×4材のカット寸法は、使用するアジャスター製品によって異なります。
          天井高から差し引く長さ（補正値）は以下の通りです：
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>ディアウォール:</strong> 天井高 − 45mm
          </li>
          <li>
            <strong>ラブリコ:</strong> 天井高 − 95mm
          </li>
          <li>
            <strong>ラブリコ強力タイプ:</strong> 天井高 − 120mm
          </li>
          <li>
            <strong>ウォリスト:</strong> 天井高 − 60mm
          </li>
        </ul>
        <p>
          本ツールでは、天井高を入力するだけで各製品に応じたカット寸法を自動計算し、
          必要な部材リストと合わせて設計図を生成します。
          ホームセンターのカットサービスを利用する際のメモとしてもお使いいただけます。
        </p>

        <h2 className="text-xl font-bold text-gray-800">
          賃貸DIYの注意点
        </h2>
        <p>
          賃貸住宅でディアウォールやラブリコを使う際は、以下の点にご注意ください：
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>天井の素材によっては跡がつく場合があります。当て布の使用をおすすめします</li>
          <li>耐荷重の範囲内で使用してください（製品ごとの上限を確認）</li>
          <li>地震対策として、重いものは下段に配置するのが安全です</li>
          <li>設置場所の天井高は必ず実測してください（場所によって数mm異なることがあります）</li>
        </ul>
      </section>
    </>
  );
}
