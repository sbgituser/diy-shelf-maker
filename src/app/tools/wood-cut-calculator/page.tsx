import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import FaqAccordion from "@/components/FaqAccordion";
import WoodCutCalculatorClient from "@/components/tools/WoodCutCalculatorClient";

export const metadata: Metadata = {
  title: "木材カット計算ツール【無料】DIY棚の寸法を自動算出",
  description:
    "DIY棚の木材カット寸法を無料で自動計算。天井高とアジャスターを選ぶだけで、柱・棚板のカットリストと費用概算を一括出力。ホームセンターへそのまま持っていける注文メモ付き。",
  keywords: [
    "木材 カット 計算",
    "2×4 カット 長さ",
    "ラブリコ カット寸法",
    "ディアウォール カット寸法",
    "DIY 棚 木材 寸法",
    "ホームセンター カット 計算",
    "木材 長さ 計算",
    "1×4材 カット",
  ],
  openGraph: {
    title:
      "木材カット計算ツール【無料】DIY棚の寸法を自動算出 | DIY棚メーカー",
    description:
      "天井高とアジャスターを選ぶだけで、柱・棚板のカット寸法・費用概算・注文メモを自動生成。",
    type: "website",
    locale: "ja_JP",
    url: "https://diy-shelf-maker.kuras-plus.com/tools/wood-cut-calculator",
    siteName: "DIY棚メーカー by kuras-plus",
    images: [{ url: "/ogp/default-ogp.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ogp/default-ogp.png"],
  },
  alternates: {
    canonical:
      "https://diy-shelf-maker.kuras-plus.com/tools/wood-cut-calculator",
  },
};

const FAQ_ITEMS = [
  {
    question: "アジャスターのオフセット値とは？",
    answer:
      "アジャスター（ラブリコ・ディアウォール等）を使う場合、天井高より短く木材をカットする必要があります。その短くする長さが「オフセット値」です。ラブリコは−95mm、ディアウォールは−45mmが標準です。",
  },
  {
    question: "天井高の正しい測り方は？",
    answer:
      "メジャーで床から天井まで垂直に測ります。壁際は巾木や廻り縁があるため、柱を立てる位置で測るのがポイントです。同じ部屋でも場所によって数mm異なることがあるので、複数箇所で測定し最も低い値を採用してください。",
  },
  {
    question: "2×4材の実寸は何mm？",
    answer:
      "2×4材の実寸は38mm × 89mmです。「2インチ × 4インチ」は公称寸法で、乾燥・製材後の実寸はそれより小さくなります。ホームセンターで「38×89mm」と表記されているのが正しいサイズです。",
  },
  {
    question: "ホームセンターのカットサービスの精度は？",
    answer:
      "一般的に±1mm程度の精度でカットしてもらえます。ラブリコやディアウォールは数mmの調整幅があるので、±1mmの誤差は問題ありません。心配な場合は「±1mm以内」と伝えると安心です。",
  },
  {
    question: "木材が長すぎた場合はどうする？",
    answer:
      "長すぎて天井に入らない場合は、再カットが必要です。ホームセンターに持ち込めば追加カットしてもらえます（有料の場合あり）。自宅でカットする場合は手ノコやジグソーが使えます。短すぎた場合はアジャスターで吸収できる範囲かを確認してください。",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "木材カット計算ツール",
    description:
      "DIY棚の木材カット寸法を自動計算。天井高とアジャスターを選ぶだけでカットリスト・費用概算を出力。",
    url: "https://diy-shelf-maker.kuras-plus.com/tools/wood-cut-calculator",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
    },
    author: {
      "@type": "Organization",
      name: "kuras-plus",
      url: "https://kuras-plus.com",
    },
    publisher: {
      "@type": "Organization",
      name: "kuras-plus",
      url: "https://kuras-plus.com",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "ホーム",
          item: "https://diy-shelf-maker.kuras-plus.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "ツール一覧",
          item: "https://diy-shelf-maker.kuras-plus.com/tools",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "木材カット計算ツール",
          item: "https://diy-shelf-maker.kuras-plus.com/tools/wood-cut-calculator",
        },
      ],
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  },
];

