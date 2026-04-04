import type { GridDesign, PartItem } from "@/types";
import { LUMBER_SPECS, SHELF_BOARDS } from "@/data/products";
import { calculateGridParts } from "./grid-calculator";

// ─────────────────────────────────────────
// jsPDF を動的インポート（SSG 対応）
// ─────────────────────────────────────────

// resolveAdj は src/lib/resolvers.ts に統合済み
import { resolveAdjuster as resolveAdj } from "./resolvers";

/** カテゴリ日本語名 */
function categoryLabel(cat: PartItem["category"]): string {
  switch (cat) {
    case "adjuster": return "アジャスター";
    case "lumber": return "木材";
    case "shelf": return "棚板";
    case "bracket": return "金具";
    case "screw": return "ネジ";
    default: return "";
  }
}

/**
 * GridDesign から PDF を生成してダウンロードする
 */
export async function exportDesignPdf(design: GridDesign): Promise<void> {
  if (!design || !design.pillars || design.pillars.length === 0) {
    throw new Error("設計データが空です。柱を追加してからPDFを出力してください。");
  }

  // 動的インポート（ブラウザのみ）
  let jsPDF: typeof import("jspdf").default;
  try {
    const mod = await import("jspdf");
    jsPDF = mod.default;
    await import("jspdf-autotable");
  } catch {
    throw new Error("PDFライブラリの読み込みに失敗しました。ページを再読み込みしてお試しください。");
  }

  const { partsList, totalEstimate } = calculateGridParts(design);
  const pillarMap = new Map(design.pillars.map((p) => [p.id, p]));

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = 210; // A4 幅
  const margin = 15;
  const cw = pw - margin * 2; // コンテンツ幅

  // ── フォント設定（日本語はHelveticaの代替で表示） ──
  // jsPDF のデフォルトフォントは日本語非対応のため、
  // 代わりにシンプルな英字 + Unicode テキスト描画を活用

  let y = margin;

  // ════════════════════════════════════════
  // タイトル
  // ════════════════════════════════════════
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("DIY Shelf Design", pw / 2, y, { align: "center" });
  y += 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120);
  const now = new Date();
  const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}`;
  doc.text(`diy-shelf-maker.kuras-plus.com  |  ${dateStr}`, pw / 2, y, { align: "center" });
  doc.setTextColor(0);
  y += 8;

  // ════════════════════════════════════════
  // 基本情報
  // ════════════════════════════════════════
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Basic Info", margin, y);
  y += 5;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  const infoLines = [
    `Ceiling Height: ${design.ceilingHeight}mm`,
    `Pillars: ${design.pillars.length}`,
    `Shelves: ${design.shelves.length}`,
    `Estimated Total: ${totalEstimate.toLocaleString()} JPY`,
  ];
  for (const line of infoLines) {
    doc.text(line, margin + 2, y);
    y += 4.5;
  }
  y += 3;

  // ════════════════════════════════════════
  // 設計図（正面図）
  // ════════════════════════════════════════
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Front View", margin, y);
  y += 3;

  // 描画領域
  const diagW = cw;
  const diagH = 80;
  const diagX = margin;
  const diagY = y;

  // 背景枠
  doc.setDrawColor(200);
  doc.setFillColor(252, 252, 250);
  doc.roundedRect(diagX, diagY, diagW, diagH, 2, 2, "FD");

  // mm → PDF座標変換
  const maxX = Math.max(1500, ...design.pillars.map((p) => p.x)) + 300;
  const dMargin = { left: 15, right: 10, top: 8, bottom: 10 };
  const dw = diagW - dMargin.left - dMargin.right;
  const dh = diagH - dMargin.top - dMargin.bottom;

  const toX = (mm: number) => diagX + dMargin.left + (mm / maxX) * dw;
  const toY = (mm: number) => diagY + dMargin.top + dh - (mm / design.ceilingHeight) * dh;

  // 天井線（破線）
  doc.setDrawColor(170);
  doc.setLineWidth(0.3);
  doc.setLineDashPattern([2, 1.5], 0);
  doc.line(toX(0), toY(design.ceilingHeight), toX(maxX - 200), toY(design.ceilingHeight));
  doc.setFontSize(6);
  doc.setTextColor(150);
  doc.text("ceiling", toX(0) - 1, toY(design.ceilingHeight) - 1, { align: "right" });

  // 床線
  doc.setLineDashPattern([], 0);
  doc.setDrawColor(140);
  doc.setLineWidth(0.5);
  doc.line(toX(0), toY(0), toX(maxX - 200), toY(0));
  doc.text("floor", toX(0) - 1, toY(0) + 3, { align: "right" });
  doc.setTextColor(0);

  // 棚板の描画
  doc.setLineWidth(0.3);
  for (const shelf of design.shelves) {
    const lp = pillarMap.get(shelf.leftPillarId);
    const rp = pillarMap.get(shelf.rightPillarId);
    if (!lp || !rp) continue;
    const sx = toX(Math.min(lp.x, rp.x));
    const ex = toX(Math.max(lp.x, rp.x));
    const sy = toY(shelf.y);
    const board = SHELF_BOARDS.find((b) => b.id === shelf.material);
    const thMm = board?.thicknessMm ?? 18;
    const thPdf = Math.max(thMm * (dh / design.ceilingHeight), 1.2);

    doc.setFillColor(212, 167, 106);
    doc.setDrawColor(155, 117, 48);
    doc.rect(sx, sy - thPdf / 2, ex - sx, thPdf, "FD");

    // 高さラベル
    doc.setFontSize(5);
    doc.setTextColor(100);
    doc.text(`${shelf.y}mm`, ex + 1, sy + 1);
  }

  // 柱の描画
  const pillarW = 4; // PDF mm
  for (const pillar of design.pillars) {
    const px = toX(pillar.x) - pillarW / 2;
    const py = toY(design.ceilingHeight);
    const ph = toY(0) - py;

    doc.setFillColor(196, 164, 106);
    doc.setDrawColor(139, 105, 20);
    doc.setLineWidth(0.3);

    if (pillar.adjuster) {
      // アジャスター部分
      doc.setFillColor(100, 100, 100);
      doc.rect(px - 0.3, py, pillarW + 0.6, 2, "FD");
      doc.rect(px - 0.3, py + ph - 2, pillarW + 0.6, 2, "FD");
      // 柱本体（アジャスター間）
      doc.setFillColor(196, 164, 106);
      doc.rect(px, py + 2, pillarW, ph - 4, "FD");
    } else {
      doc.rect(px, py, pillarW, ph, "FD");
    }

    // X位置ラベル
    doc.setFontSize(5);
    doc.setTextColor(80);
    doc.text(`${pillar.x}mm`, toX(pillar.x), toY(0) + 4, { align: "center" });
  }

  doc.setTextColor(0);
  y = diagY + diagH + 5;

  // ════════════════════════════════════════
  // 柱の詳細
  // ════════════════════════════════════════
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Pillar Details", margin, y);
  y += 5;

  const pillarRows: string[][] = [];
  for (let i = 0; i < design.pillars.length; i++) {
    const p = design.pillars[i];
    const lumber = LUMBER_SPECS[p.lumber] ?? LUMBER_SPECS["2x4"];
    const adj = p.adjuster ? resolveAdj(p.adjuster, p.lumber) : null;
    const cutLen = adj ? design.ceilingHeight - adj.cutOffset : design.ceilingHeight;
    pillarRows.push([
      `#${i + 1}`,
      `${p.x}mm`,
      lumber.name.split(" ")[0],
      adj ? adj.name : "None",
      `${cutLen}mm`,
    ]);
  }

  (doc as any).autoTable({
    startY: y,
    margin: { left: margin, right: margin },
    head: [["No.", "Position", "Lumber", "Adjuster", "Cut Length"]],
    body: pillarRows,
    styles: { fontSize: 8, cellPadding: 1.5 },
    headStyles: { fillColor: [196, 164, 106], textColor: [50, 30, 0], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [252, 250, 245] },
    theme: "grid",
  });

  y = (doc as any).lastAutoTable.finalY + 5;

  // ════════════════════════════════════════
  // 棚板の詳細
  // ════════════════════════════════════════
  if (design.shelves.length > 0) {
    if (y > 250) { doc.addPage(); y = margin; }

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Shelf Details", margin, y);
    y += 5;

    const shelfRows: string[][] = [];
    for (let i = 0; i < design.shelves.length; i++) {
      const s = design.shelves[i];
      const lp = pillarMap.get(s.leftPillarId);
      const rp = pillarMap.get(s.rightPillarId);
      const width = lp && rp ? Math.abs(rp.x - lp.x) : 0;
      const board = SHELF_BOARDS.find((b) => b.id === s.material) ?? SHELF_BOARDS[0];
      const depth = board.fixedDepthMm > 0 ? board.fixedDepthMm : s.depth;
      shelfRows.push([
        `#${i + 1}`,
        `${s.y}mm`,
        `${width}mm`,
        `${depth}mm`,
        board.name,
        `${board.thicknessMm}mm`,
      ]);
    }

    (doc as any).autoTable({
      startY: y,
      margin: { left: margin, right: margin },
      head: [["No.", "Height", "Width", "Depth", "Material", "Thickness"]],
      body: shelfRows,
      styles: { fontSize: 8, cellPadding: 1.5 },
      headStyles: { fillColor: [212, 167, 106], textColor: [50, 30, 0], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [252, 250, 245] },
      theme: "grid",
    });

    y = (doc as any).lastAutoTable.finalY + 5;
  }

  // ════════════════════════════════════════
  // 必要部材リスト
  // ════════════════════════════════════════
  if (y > 230) { doc.addPage(); y = margin; }

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Parts List", margin, y);
  y += 5;

  const partsRows: string[][] = partsList.map((p) => [
    categoryLabel(p.category),
    p.name,
    String(p.quantity),
    `${p.unitPrice.toLocaleString()}`,
    `${p.subtotal.toLocaleString()}`,
    p.note ?? "",
  ]);

  (doc as any).autoTable({
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Category", "Name", "Qty", "Unit (JPY)", "Subtotal", "Note"]],
    body: partsRows,
    styles: { fontSize: 7.5, cellPadding: 1.5 },
    headStyles: { fillColor: [80, 80, 80], textColor: [255, 255, 255], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 248, 248] },
    theme: "grid",
    columnStyles: {
      2: { halign: "center" },
      3: { halign: "right" },
      4: { halign: "right" },
    },
  });

  y = (doc as any).lastAutoTable.finalY + 3;

  // 合計
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Estimate: ${totalEstimate.toLocaleString()} JPY`, margin + cw, y, { align: "right" });
  y += 8;

  // ════════════════════════════════════════
  // フッター
  // ════════════════════════════════════════
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150);
    doc.text(
      `Generated by diy-shelf-maker.kuras-plus.com  |  Page ${i}/${pageCount}`,
      pw / 2,
      292,
      { align: "center" },
    );
  }

  // ── ダウンロード ──
  doc.save(`shelf-design-${dateStr.replace(/\//g, "")}.pdf`);
}
