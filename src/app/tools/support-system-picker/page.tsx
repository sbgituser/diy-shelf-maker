import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import FaqAccordion from "@/components/FaqAccordion";
import SupportSystemPickerClient from "@/components/tools/SupportSystemPickerClient";

export const metadata: Metadata = {
  title:
    "支柱システム比較ツール | ディアウォール・ラブリコ・ウォリスト徹底比較",
  description:
    "DIY棚の支柱システムを条件別に比較。ディアウォール・ラブリコ・ウォリストの耐荷重・価格・設置難易度を一覧比較。あなたに最適なシステムを診断します。",
  keywords: [
    "ディアウォール ラブリコ 比較",
    "突っ張り棚 おすすめ",
    "ディアウォール ラブリコ どっち",
    "ウォリスト 比較",
    "賃貸 壁面収納 突っ張り",
    "2×4 アジャスター 比較",
    "DIY 支柱 選び方",
    "突っ張り棒 棚 比較",
  ],
  openGraph: {
    title:
      "支柱システム比較ツール | ディアウォール・ラブリコ・ウォリスト徹底比較",
    description:
      "DIY棚の支柱システム5方式を条件別に比較。耐荷重・価格・設置難易度を一覧比較し、最適なシステムを診断。",
    type: "website",
    locale: "ja_JP",
    url: "https://diy-shelf-maker.kuras-plus.com/tools/support-system-picker",
    siteName: "DIY棚シミュレーター by kuras-plus",
  },
  alternates: {
    canonical:
      "https://diy-shelf-maker.kuras-plus.com/tools/support-system-picker",
  },
};

const FAQ_ITEMS = [
  {
    question: "ディアウォールとラブリコの違いは？",
    answer:
      "ディアウォールはバネ式で木材を押し上げて固定、ラブリコはネジ式アジャスターで締め込んで固定します。ラブリコの方が耐荷重が高く（40kg vs 20kg）、高さの微調整もしやすいですが、定期的な増し締めが必要です。設置の手軽さはほぼ同等で、どちらも賃貸で使えます。",
  },
  {
    question: "賃貸で使える支柱システムはどれ？",
    answer:
      "ディアウォール・ラブリコ・ウォリスト・突っ張り棒の4種はいずれも壁や天井にネジ穴を開けずに設置できるため、賃貸でも使用可能です。壁付けL字金具のみネジ固定が必要なので賃貸には不向きです。",
  },
  {
    question: "耐荷重が一番大きいのはどれ？",
    answer:
      "突っ張り方式ではウォリスト（60kg/本）が最大です。2×4材を2本束ねて使う構造のため非常に安定しています。壁に固定できる場合はL字金具（50kg以上/個）も高い耐荷重があります。本棚など重い物を載せる場合はウォリストかL字金具がおすすめです。",
  },
  {
    question: "2×4材以外でも使える？",
    answer:
      "ディアウォール・ラブリコ・ウォリストは基本的に2×4材（38×89mm）専用です。ただし、ディアウォールとラブリコには1×4材用の製品もあります。突っ張り棒は木材不要で単体で使えます。L字金具は任意の棚板に対応します。",
  },
  {
    question: "天井が高い場合はどうすればいい？",
    answer:
      "天井高が2,700mmを超える場合、ホームセンターの定尺2×4材（1,820mmまたは2,438mm）では長さが足りないことがあります。その場合は3,000mm材を取り寄せるか、ラブリコの「アジャスター強力タイプ」を使うのがおすすめです。ジョイントパーツで2本の木材を継ぎ足す方法もあります。",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "支柱システム比較ツール",
    description:
      "DIY棚の支柱システム5方式を条件別に比較。ディアウォール・ラブリコ・ウォリストの耐荷重・価格・設置難易度を一覧比較し、最適なシステムを診断。",
    url: "https://diy-shelf-maker.kuras-plus.com/tools/support-system-picker",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
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
          name: "支柱システム比較ツール",
          item: "https://diy-shelf-maker.kuras-plus.com/tools/support-system-picker",
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

export default function SupportSystemPickerPage() {
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
            { name: "支柱システム比較ツール" },
          ]}
        />

        {/* ヒーローセクション */}
        <section className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 sm:p-8 border border-violet-100 mb-10">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl">🔧</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
                支柱システム比較ツール
              </h1>
              <p className="mt-2 text-gray-600 leading-relaxed max-w-2xl">
                ディアウォール・ラブリコ・ウォリスト・突っ張り棒・壁付け金具の5方式を徹底比較。
                耐荷重・価格・設置難易度をひと目で確認。あなたの条件に合った最適なシステムを診断します。
              </p>
            </div>
          </div>
        </section>

        {/* ツール本体 */}
        <SupportSystemPickerClient />

        {/* FAQ */}
        <section className="mt-12 mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            よくある質問
          </h2>
          <FaqAccordion items={FAQ_ITEMS} />
        </section>

        {/* 関連リンク */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-5">関連ページ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="/"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-violet-300 hover:shadow-sm transition-all group"
            >
              <p className="text-2xl mb-2">🪵</p>
              <h3 className="font-semibold text-gray-800 group-hover:text-violet-600 transition-colors text-sm">
                棚シミュレーター
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                棚のレイアウトを設計・部材リストを自動生成
              </p>
            </a>
            <a
              href="/tools/shelf-load-calc"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-violet-300 hover:shadow-sm transition-all group"
            >
              <p className="text-2xl mb-2">📐</p>
              <h3 className="font-semibold text-gray-800 group-hover:text-violet-600 transition-colors text-sm">
                棚板耐荷重計算ツール
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                板材の厚み・スパンから安全な荷重を計算
              </p>
            </a>
            <a
              href="/parts"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-violet-300 hover:shadow-sm transition-all group"
            >
              <p className="text-2xl mb-2">📦</p>
              <h3 className="font-semibold text-gray-800 group-hover:text-violet-600 transition-colors text-sm">
                パーツ辞典
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                金具・木材・塗装材の選び方を詳しく解説
              </p>
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
