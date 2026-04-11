/**
 * 全ページのtitle/description/H1を抽出してCSV出力するスクリプト
 *
 * 使い方: npx tsx scripts/audit-title-description.ts
 */

import { HOWTO_ARTICLES } from "../src/data/howto-articles";
import { SHELF_TEMPLATES } from "../src/data/templates";
import { PARTS_DICTIONARY } from "../src/data/parts-dictionary";
import { PART_CATEGORIES } from "../src/data/part-categories";
import * as fs from "fs";
import * as path from "path";

interface PageMeta {
  type: string;
  slug: string;
  url: string;
  title: string;
  metaTitle: string;
  description: string;
  metaDescription: string;
  titleLength: number;
  metaTitleLength: number;
  descriptionLength: number;
  metaDescriptionLength: number;
}

const rows: PageMeta[] = [];

// --- Howto Articles ---
for (const a of HOWTO_ARTICLES) {
  const metaTitle = (a as any).metaTitle ?? a.title;
  const metaDesc = (a as any).metaDescription ?? a.description;
  rows.push({
    type: "howto",
    slug: a.slug,
    url: `/howto/${a.slug}`,
    title: a.title,
    metaTitle,
    description: a.description,
    metaDescription: metaDesc,
    titleLength: a.title.length,
    metaTitleLength: metaTitle.length,
    descriptionLength: a.description.length,
    metaDescriptionLength: metaDesc.length,
  });
}

// --- Templates ---
for (const t of SHELF_TEMPLATES) {
  const metaTitle = `${t.name}の設計図＆材料リスト【無料シミュレーター】`;
  const metaDesc = `${t.name}の設計図を無料で作成。${t.description} 天井高を入力するだけで木材カット寸法・部材リスト・費用概算を自動計算。テンプレートを使って今すぐ設計を始めましょう。`;
  rows.push({
    type: "template",
    slug: t.id,
    url: `/templates/${t.id}`,
    title: t.name,
    metaTitle,
    description: t.description,
    metaDescription: metaDesc,
    titleLength: t.name.length,
    metaTitleLength: metaTitle.length,
    descriptionLength: t.description.length,
    metaDescriptionLength: metaDesc.length,
  });
}

// --- Parts ---
for (const p of PARTS_DICTIONARY) {
  const metaTitle = `${p.name}の選び方・おすすめ｜仕様・価格を解説`;
  const metaDesc = `${p.name}（${p.nameEn}）の仕様・耐荷重・価格をDIY初心者向けに徹底解説。${p.description} 選び方のコツとおすすめ情報もチェック。`;
  rows.push({
    type: "parts",
    slug: p.id,
    url: `/parts/${p.id}`,
    title: p.name,
    metaTitle,
    description: p.description,
    metaDescription: metaDesc,
    titleLength: p.name.length,
    metaTitleLength: metaTitle.length,
    descriptionLength: p.description.length,
    metaDescriptionLength: metaDesc.length,
  });
}

// --- Part Categories ---
for (const c of PART_CATEGORIES) {
  const metaTitle = `${c.name}の種類と選び方【おすすめ付き】DIY棚パーツ辞典`;
  const metaDesc = `${c.name}（${c.nameEn}）の種類・価格・選び方をDIY初心者向けに解説。${c.description}`;
  rows.push({
    type: "part-category",
    slug: c.slug,
    url: `/parts/category/${c.slug}`,
    title: c.name,
    metaTitle,
    description: c.description,
    metaDescription: metaDesc,
    titleLength: c.name.length,
    metaTitleLength: metaTitle.length,
    descriptionLength: c.description.length,
    metaDescriptionLength: metaDesc.length,
  });
}

// --- CSV Output ---
const escape = (s: string) => `"${s.replace(/"/g, '""')}"`;
const header = [
  "type",
  "slug",
  "url",
  "title(H1)",
  "metaTitle",
  "description",
  "metaDescription",
  "H1文字数",
  "metaTitle文字数",
  "description文字数",
  "metaDescription文字数",
];

const csvLines = [header.join(",")];
for (const r of rows) {
  csvLines.push(
    [
      r.type,
      r.slug,
      r.url,
      escape(r.title),
      escape(r.metaTitle),
      escape(r.description),
      escape(r.metaDescription),
      r.titleLength,
      r.metaTitleLength,
      r.descriptionLength,
      r.metaDescriptionLength,
    ].join(",")
  );
}

const outDir = path.join(__dirname, "..", "audit");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "title-description-audit.csv");
fs.writeFileSync(outPath, "\uFEFF" + csvLines.join("\n"), "utf-8");

console.log(`✅ Audit complete: ${rows.length} pages exported`);
console.log(`   Output: ${outPath}`);
console.log("");

// --- Summary ---
const warnings: string[] = [];
for (const r of rows) {
  if (r.metaTitleLength > 60) {
    warnings.push(
      `⚠️  [${r.type}] ${r.slug}: metaTitle ${r.metaTitleLength}文字 (>60)`
    );
  }
  if (r.metaDescriptionLength < 120 || r.metaDescriptionLength > 160) {
    warnings.push(
      `⚠️  [${r.type}] ${r.slug}: metaDescription ${r.metaDescriptionLength}文字 (目標: 120-160)`
    );
  }
}

if (warnings.length > 0) {
  console.log(`\n⚠️  Warnings (${warnings.length}):`);
  for (const w of warnings) console.log(`   ${w}`);
} else {
  console.log("✅ No warnings");
}

// --- Duplicate title check ---
const titleCounts = new Map<string, string[]>();
for (const r of rows) {
  const existing = titleCounts.get(r.metaTitle) ?? [];
  existing.push(`${r.type}:${r.slug}`);
  titleCounts.set(r.metaTitle, existing);
}
const dupes = [...titleCounts.entries()].filter(([, v]) => v.length > 1);
if (dupes.length > 0) {
  console.log(`\n⚠️  Duplicate titles (${dupes.length}):`);
  for (const [title, slugs] of dupes) {
    console.log(`   "${title}" → ${slugs.join(", ")}`);
  }
}
