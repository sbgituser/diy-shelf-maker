import { HOWTO_ARTICLES } from "@/data/howto-articles";
import { SHELF_TEMPLATES } from "@/data/templates";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// SSGで全記事ページを事前生成
export function generateStaticParams() {
  return HOWTO_ARTICLES.map((a) => ({ slug: a.slug }));
}

// 動的メタデータ生成
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = HOWTO_ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      locale: "ja_JP",
      publishedTime: article.publishedAt,
      url: `https://diy.kuras-plus.com/howto/${article.slug}`,
      siteName: "DIY棚シミュレーター by kuras-plus",
    },
    alternates: {
      canonical: `https://diy.kuras-plus.com/howto/${article.slug}`,
    },
  };
}

export default async function HowtoArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = HOWTO_ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  // 関連テンプレートを取得
  const relatedTemplates = SHELF_TEMPLATES.filter((t) =>
    article.relatedTemplates.includes(t.id)
  );

  // HowTo JSON-LD 構造化データ
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: article.title,
    description: article.description,
    step: article.sections
      .filter((s) => s.heading.startsWith("Step"))
      .map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.heading,
        text: s.paragraphs.join(" "),
      })),
  };

  // FAQPage JSON-LD
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* パンくずリスト */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-amber-600">
          トップ
        </Link>
        <span className="mx-2">›</span>
        <Link href="/howto" className="hover:text-amber-600">
          作り方ガイド
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">{article.title}</span>
      </nav>

      {/* 記事ヘッダー */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{article.icon}</span>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl leading-tight">
            {article.title}
          </h1>
        </div>
        <p className="text-gray-600 leading-relaxed">{article.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {article.keywords.map((kw) => (
            <span
              key={kw}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
            >
              {kw}
            </span>
          ))}
        </div>
      </header>

      {/* 目次 */}
      <nav className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-200">
        <h2 className="font-bold text-gray-800 text-sm mb-3">📑 この記事の内容</h2>
        <ol className="space-y-1">
          {article.sections.map((section, i) => (
            <li key={i} className="text-sm">
              <a
                href={`#section-${i}`}
                className="text-gray-600 hover:text-amber-600 transition-colors"
              >
                {i + 1}. {section.heading}
              </a>
            </li>
          ))}
          <li className="text-sm">
            <a
              href="#faq"
              className="text-gray-600 hover:text-amber-600 transition-colors"
            >
              {article.sections.length + 1}. よくある質問
            </a>
          </li>
        </ol>
      </nav>

      {/* 記事本文 */}
      <article className="space-y-10">
        {article.sections.map((section, i) => (
          <section key={i} id={`section-${i}`}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              {section.heading}
            </h2>
            {section.paragraphs.map((p, j) => (
              <p
                key={j}
                className="text-gray-700 leading-relaxed mb-3 text-[15px]"
              >
                {p}
              </p>
            ))}
            {section.list && (
              <ul className="mt-3 space-y-2">
                {section.list.map((item, k) => (
                  <li
                    key={k}
                    className="flex items-start gap-2 text-gray-700 text-[15px]"
                  >
                    <span className="text-amber-500 mt-1 flex-shrink-0">
                      ▸
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {section.tip && (
              <div className="mt-4 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                <p className="text-sm text-amber-800">
                  <span className="font-bold">💡 ポイント:</span>{" "}
                  {section.tip}
                </p>
              </div>
            )}
          </section>
        ))}

        {/* FAQ */}
        <section id="faq">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            よくある質問
          </h2>
          <div className="space-y-4">
            {article.faq.map((f, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 flex items-start gap-2">
                  <span className="text-amber-500 font-bold flex-shrink-0">
                    Q.
                  </span>
                  {f.q}
                </h3>
                <p className="mt-2 text-gray-700 text-[15px] leading-relaxed pl-6">
                  <span className="text-blue-500 font-bold">A.</span> {f.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </article>

      {/* CTA */}
      <div className="mt-12 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8 text-center border border-amber-200">
        <h2 className="text-lg font-bold text-gray-900">
          棚のサイズ、自動計算しませんか？
        </h2>
        <p className="mt-2 text-gray-600 text-sm">
          天井高を入力するだけで、カット寸法・材料リスト・設計図が無料で生成されます
        </p>
        <Link
          href="/"
          className="inline-block mt-4 bg-amber-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
        >
          無料シミュレーターを試す →
        </Link>
      </div>

      {/* 関連テンプレート */}
      {relatedTemplates.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            関連する棚テンプレート
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {relatedTemplates.map((t) => (
              <Link
                key={t.id}
                href={`/templates/${t.id}`}
                className="group block bg-white border border-gray-200 rounded-lg p-4 hover:border-amber-300 hover:shadow-sm transition-all"
              >
                <span className="text-2xl">{t.icon}</span>
                <h3 className="mt-2 font-semibold text-gray-800 text-sm group-hover:text-amber-600 transition-colors">
                  {t.name}
                </h3>
                <p className="mt-1 text-xs text-gray-500">{t.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 他のガイド記事 */}
      <div className="mt-10 mb-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          他のガイド記事
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {HOWTO_ARTICLES.filter((a) => a.slug !== article.slug)
            .slice(0, 4)
            .map((a) => (
              <Link
                key={a.slug}
                href={`/howto/${a.slug}`}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 hover:border-amber-300 transition-all"
              >
                <span className="text-xl flex-shrink-0">{a.icon}</span>
                <span className="text-sm font-medium text-gray-700 hover:text-amber-600">
                  {a.title}
                </span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
