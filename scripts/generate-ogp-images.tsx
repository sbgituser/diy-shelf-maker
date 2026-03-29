/**
 * OGP画像自動生成スクリプト
 * 使い方: npx tsx scripts/generate-ogp-images.tsx
 * 出力先: public/ogp/{howto,templates}/{slug}.png
 *
 * フォントキャッシュ: scripts/fonts/NotoSansJP-Bold.woff
 * （2回目以降のビルドでは再ダウンロードしない）
 */

import fs from "fs";
import path from "path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { HOWTO_ARTICLES } from "../src/data/howto-articles";
import { SHELF_TEMPLATES } from "../src/data/templates";

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "public", "ogp");
const FONTS_DIR = path.join(ROOT, "scripts", "fonts");

// ---------------------------------------------------------------------------
// フォント読み込み（キャッシュ付き）
// ---------------------------------------------------------------------------

async function loadFont(): Promise<ArrayBuffer> {
  const candidates = [
    path.join(FONTS_DIR, "NotoSansJP-Bold.woff"),
    path.join(FONTS_DIR, "NotoSansJP-Bold.ttf"),
    path.join(FONTS_DIR, "NotoSansJP-Bold.otf"),
  ];

  for (const fontPath of candidates) {
    if (fs.existsSync(fontPath)) {
      const buf = fs.readFileSync(fontPath);
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
    }
  }

  console.log("📥 NotoSansJP フォントをダウンロード中...");
  fs.mkdirSync(FONTS_DIR, { recursive: true });

  try {
    const url =
      "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp@5/files/noto-sans-jp-japanese-700-normal.woff";
    const fontData = await fetch(url).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.arrayBuffer();
    });
    fs.writeFileSync(path.join(FONTS_DIR, "NotoSansJP-Bold.woff"), Buffer.from(fontData));
    console.log("✅ フォントのダウンロード完了 (jsDelivr)");
    return fontData;
  } catch (err) {
    console.warn("⚠️  jsDelivr からの取得に失敗:", (err as Error).message);
  }

  try {
    const url =
      "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-700-normal.woff";
    const fontData = await fetch(url).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.arrayBuffer();
    });
    fs.writeFileSync(path.join(FONTS_DIR, "NotoSansJP-Bold.woff"), Buffer.from(fontData));
    console.log("✅ フォントのダウンロード完了 (jsDelivr fallback)");
    return fontData;
  } catch (err) {
    console.warn("⚠️  jsDelivr fallback からの取得に失敗:", (err as Error).message);
  }

  throw new Error(
    [
      "フォントの自動ダウンロードに失敗しました。",
      "以下の方法でフォントを配置してください:",
      "  npm install @fontsource/noto-sans-jp を実行後、",
      "  node_modules/@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-700-normal.woff を",
      "  scripts/fonts/NotoSansJP-Bold.woff としてコピー",
    ].join("\n")
  );
}

// ---------------------------------------------------------------------------
// OGP画像テンプレート
// ---------------------------------------------------------------------------

function calcFontSize(text: string): number {
  const len = text.length;
  if (len <= 15) return 64;
  if (len <= 25) return 54;
  if (len <= 35) return 44;
  if (len <= 50) return 36;
  return 30;
}

function buildOgElement(
  title: string,
  badgeLabel: string,
  badgeColor: string,
  typeLabel: string
): object {
  const fontSize = calcFontSize(title);

  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "1200px",
        height: "630px",
        background: "linear-gradient(135deg, #1c1208 0%, #0d0903 100%)",
        padding: "0",
        fontFamily: "Noto Sans JP",
        position: "relative",
      },
      children: [
        // トップアクセントバー（木目調アンバー）
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: "0",
              left: "0",
              right: "0",
              height: "6px",
              background: "linear-gradient(90deg, #d97706, #ea580c)",
            },
          },
        },
        // メインコンテンツエリア
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              flex: "1",
              padding: "64px",
              paddingTop: "72px",
            },
            children: [
              // バッジ行
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "32px",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          background: badgeColor,
                          color: "white",
                          fontSize: "22px",
                          fontWeight: "700",
                          padding: "6px 20px",
                          borderRadius: "100px",
                        },
                        children: badgeLabel,
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          color: "rgba(255,255,255,0.4)",
                          fontSize: "18px",
                        },
                        children: typeLabel,
                      },
                    },
                  ],
                },
              },
              // タイトル
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flex: "1",
                    alignItems: "center",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: `${fontSize}px`,
                          fontWeight: "700",
                          color: "#ffffff",
                          lineHeight: "1.45",
                          maxWidth: "1072px",
                        },
                        children: title,
                      },
                    },
                  ],
                },
              },
              // フッター
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: "1px solid rgba(255,255,255,0.15)",
                    paddingTop: "24px",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        },
                        children: [
                          {
                            type: "div",
                            props: {
                              style: {
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                background: "#d97706",
                              },
                            },
                          },
                          {
                            type: "div",
                            props: {
                              style: {
                                color: "#d97706",
                                fontSize: "22px",
                                fontWeight: "700",
                              },
                              children: "DIY棚シミュレーター",
                            },
                          },
                        ],
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          color: "rgba(255,255,255,0.35)",
                          fontSize: "17px",
                        },
                        children: "diy-shelf-maker.kuras-plus.com",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

