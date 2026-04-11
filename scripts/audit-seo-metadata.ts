/**
 * SEO Metadata Audit Script
 *
 * out/ 配下の全HTMLを解析し、以下を検証:
 * - <meta name="robots"> の値（noindex/nofollow検出）
 * - <link rel="canonical"> の値
 * - <title> の長さ
 * - <meta name="description"> の長さ
 * - H1タグの存在と一意性
 * - structured data（JSON-LD）の存在
 *
 * Usage: npx tsx scripts/audit-seo-metadata.ts
 */

import fs from "fs";
import path from "path";
import { parse, HTMLElement } from "node-html-parser";

const OUT_DIR = path.resolve(__dirname, "../out");
const BASE_URL = "https://diy-shelf-maker.kuras-plus.com";

interface PageAudit {
  file: string;
  url: string;
  title: string | null;
  titleLength: number;
  description: string | null;
  descriptionLength: number;
  robots: string | null;
  canonical: string | null;
  h1Count: number;
  h1Texts: string[];
  hasJsonLd: boolean;
  issues: string[];
}

interface AuditSummary {
  totalPages: number;
  pagesWithIssues: number;
  issueBreakdown: {
    noindex: number;
    canonicalMismatch: number;
    titleIssue: number;
    descriptionIssue: number;
    h1Issue: number;
    noJsonLd: number;
  };
  pages: PageAudit[];
}

function findHtmlFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findHtmlFiles(fullPath));
    } else if (entry.name.endsWith(".html")) {
      results.push(fullPath);
    }
  }
  return results;
}

function filePathToUrl(filePath: string): string {
  let rel = path.relative(OUT_DIR, filePath).replace(/\\/g, "/");
  // index.html → directory URL
  rel = rel.replace(/\/index\.html$/, "").replace(/^index\.html$/, "");
  // .html → remove extension for non-index files
  rel = rel.replace(/\.html$/, "");
  return rel ? `${BASE_URL}/${rel}` : BASE_URL;
}

function auditPage(filePath: string): PageAudit {
  const html = fs.readFileSync(filePath, "utf-8");
  const root = parse(html);
  const issues: string[] = [];

  // Title
  const titleEl = root.querySelector("title");
  const title = titleEl?.textContent?.trim() || null;
  const titleLength = title?.length || 0;

  // Description
  const descEl = root.querySelector('meta[name="description"]');
  const description = descEl?.getAttribute("content")?.trim() || null;
  const descriptionLength = description?.length || 0;

  // Robots
  const robotsEl = root.querySelector('meta[name="robots"]');
  const robots = robotsEl?.getAttribute("content")?.trim() || null;

  // Canonical
  const canonicalEl = root.querySelector('link[rel="canonical"]');
  const canonical = canonicalEl?.getAttribute("href")?.trim() || null;

  // H1
  const h1Els = root.querySelectorAll("h1");
  const h1Count = h1Els.length;
  const h1Texts = h1Els.map((el) => el.textContent?.trim() || "");

  // JSON-LD
  const jsonLdEls = root.querySelectorAll('script[type="application/ld+json"]');
  const hasJsonLd = jsonLdEls.length > 0;

  const expectedUrl = filePathToUrl(filePath);

  // Issue detection
  // Pattern A: noindex
  if (robots && /noindex/i.test(robots)) {
    issues.push(`NOINDEX: meta robots="${robots}"`);
  }

  // Pattern B: canonical mismatch
  if (canonical && canonical !== expectedUrl) {
    // Allow trailing slash variations
    const normalizedCanonical = canonical.replace(/\/$/, "");
    const normalizedExpected = expectedUrl.replace(/\/$/, "");
    if (normalizedCanonical !== normalizedExpected) {
      issues.push(`CANONICAL_MISMATCH: canonical="${canonical}" expected="${expectedUrl}"`);
    }
  }
  if (!canonical) {
    issues.push("CANONICAL_MISSING: no canonical link");
  }

  // Pattern C: title issues
  if (!title || titleLength === 0) {
    issues.push("TITLE_EMPTY: no title tag");
  } else if (titleLength < 10) {
    issues.push(`TITLE_SHORT: title length=${titleLength} (min 10)`);
  } else if (titleLength > 60) {
    issues.push(`TITLE_LONG: title length=${titleLength} (max 60)`);
  }

  // Pattern C: description issues
  if (!description || descriptionLength === 0) {
    issues.push("DESC_EMPTY: no meta description");
  } else if (descriptionLength < 50) {
    issues.push(`DESC_SHORT: description length=${descriptionLength} (min 50)`);
  } else if (descriptionLength > 160) {
    issues.push(`DESC_LONG: description length=${descriptionLength} (max 160)`);
  }

  // Pattern D: H1 issues
  if (h1Count === 0) {
    issues.push("H1_MISSING: no H1 tag found");
  } else if (h1Count > 1) {
    issues.push(`H1_MULTIPLE: ${h1Count} H1 tags found`);
  }

  // JSON-LD
  if (!hasJsonLd) {
    issues.push("JSONLD_MISSING: no structured data found");
  }

  return {
    file: path.relative(OUT_DIR, filePath).replace(/\\/g, "/"),
    url: expectedUrl,
    title,
    titleLength,
    description,
    descriptionLength,
    robots,
    canonical,
    h1Count,
    h1Texts,
    hasJsonLd,
    issues,
  };
}