export default function WoodCutCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto">
        <Breadcrumb
          items={[
            { name: "ホーム", href: "/" },
            { name: "ツール一覧", href: "/tools" },
            { name: "木材カット計算ツール" },
          ]}
        />

        {/* ヒーローセクション */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-100 mb-10">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl">🪚</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
                木材カット計算ツール
              </h1>
              <p className="mt-2 text-gray-600 leading-relaxed max-w-2xl">
                天井高とアジャスターの種類を選ぶだけで、柱・棚板のカット寸法を自動計算。
                ホームセンターでの注文メモとしてそのままコピーできます。
              </p>
            </div>
          </div>
        </section>

        {/* 計算ツール本体 */}
        <WoodCutCalculatorClient />

        {/* 使い方ガイド（2,000文字以上のSEOコンテンツ） */}
        <section className="mt-12 mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            木材カット計算ツールの使い方
          </h2>

          <div className="prose prose-gray max-w-none space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-base font-bold text-gray-800 mb-3">
                Step 1: 天井高を正確に測る
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                DIY棚を作る際に最も重要なのが天井高の正確な測定です。メジャーを使い、柱を立てる予定の位置で床から天井まで垂直に計測します。日本の一般的なマンション・アパートの天井高は2,400mm前後ですが、建物によって2,200mm〜2,700mmと幅があります。
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mt-2">
                注意点として、同じ部屋でも壁際と中央で天井高が異なることがあります。巾木（はばき）や廻り縁（まわりぶち）がある場合は、それらを避けた位置で測定してください。複数箇所で測定し、最も低い値を採用するのが安全です。
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-base font-bold text-gray-800 mb-3">
                Step 2: アジャスターを選ぶ
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                賃貸住宅でDIY棚を設置する場合、壁や天井に穴を開けずに柱を固定できるアジャスターが必須です。代表的な製品とオフセット値（天井高から引く長さ）は以下の通りです。
              </p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-600 flex-shrink-0">ラブリコ（−95mm）</span>
                  ジャッキ式で微調整しやすく、デザイン性も高い。DIY初心者に最もおすすめ。
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-600 flex-shrink-0">ディアウォール（−45mm）</span>
                  バネ式で取り付け簡単。オフセット値が小さいため、天井高ギリギリの場合に有利。
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-600 flex-shrink-0">ラブリコ強力（−120mm）</span>
                  耐荷重40kgの強力タイプ。重い本棚や壁面収納に。
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-600 flex-shrink-0">ウォリスト（−60mm）</span>
                  ネジ式で強力に固定。大型の壁面収納向き。
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-base font-bold text-gray-800 mb-3">
                Step 3: カットリストを確認して注文する
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                計算結果のカットリストには、各部材の材種・カット寸法・本数が一覧表示されます。「注文メモをコピー」ボタンを押すと、ホームセンターでのカット注文に使えるテキストがクリップボードにコピーされます。
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mt-2">
                ホームセンターのカットサービスを利用する際は、以下の点に注意してください。
              </p>
              <ul className="mt-2 space-y-1 text-sm text-gray-600 list-disc list-inside">
                <li>寸法はmm単位で正確に伝える</li>
                <li>「±1mm以内」と許容誤差を明示する</li>
                <li>複数本を同じ長さにカットする場合、最初の1本を基準に揃えてもらう</li>
                <li>端材も持ち帰る（試し塗りや補強材に使える）</li>
                <li>カット代は1カット50〜100円が相場</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-base font-bold text-gray-800 mb-3">
                よくあるカット寸法のミスと対策
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                DIY初心者が最も多く経験する失敗が「木材のカット寸法ミス」です。木材は一度カットしたら元に戻せないため、計算は慎重に行う必要があります。
              </p>
              <div className="mt-3 space-y-3">
                <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                  <p className="text-sm font-medium text-red-800">ミス1: オフセット値を足してしまう</p>
                  <p className="text-xs text-red-600 mt-1">
                    正しくは天井高から「引く」のがオフセット値です。2400mm + 95mm = 2495mmではなく、2400mm − 95mm = 2305mmが正解。
                  </p>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                  <p className="text-sm font-medium text-red-800">ミス2: 天井高の測定位置がずれている</p>
                  <p className="text-xs text-red-600 mt-1">
                    実際に柱を立てる場所で測定してください。壁際と部屋中央では数mm異なることがあります。
                  </p>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                  <p className="text-sm font-medium text-red-800">ミス3: 2×4材の公称寸法と実寸の混同</p>
                  <p className="text-xs text-red-600 mt-1">
                    2×4材は「2インチ × 4インチ」ではなく実寸「38mm × 89mm」です。棚板幅の計算時に注意。
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-base font-bold text-gray-800 mb-3">
                計算例: 天井高2,400mmでラブリコを使う場合
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                最も一般的な天井高2,400mmで、ラブリコ（オフセット−95mm）を使い、2本柱・3段棚板（柱間距離600mm）を作る場合の計算例です。
              </p>
              <div className="mt-3 bg-gray-50 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">柱のカット長</span>
                    <span className="font-mono font-medium text-gray-800">2,400 − 95 = 2,305mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">棚板の長さ</span>
                    <span className="font-mono font-medium text-gray-800">600mm × 3枚</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">購入する木材</span>
                    <span className="font-medium text-gray-800">8フィート (2,438mm) の2×4材 × 2本</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mt-3">
                8フィートの2×4材（2,438mm）を2,305mmにカットしてもらい、残りの端材133mmは棚板の補強や試し塗りに活用できます。
              </p>
            </div>
          </div>
        </section>

        {/* アジャスター別オフセット値一覧 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            アジャスター別オフセット値一覧
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    アジャスター
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">
                    オフセット値
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">
                    固定方式
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">
                    参考価格
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">
                    天井高2,400mm時
                    <br />
                    <span className="text-xs font-normal text-gray-400">
                      カット長
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "ディアウォール", offset: 45, method: "バネ式", price: "¥1,100" },
                  { name: "ラブリコ", offset: 95, method: "ジャッキ式", price: "¥1,210" },
                  { name: "ラブリコ 強力", offset: 120, method: "ジャッキ式", price: "¥1,870" },
                  { name: "ウォリスト", offset: 60, method: "ネジ式", price: "¥1,320" },
                ].map((a, i) => (
                  <tr
                    key={a.name}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {a.name}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gray-800">
                      −{a.offset}mm
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {a.method}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {a.price}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-medium text-amber-600">
                      {(2400 - a.offset).toLocaleString()}mm
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            よくある質問
          </h2>
          <FaqAccordion items={FAQ_ITEMS} />
        </section>

        {/* 関連リンク */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-5">関連ページ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              <p className="text-2xl mb-2">🪵</p>
              <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors text-sm">
                棚シミュレーター
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                棚のレイアウトを設計・部材リストを自動生成
              </p>
            </Link>
            <Link
              href="/tools/material-calculator"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              <p className="text-2xl mb-2">🧮</p>
              <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors text-sm">
                材料計算シミュレーター
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                必要な木材・金具・工具リストと概算費用を自動計算
              </p>
            </Link>
            <Link
              href="/tools/shelf-load-calc"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              <p className="text-2xl mb-2">⚖️</p>
              <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors text-sm">
                棚板耐荷重計算ツール
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                棚板の耐荷重とたわみ量を自動計算
              </p>
            </Link>
          </div>
        </section>

        {/* 関連する作り方ガイド */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            関連する作り方ガイド
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/howto/shelf-wood-cutting-calculator"
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              <span className="text-xl flex-shrink-0">📐</span>
              <div>
                <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors text-sm">
                  木材カット計算ガイド
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  失敗ゼロの寸法算出3ステップを詳しく解説
                </p>
              </div>
            </Link>
            <Link
              href="/howto/labrico-vs-diawall"
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              <span className="text-xl flex-shrink-0">⚖️</span>
              <div>
                <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors text-sm">
                  ラブリコ vs ディアウォール徹底比較
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  固定方式・耐荷重・価格の違いを解説
                </p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