// ---------------------------------------------------------------------------
// PNG レンダリング
// ---------------------------------------------------------------------------

async function renderToPng(
  element: object,
  fontData: ArrayBuffer,
  outputPath: string
): Promise<void> {
  const svg = await satori(element as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Noto Sans JP",
        data: fontData,
        weight: 700,
        style: "normal",
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, pngBuffer);
}

// ---------------------------------------------------------------------------
// コンテンツタイプ別ジェネレーター
// ---------------------------------------------------------------------------

async function generateDefaultImage(fontData: ArrayBuffer): Promise<void> {
  const element = buildOgElement(
    "棚レイアウト設計・木材カット寸法を無料で自動計算",
    "DIY棚シミュレーター",
    "#d97706",
    "ディアウォール・ラブリコ対応"
  );
  await renderToPng(element, fontData, path.join(OUTPUT_DIR, "default-ogp.png"));
  console.log("  ✅ default-ogp.png");
}

async function generateHowtoImages(fontData: ArrayBuffer): Promise<number> {
  let count = 0;
  for (const article of HOWTO_ARTICLES) {
    const outputPath = path.join(OUTPUT_DIR, "howto", `${article.slug}.png`);
    try {
      const element = buildOgElement(
        article.title,
        "作り方ガイド",
        "#0891b2",
        "DIYハウツー"
      );
      await renderToPng(element, fontData, outputPath);
      console.log(`  ✅ howto/${article.slug}.png`);
      count++;
    } catch (err) {
      console.error(`  ❌ howto/${article.slug}.png:`, (err as Error).message);
    }
  }
  return count;
}

async function generateTemplateImages(fontData: ArrayBuffer): Promise<number> {
  let count = 0;
  for (const template of SHELF_TEMPLATES) {
    const outputPath = path.join(OUTPUT_DIR, "templates", `${template.id}.png`);
    try {
      const title = `${template.name}の設計図・材料リスト`;
      const element = buildOgElement(title, "テンプレート", "#d97706", "棚DIYレシピ");
      await renderToPng(element, fontData, outputPath);
      console.log(`  ✅ templates/${template.id}.png`);
      count++;
    } catch (err) {
      console.error(`  ❌ templates/${template.id}.png:`, (err as Error).message);
    }
  }
  return count;
}

// ---------------------------------------------------------------------------
// メイン
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log("🎨 OGP画像を生成中...\n");
  const startTime = Date.now();

  let fontData: ArrayBuffer;
  try {
    fontData = await loadFont();
  } catch (err) {
    console.error("\n❌ フォントの読み込みに失敗しました:");
    console.error((err as Error).message);
    process.exit(1);
  }

  let totalCount = 0;

  console.log("\n🔖 デフォルトOGP画像を生成中...");
  await generateDefaultImage(fontData);
  totalCount += 1;

  console.log("\n📖 作り方ガイドのOGP画像を生成中...");
  totalCount += await generateHowtoImages(fontData);

  console.log("\n🪵 テンプレートのOGP画像を生成中...");
  totalCount += await generateTemplateImages(fontData);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✅ 合計 ${totalCount} 枚のOGP画像を生成しました → public/ogp/ (${elapsed}秒)`);
}

main().catch((err) => {
  console.error("\n❌ OGP画像生成に失敗しました:", err);
  process.exit(1);
});
