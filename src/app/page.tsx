import DesignForm from "@/components/DesignForm";
import ErrorBoundary from "@/components/ErrorBoundary";
import { HOWTO_ARTICLES } from "@/data/howto-articles";
import { SHELF_TEMPLATES } from "@/data/templates";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "棚 設計シミュレーション【無料】5分でDIY設計図を自動作成 | DIY棚メーカー",
  },
  description:
    "棚の設計シミュレーションが無料でできるDIYツール。天井高を入力するだけで木材カット寸法・部材リスト・費用概算を自動計算。ラブリコ・ディアウォール対応で賃貸でもOK。今すぐ設計を始めましょう。",
  keywords: [
    "棚 設計 シミュレーション",
    "棚 レイアウト 無料ツール",
    "DIY 棚 設計",
    "つっぱり棚 DIY",
    "ラブリコ 棚 作り方",
    "ディアウォール 棚",
    "壁面収納 DIY",
    "賃貸 壁面収納",
    "DIY 棚 木材 カット 計算",
    "2×4 棚 設計図",
  ],
  openGraph: {
    title: "棚 設計シミュレーション【無料】5分でDIY設計図を自動作成 | DIY棚メーカー",
    description:
      "棚の設計シミュレーションが無料でできるDIYツール。天井高を入力するだけで木材カット寸法・部材リスト・費用概算を自動計算。ラブリコ・ディアウォール対応で賃貸OK。",
    type: "website",
    locale: "ja_JP",
    url: "https://diy-shelf-maker.kuras-plus.com",
    siteName: "DIY棚メーカー by kuras-plus",
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
  dateModified: "2026-04-09",
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

const FEATURED_SLUGS = [
  "labrico-vs-diawall",
  "rental-wall-storage-guide",
  "100yen-shop-shelf-diy",
  "beginner-diy-shelf-design",
  "wifi-router-hiding-rack-diy",
  "beginner-tools-guide",
] as const;

const featuredArticles = FEATURED_SLUGS.map((slug) =>
  HOWTO_ARTICLES.find((a) => a.slug === slug)
).filter((a): a is NonNullable<typeof a> => a != null);

const DIY_TOOLS = [
  {
    icon: "🎯",
    name: "棚選びクイズ",
    description: "質問に答えるだけで最適な棚が見つかる",
    href: "/tools/shelf-planner-quiz",
  },
  {
    icon: "💰",
    name: "材料費計算",
    description: "木材・金具の費用を自動見積もり",
    href: "/tools/material-cost-estimator",
  },
  {
    icon: "⚖️",
    name: "耐荷重計算",
    description: "棚板の安全な荷重を計算",
    href: "/tools/shelf-load-calc",
  },
  {
    icon: "🔧",
    name: "アジャスター比較",
    description: "ラブリコ・ディアウォールを一目で比較",
    href: "/tools/support-system-picker",
  },
  {
    icon: "🪚",
    name: "木材カット計算",
    description: "天井高から木材カット寸法を自動算出",
    href: "/tools/wood-cut-calculator",
  },
  {
    icon: "📋",
    name: "材料計算シミュレーター",
    description: "必要な木材・金具の数量を自動計算",
    href: "/tools/material-calculator",
  },
  {
    icon: "💪",
    name: "棚板強度チェック",
    description: "棚板のたわみ・耐荷重を検証",
    href: "/tools/strength-checker",
  },
  {
    icon: "📂",
    name: "DIYプロジェクトDB",
    description: "部屋別・目的別のDIY棚プラン50件",
    href: "/tools/projects",
  },
];

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

      {/* GW特集バナー */}
      <section className="max-w-5xl mx-auto mb-6">
        <Link
          href="/howto"
          className="block bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 rounded-2xl p-5 border border-yellow-200 hover:border-yellow-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl sm:text-4xl flex-shrink-0">🎌</span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-amber-600 tracking-wider">
                GW特集 2026
              </p>
              <h2 className="text-base sm:text-lg font-bold text-gray-800 group-hover:text-amber-600 transition-colors">
                ゴールデンウィークに作れるDIY棚10本のガイド公開中
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                100均棚・折りたたみ棚・親子DIY・1日完成棚など、GWにぴったりの記事をまとめました
              </p>
            </div>
            <span className="ml-auto text-amber-600 font-medium text-sm flex-shrink-0 group-hover:translate-x-1 transition-transform">
              見る →
            </span>
          </div>
        </Link>
      </section>

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

      {/* FAQ導線 */}
      <section className="max-w-5xl mx-auto mb-8">
        <Link
          href="/faq"
          className="block bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100 hover:border-green-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">❓</span>
            <div>
              <h2 className="text-base font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                DIY棚のよくある質問30選
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                初心者の疑問をまとめて解決。ラブリコ・耐荷重・賃貸・費用・トラブル対策まで。
              </p>
            </div>
            <span className="ml-auto text-green-600 font-medium text-sm flex-shrink-0 group-hover:translate-x-1 transition-transform">
              見る →
            </span>
          </div>
        </Link>
      </section>

      {/* メインツール */}
      <ErrorBoundary>
        <DesignForm />
      </ErrorBoundary>

      {/* 人気のDIYガイド記事セクション */}
      <section className="max-w-5xl mx-auto mt-12">
        <h2 className="text-xl font-bold text-gray-800 mb-6">人気のDIYガイド</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/howto/${article.slug}`}
              className="block bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{article.icon}</span>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-gray-800 group-hover:text-amber-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {article.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-right">
          <Link
            href="/howto"
            className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
          >
            もっと見る →
          </Link>
        </div>
      </section>

      {/* 人気テンプレートセクション */}
      <section className="max-w-5xl mx-auto mt-12">
        <h2 className="text-xl font-bold text-gray-800 mb-6">人気のテンプレート</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {SHELF_TEMPLATES.slice(0, 6).map((t) => (
            <Link
              key={t.id}
              href={`/templates/${t.id}`}
              className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-amber-300 hover:shadow-md transition-all group"
            >
              <div className="text-3xl mb-2">{t.icon}</div>
              <h3 className="font-bold text-gray-800 group-hover:text-amber-600 transition-colors text-sm">
                {t.name}
              </h3>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                {t.description}
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-right">
          <Link
            href="/templates"
            className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
          >
            全{SHELF_TEMPLATES.length}テンプレートを見る →
          </Link>
        </div>
      </section>

      {/* 便利ツールセクション */}
      <section className="max-w-5xl mx-auto mt-12">
        <h2 className="text-xl font-bold text-gray-800 mb-6">便利なDIYツール</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DIY_TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="block bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100 hover:border-amber-300 hover:shadow-sm transition-all group text-center"
            >
              <span className="text-3xl">{tool.icon}</span>
              <h3 className="text-sm font-bold text-gray-800 mt-2 group-hover:text-amber-600 transition-colors">
                {tool.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1 truncate">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* こんな方に使われています（E-E-A-T: Experience） */}
      <section className="max-w-5xl mx-auto mt-12">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          こんな方に使われています
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: "🏠",
              title: "賃貸で壁に穴を開けずに棚を作りたい方",
              desc: "突っ張り式なので原状回復OK。退去時もそのまま取り外せます。",
            },
            {
              icon: "📏",
              title: "引越し先に合わせて棚のサイズを計算したい方",
              desc: "天井高を入力するだけで、木材カット寸法と材料リストを自動生成。",
            },
            {
              icon: "🔰",
              title: "DIY初心者で何を買えばいいかわからない方",
              desc: "必要な材料・工具が一覧で出るので、ホームセンターで迷いません。",
            },
            {
              icon: "📚",
              title: "増え続ける本の収納に困っている方",
              desc: "漫画200冊分の本棚も、テンプレートから5分で設計できます。",
            },
            {
              icon: "💰",
              title: "既製品の棚が高くてサイズも合わない方",
              desc: "材料費7,000円〜で、スペースにぴったりの棚が作れます。",
            },
            {
              icon: "🐱",
              title: "ペット用の壁面キャットウォークを作りたい方",
              desc: "耐荷重計算付きで、安全な猫用ウォールシェルフを設計できます。",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <span className="text-2xl">{item.icon}</span>
              <h3 className="mt-2 font-bold text-gray-800 text-sm">
                {item.title}
              </h3>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

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

      {/* 使い方ガイドへの導線 */}
      <section className="max-w-5xl mx-auto mt-12 mb-4">
        <Link
          href="/guide"
          className="block bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:border-blue-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">📖</span>
            <div>
              <h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                使い方ガイド
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                天井高の測り方、アジャスターの選び方、木材カットの注意点など、シミュレーターの使い方を4ステップで解説します。
              </p>
            </div>
            <span className="ml-auto text-blue-600 font-medium text-sm flex-shrink-0 group-hover:translate-x-1 transition-transform">
              見る →
            </span>
          </div>
        </Link>
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
