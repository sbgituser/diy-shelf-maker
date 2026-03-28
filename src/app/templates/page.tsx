import { SHELF_TEMPLATES } from "@/data/templates";
import { buildAmazonUrl } from "@/data/products";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "棚テンプレート一覧 - 人気のDIY棚デザイン12選",
  description:
    "DIY棚の人気テンプレート12種類を紹介。本棚、壁面収納、キッチン棚、シューズラック、デスク棚など。テンプレートを選ぶだけで設計図と材料リストを自動生成。",
  keywords: [
    "DIY 棚 テンプレート",
    "棚 設計図 テンプレート",
    "DIY 棚 デザイン",
    "壁面収納 設計図",
    "本棚 設計図 無料",
  ],
  openGraph: {
    title: "棚テンプレート一覧 - 人気のDIY棚デザイン12選",
    description:
      "DIY棚の人気テンプレート12種類。テンプレートを選んでシミュレーションするだけ。",
    type: "website",
    locale: "ja_JP",
    url: "https://diy.kuras-plus.com/templates",
  },
  alternates: {
    canonical: "https://diy.kuras-plus.com/templates",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "棚テンプレート一覧 - 人気のDIY棚デザイン12選",
  description: "DIY棚の人気テンプレート12種類を紹介。本棚、壁面収納、キッチン棚、シューズラック、デスク棚など。",
  url: "https://diy.kuras-plus.com/templates",
  isPartOf: {
    "@type": "WebSite",
    name: "DIY棚シミュレーター",
    url: "https://diy.kuras-plus.com",
  },
  hasPart: SHELF_TEMPLATES.map((t) => ({
    "@type": "HowTo",
    name: `${t.name}の作り方`,
    url: `https://diy.kuras-plus.com/templates/${t.id}`,
  })),
};

export default function TemplatesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          DIY棚テンプレート一覧
        </h1>
        <p className="mt-2 text-gray-600">
          人気のDIY棚デザイン{SHELF_TEMPLATES.length}
          種類。テンプレートを選ぶだけで、天井高に合わせた設計図と材料リストを自動生成します。
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SHELF_TEMPLATES.map((template) => (
          <Link
            key={template.id}
            href={`/templates/${template.id}`}
            className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-amber-300 hover:shadow-md transition-all group"
          >
            <div className="text-3xl mb-2">{template.icon}</div>
            <h2 className="font-bold text-gray-800 group-hover:text-amber-600 transition-colors">
              {template.name}
            </h2>
            <p className="mt-1 text-sm text-gray-500 leading-relaxed">
              {template.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1">
              {template.keywords.slice(0, 2).map((kw) => (
                <span
                  key={kw}
                  className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full"
                >
                  {kw}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
        >
          シミュレーターを使う →
        </Link>
      </div>

      {/* Amazon材料リンク */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p className="mb-2">テンプレートを選んで設計図を生成 → 材料をまとめてAmazonで購入:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { keyword: "ラブリコ 2×4 アジャスター", label: "ラブリコ" },
            { keyword: "ディアウォール 2×4", label: "ディアウォール" },
            { keyword: "2×4 木材 SPF ホワイトウッド", label: "2×4材" },
            { keyword: "パイン集成材 棚板 18mm", label: "棚板" },
          ].map((item) => (
            <a
              key={item.keyword}
              href={buildAmazonUrl(item.keyword)}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-50 border border-stone-200 text-stone-600 text-xs rounded-lg hover:border-amber-300 hover:text-amber-700 transition-colors"
            >
              🛒 {item.label}
            </a>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-400">※ Amazonアソシエイト・プログラムのリンクです</p>
      </div>
    </div>
    </>
  );
}
