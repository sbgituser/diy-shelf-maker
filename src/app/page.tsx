import DesignForm from "@/components/DesignForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "棚レイアウト シミュレーション 無料 | DIY棚設計ツール - サイズ自動計算",
  description:
    "棚のレイアウトをブラウザで無料シミュレーション。天井高を入力するだけでディアウォール・ラブリコの木材カット寸法を自動計算し、必要な部材リストと設計図を生成。賃貸DIYの棚設計に。",
  keywords: [
    "棚 レイアウト シミュレーション 無料",
    "棚 設計 ツール",
    "DIY 棚 サイズ 計算",
    "ディアウォール 棚 設計",
    "ラブリコ 棚 シミュレーター",
    "2×4 棚 計算",
    "賃貸 棚 DIY",
    "壁面収納 設計",
    "棚 設計図 自動生成",
    "木材 カット 寸法 計算",
  ],
  openGraph: {
    title: "棚レイアウト シミュレーション 無料 | DIY棚設計ツール",
    description:
      "天井高入力 → 木材カット寸法・部材リスト・設計図を自動生成。ディアウォール/ラブリコ対応の無料棚設計ツール。",
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

// JSON-LD 構造化データ
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
};

export default function Home() {
  return (
    <>
      {/* JSON-LD 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ヒーローセクション */}
      <section className="max-w-5xl mx-auto mb-10">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-100">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
            棚レイアウト シミュレーション
            <br className="sm:hidden" />
            <span className="text-amber-600">無料</span>DIY棚設計ツール
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
      <DesignForm />

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