function main() {
  if (!fs.existsSync(OUT_DIR)) {
    console.error("ERROR: out/ directory not found. Run 'npm run build' first.");
    process.exit(1);
  }

  const htmlFiles = findHtmlFiles(OUT_DIR);
  console.log(`\n📄 Found ${htmlFiles.length} HTML files in out/\n`);

  const audits = htmlFiles.map(auditPage);

  const summary: AuditSummary = {
    totalPages: audits.length,
    pagesWithIssues: audits.filter((a) => a.issues.length > 0).length,
    issueBreakdown: {
      noindex: audits.filter((a) => a.issues.some((i) => i.startsWith("NOINDEX"))).length,
      canonicalMismatch: audits.filter((a) =>
        a.issues.some((i) => i.startsWith("CANONICAL_MISMATCH") || i.startsWith("CANONICAL_MISSING"))
      ).length,
      titleIssue: audits.filter((a) =>
        a.issues.some((i) => i.startsWith("TITLE_"))
      ).length,
      descriptionIssue: audits.filter((a) =>
        a.issues.some((i) => i.startsWith("DESC_"))
      ).length,
      h1Issue: audits.filter((a) =>
        a.issues.some((i) => i.startsWith("H1_"))
      ).length,
      noJsonLd: audits.filter((a) =>
        a.issues.some((i) => i.startsWith("JSONLD_"))
      ).length,
    },
    pages: audits,
  };

  // Write JSON report
  const reportPath = path.join(OUT_DIR, "seo-audit-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2), "utf-8");
  console.log(`📝 Report written to: ${reportPath}\n`);

  // Console summary
  console.log("=" .repeat(60));
  console.log("  SEO METADATA AUDIT SUMMARY");
  console.log("=".repeat(60));
  console.log(`  Total pages scanned:     ${summary.totalPages}`);
  console.log(`  Pages with issues:       ${summary.pagesWithIssues}`);
  console.log("");
  console.log("  Issue Breakdown:");
  console.log(`    Pattern A (noindex):       ${summary.issueBreakdown.noindex}`);
  console.log(`    Pattern B (canonical):     ${summary.issueBreakdown.canonicalMismatch}`);
  console.log(`    Pattern C (title):         ${summary.issueBreakdown.titleIssue}`);
  console.log(`    Pattern C (description):   ${summary.issueBreakdown.descriptionIssue}`);
  console.log(`    Pattern D (H1):            ${summary.issueBreakdown.h1Issue}`);
  console.log(`    No JSON-LD:                ${summary.issueBreakdown.noJsonLd}`);
  console.log("=".repeat(60));

  // Show pages with issues
  const pagesWithIssues = audits.filter((a) => a.issues.length > 0);
  if (pagesWithIssues.length > 0) {
    console.log("\n⚠️  PAGES WITH ISSUES:\n");
    for (const page of pagesWithIssues) {
      console.log(`  ${page.file}`);
      console.log(`    URL: ${page.url}`);
      for (const issue of page.issues) {
        console.log(`    ❌ ${issue}`);
      }
      console.log("");
    }
  } else {
    console.log("\n✅ No issues found!\n");
  }

  // Title/description duplicate check
  const titleCounts = new Map<string, string[]>();
  for (const a of audits) {
    if (a.title) {
      const files = titleCounts.get(a.title) || [];
      files.push(a.file);
      titleCounts.set(a.title, files);
    }
  }
  const duplicateTitles = [...titleCounts.entries()].filter(([, files]) => files.length > 1);
  if (duplicateTitles.length > 0) {
    console.log("⚠️  DUPLICATE TITLES:\n");
    for (const [title, files] of duplicateTitles) {
      console.log(`  "${title.substring(0, 50)}..."`);
      for (const f of files) {
        console.log(`    - ${f}`);
      }
    }
    console.log("");
  }

  process.exit(pagesWithIssues.length > 0 ? 1 : 0);
}

main();
