import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import StrengthCheckerClient from "@/components/tools/StrengthCheckerClient";

export const metadata: Metadata = {
  title: "棚板強度チェッカー【たわみ量を自動計算】木材別・荷重別の安全判定",
  description:
    "棚板の木材の種類と寸法、載せる物の重さを入力するだけで、たわみ量を計算し安全性を判定。SPF・パイン・合板・MDF・オーク7種に対応。改善提案も表示します。",
  keywords: [
    "棚板 たわみ 計算",
    "棚板 強度 計算",
    "DIY 強度",
    "木材 たわみ",
    "棚板 耐荷重",
    "棚 安全性",
  ],
  openGraph: {
    title: "棚板強度チェッカー【たわみ量を自動計算】| DIY棚メーカー",
    description:
      "棚板のたわみ量を自動計算。木材7種・3種の支持方法に対応。安全判定と改善提案を表示。",
    type: "website",
    locale: "ja_JP",
    url: "https://diy-shelf-maker.kuras-plus.com/tools/strength-checker",
    siteName: "DIY棚メーカー by kuras-plus",
    images: [{ url: "/ogp/default-ogp.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ogp/default-ogp.png"],
  },
  alternates: {
    canonical: "https://diy-shelf-maker.kuras-plus.com/tools/strength-checker",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "棚板のたわみ量はどのくらいまで許容範囲？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "一般的にスパン（棚板の幅）の1/300以下が安全とされます。例えばスパン600mmなら2mm以下のたわみが目安です。それ以上になると見た目にも分かるたわみが生じます。",
      },
    },
    {
      "@type": "Question",
      name: "棚板が重さに耐えられないときの対策は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "主な対策は3つ: (1)棚板の厚みを増やす、(2)中間に支柱を追加してスパンを短くする、(3)より強度の高い木材に変更する。最も効果が大きいのは厚みを増やすことです（たわみは厚さの3乗に反比例）。",
      },
    },
  ],
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "棚板強度チェッカー",
  description:
    "棚板のたわみ量を自動計算し安全性を判定するDIYツール",
  url: "https://diy-shelf-maker.kuras-plus.com/tools/strength-checker",
  applicationCategory: "UtilitiesApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
};

export default function StrengthCheckerPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />

      <Breadcrumb
        items={[
          { name: "ホーム", href: "/" },
          { name: "ツール一覧", href: "/tools" },
          { name: "棚板強度チェッカー" },
        ]}
      />

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-100 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          棚板強度チェッカー
        </h1>
        <p className="mt-2 text-gray-600">
          木材の種類と寸法、載せる物の重さを入力すると、たわみ量を計算し安全性を判定します。
        </p>
      </div>

      <StrengthCheckerClient />

      {/* 解説 */}
      <section className="mt-10 bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-lg font-bold text-gray-800 mb-3">
          たわみ計算の仕組み
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          このツールは材料力学の「はりのたわみ公式」を使って計算しています。
          等分布荷重の両端支持はりの場合、たわみ量 δ = 5WL⁴ / 384EI で求まります。
          ここで W=荷重、L=スパン、E=ヤング率（弾性係数）、I=断面二次モーメント(bh³/12)です。
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mt-2">
          たわみは厚さの3乗に反比例するため、厚さを2倍にすると
          たわみは1/8に減ります。棚板の強度改善には厚さの変更が最も効果的です。
        </p>
      </section>

      {/* FAQ */}
      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-bold text-gray-800">よくある質問</h2>
        <details className="bg-white border border-gray-200 rounded-xl">
          <summary className="px-5 py-3 text-sm font-medium text-gray-800 cursor-pointer hover:bg-gray-50">
            たわみ量はどのくらいまで許容範囲？
          </summary>
          <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
            一般的にスパンの1/300以下が安全とされます。例えばスパン600mmなら2mm以下のたわみが目安です。
            1/150を超えると見た目にも分かるたわみが生じ、物が滑りやすくなります。
          </div>
        </details>
        <details className="bg-white border border-gray-200 rounded-xl">
          <summary className="px-5 py-3 text-sm font-medium text-gray-800 cursor-pointer hover:bg-gray-50">
            棚板が重さに耐えられないときの対策は？
          </summary>
          <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
            主な対策は3つ: (1)棚板の厚みを増やす、(2)中間に支柱を追加してスパンを短くする、
            (3)より強度の高い木材に変更する。最も効果が大きいのは厚みを増やすことです。
          </div>
        </details>
        <details className="bg-white border border-gray-200 rounded-xl">
          <summary className="px-5 py-3 text-sm font-medium text-gray-800 cursor-pointer hover:bg-gray-50">
            計算結果はどの程度正確？
          </summary>
          <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
            理論値に基づく概算です。実際の木材には節や木目方向の違いがあるため、
            安全係数を考慮して余裕を持った設計をおすすめします。
            特にMDFは湿気でヤング率が大きく低下するため注意が必要です。
          </div>
        </details>
      </section>
    </div>
  );
}
