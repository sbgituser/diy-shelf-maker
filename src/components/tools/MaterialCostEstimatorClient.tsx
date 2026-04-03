"use client";

import { useState, useMemo, useCallback } from "react";
import {
  MATERIALS,
  MATERIALS_MAP,
  BOARD_TYPES,
  SUPPORT_TYPE_OPTIONS,
  type ShelfConfig,
  type CostEstimate,
  type MaterialItem,
} from "@/constants/materialCostEstimator";
import { SHELF_TEMPLATES } from "@/data/templates";
import { buildAmazonUrl } from "@/data/products";

// ── 数量計算ロジック ──

/** 棚板に必要な板材枚数を計算 */
function calcBoardCount(
  shelfWidthMm: number,
  shelfDepthMm: number,
  shelves: number,
  boardLengthMm: number,
  boardWidthMm: number
): number {
  // 棚板1枚あたり、何枚の板材が必要か
  const widthBoards = Math.ceil(shelfWidthMm / boardLengthMm);
  const depthBoards = Math.ceil(shelfDepthMm / boardWidthMm);
  return widthBoards * depthBoards * shelves;
}

/** 支柱（2×4材）の必要本数 */
function calcPillarCount(supportType: string): number {
  switch (supportType) {
    case "diawall":
    case "labrico":
      return 2; // 標準2本
    case "standalone":
      return 4; // 四隅
    case "wall-mount":
    default:
      return 0;
  }
}

/** 塗装面積から必要量を計算（200mlで約2㎡） */
function calcPaintNeeded(
  shelfWidthMm: number,
  shelfDepthMm: number,
  shelves: number
): number {
  const areaM2 =
    ((shelfWidthMm / 1000) * (shelfDepthMm / 1000) * 2 * shelves); // 表裏
  return Math.ceil(areaM2 / 2); // 200mlで約2㎡
}

/** 見積もり計算 */
function estimateCost(config: ShelfConfig): CostEstimate {
  const items: CostEstimate["items"] = [];
  const supportOption = SUPPORT_TYPE_OPTIONS.find(
    (s) => s.id === config.supportType
  );

  // 1. 棚板
  const boardType = BOARD_TYPES.find((b) => b.id === config.material);
  if (boardType) {
    const boardCount = calcBoardCount(
      config.width,
      config.depth,
      config.shelves,
      boardType.lengthMm,
      boardType.widthMm
    );
    const mat = MATERIALS.find(
      (m) => m.category === "木材" && m.amazonKeyword.includes(boardType.amazonKeyword.split(" ")[0])
    );
    if (mat) {
      items.push({
        material: mat,
        quantity: boardCount,
        subtotal: [mat.priceMin * boardCount, mat.priceMax * boardCount],
      });
    } else {
      // 板材をMaterialItemとして直接追加
      const syntheticMat: MaterialItem = {
        id: boardType.id,
        name: boardType.name,
        category: "木材",
        unit: "枚",
        priceMin: boardType.priceMin,
        priceMax: boardType.priceMax,
        amazonKeyword: boardType.amazonKeyword,
        note: "棚板用",
      };
      items.push({
        material: syntheticMat,
        quantity: boardCount,
        subtotal: [boardType.priceMin * boardCount, boardType.priceMax * boardCount],
      });
    }
  }

  // 2. 支柱
  const pillarCount = calcPillarCount(config.supportType);
  if (pillarCount > 0) {
    const pillarMat = MATERIALS_MAP.get("2x4-pillar");
    if (pillarMat) {
      // 高さに応じて必要本数（6F=1820mmを超える場合は追加）
      const pillarsPerColumn = Math.ceil(config.height / 1820);
      const totalPillars = pillarCount * pillarsPerColumn;
      items.push({
        material: pillarMat,
        quantity: totalPillars,
        subtotal: [
          pillarMat.priceMin * totalPillars,
          pillarMat.priceMax * totalPillars,
        ],
      });
    }
  }

  // 3. 支柱方式固有の金具
  if (supportOption) {
    for (const matId of supportOption.requiredMaterials) {
      if (matId === "2x4-pillar") continue; // 支柱は上で計算済み
      const mat = MATERIALS_MAP.get(matId);
      if (!mat) continue;

      let qty = 1;
      if (matId === "diawall-set" || matId === "labrico-set") {
        qty = pillarCount;
      } else if (matId === "shelf-bracket") {
        qty = config.shelves;
      } else if (matId === "l-bracket") {
        qty = config.shelves * 2; // 棚板1枚につき左右2個
      } else if (matId === "shelf-column") {
        qty = pillarCount; // 棚柱は支柱と同数
      } else if (matId === "shelf-dabo") {
        qty = config.shelves * 4; // 棚板1枚につき4個
      } else if (matId === "anchor-bolt") {
        qty = config.shelves * 2;
      } else if (matId === "wood-screw") {
        qty = 1;
      }

      items.push({
        material: mat,
        quantity: qty,
        subtotal: [mat.priceMin * qty, mat.priceMax * qty],
      });
    }
  }

  // 4. ネジ（全方式で1箱）
  const hasScrew = items.some((i) => i.material.id === "wood-screw");
  if (!hasScrew) {
    const screwMat = MATERIALS_MAP.get("wood-screw");
    if (screwMat) {
      items.push({
        material: screwMat,
        quantity: 1,
        subtotal: [screwMat.priceMin, screwMat.priceMax],
      });
    }
  }

  // 5. 塗装（1缶 = 200ml、約2㎡）
  const paintCans = calcPaintNeeded(config.width, config.depth, config.shelves);
  if (paintCans > 0) {
    const paintMat = MATERIALS_MAP.get("watco-oil");
    if (paintMat) {
      items.push({
        material: paintMat,
        quantity: paintCans,
        subtotal: [paintMat.priceMin * paintCans, paintMat.priceMax * paintCans],
      });
    }
  }

  // 6. サンドペーパー
  const sandMat = MATERIALS_MAP.get("sandpaper-set");
  if (sandMat) {
    items.push({
      material: sandMat,
      quantity: 1,
      subtotal: [sandMat.priceMin, sandMat.priceMax],
    });
  }

  const totalMin = items.reduce((sum, i) => sum + i.subtotal[0], 0);
  const totalMax = items.reduce((sum, i) => sum + i.subtotal[1], 0);

  return { items, totalMin, totalMax };
}

// ── 工具リスト ──
const TOOL_ITEMS: { material: MaterialItem; quantity: number; subtotal: [number, number] }[] =
  MATERIALS.filter((m) => m.category === "工具").map((m) => ({
    material: m,
    quantity: 1,
    subtotal: [m.priceMin, m.priceMax] as [number, number],
  }));

const TOOL_TOTAL_MIN = TOOL_ITEMS.reduce((s, i) => s + i.subtotal[0], 0);
const TOOL_TOTAL_MAX = TOOL_ITEMS.reduce((s, i) => s + i.subtotal[1], 0);

// ── パーツ辞典リンクマッピング ──
const PARTS_LINK_MAP: Record<string, { href: string; label: string }> = {
  "金具": { href: "/parts/category/bracket", label: "棚受け・金具一覧" },
  "木材": { href: "/parts/category/lumber", label: "木材一覧" },
  "ネジ・ビス": { href: "/parts/category/fastener", label: "ネジ・接合具一覧" },
  "塗装": { href: "/parts/category/finish", label: "塗装・仕上げ一覧" },
  "工具": { href: "/parts/category/tool", label: "工具一覧" },
};

// ── コンポーネント本体 ──

export default function MaterialCostEstimatorClient() {
  // 入力状態
  const [width, setWidth] = useState(600);
  const [depth, setDepth] = useState(300);
  const [height, setHeight] = useState(1800);
  const [shelves, setShelves] = useState(4);
  const [material, setMaterial] = useState("pine-600");
  const [supportType, setSupportType] = useState("labrico");
  const [includeTools, setIncludeTools] = useState(false);
  const [paintType, setPaintType] = useState("watco-oil");

  // テンプレート読込
  const loadTemplate = useCallback((templateId: string) => {
    const tmpl = SHELF_TEMPLATES.find((t) => t.id === templateId);
    if (!tmpl?.defaults) return;
    const d = tmpl.defaults;
    if (d.shelfWidth) setWidth(d.shelfWidth);
    if (d.shelfDepth) setDepth(d.shelfDepth);
    if (d.shelfCount) setShelves(d.shelfCount);
    // 高さはテンプレートにないのでデフォルト維持
    // アジャスターに応じてsupportTypeを設定
    if (d.adjuster === "diawall") setSupportType("diawall");
    else if (d.adjuster === "labrico" || d.adjuster === "labrico_strong") setSupportType("labrico");
    else setSupportType("standalone");
  }, []);

  // 見積もり計算
  const config: ShelfConfig = useMemo(
    () => ({ width, depth, height, shelves, material, supportType }),
    [width, depth, height, shelves, material, supportType]
  );

  const estimate = useMemo(() => {
    const est = estimateCost(config);
    // 塗装材の差し替え
    if (paintType !== "watco-oil") {
      const paintMat = MATERIALS_MAP.get(paintType);
      if (paintMat) {
        const paintIdx = est.items.findIndex((i) => i.material.category === "塗装");
        if (paintIdx >= 0) {
          const qty = est.items[paintIdx].quantity;
          est.items[paintIdx] = {
            material: paintMat,
            quantity: qty,
            subtotal: [paintMat.priceMin * qty, paintMat.priceMax * qty],
          };
          est.totalMin = est.items.reduce((s, i) => s + i.subtotal[0], 0);
          est.totalMax = est.items.reduce((s, i) => s + i.subtotal[1], 0);
        }
      }
    }
    return est;
  }, [config, paintType]);

  const grandTotalMin = estimate.totalMin + (includeTools ? TOOL_TOTAL_MIN : 0);
  const grandTotalMax = estimate.totalMax + (includeTools ? TOOL_TOTAL_MAX : 0);

  // カテゴリ別にグループ化
  const groupedItems = useMemo(() => {
    const groups: Record<string, typeof estimate.items> = {};
    for (const item of estimate.items) {
      const cat = item.material.category;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    }
    return groups;
  }, [estimate]);

  // 印刷
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="space-y-8">
      {/* テンプレート選択 */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-bold text-gray-800 mb-3">
          テンプレートから入力
        </h2>
        <p className="text-sm text-gray-500 mb-3">
          テンプレートを選ぶと寸法・棚数が自動入力されます
        </p>
        <div className="flex flex-wrap gap-2">
          {SHELF_TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => loadTemplate(t.id)}
              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              {t.icon} {t.name}
            </button>
          ))}
        </div>
      </section>

      {/* 入力フォーム */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-bold text-gray-800 mb-4">棚の仕様を入力</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {/* 幅 */}
          <label className="block">
            <span className="text-sm font-medium text-gray-700">幅 (mm)</span>
            <input
              type="number"
              min={100}
              max={3000}
              step={10}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </label>
          {/* 奥行 */}
          <label className="block">
            <span className="text-sm font-medium text-gray-700">奥行 (mm)</span>
            <input
              type="number"
              min={100}
              max={1000}
              step={10}
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </label>
          {/* 高さ */}
          <label className="block">
            <span className="text-sm font-medium text-gray-700">高さ (mm)</span>
            <input
              type="number"
              min={300}
              max={3000}
              step={10}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </label>
          {/* 棚板枚数 */}
          <label className="block">
            <span className="text-sm font-medium text-gray-700">棚板枚数</span>
            <input
              type="number"
              min={1}
              max={20}
              value={shelves}
              onChange={(e) => setShelves(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </label>
          {/* 板材の種類 */}
          <label className="block">
            <span className="text-sm font-medium text-gray-700">板材の種類</span>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              {BOARD_TYPES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          {/* 支柱方式 */}
          <label className="block">
            <span className="text-sm font-medium text-gray-700">支柱方式</span>
            <select
              value={supportType}
              onChange={(e) => setSupportType(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              {SUPPORT_TYPE_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          {/* 塗装材 */}
          <label className="block">
            <span className="text-sm font-medium text-gray-700">塗装材</span>
            <select
              value={paintType}
              onChange={(e) => setPaintType(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="watco-oil">ワトコオイル</option>
              <option value="briwax">ブライワックス</option>
              <option value="water-urethane">水性ウレタンニス</option>
            </select>
          </label>
        </div>
        <p className="mt-3 text-xs text-gray-400">
          ※ 支柱方式の説明：
          {SUPPORT_TYPE_OPTIONS.find((s) => s.id === supportType)?.description}
        </p>
      </section>

      {/* 見積もり結果 */}
      <section className="bg-white rounded-xl border border-emerald-200 p-5 print:border-gray-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">見積もり結果</h2>
          <button
            type="button"
            onClick={handlePrint}
            className="print:hidden px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            🖨️ 印刷 / 保存
          </button>
        </div>

        {/* 合計金額サマリー */}
        <div className="bg-emerald-50 rounded-xl p-4 mb-6 border border-emerald-100">
          <p className="text-sm text-emerald-700 mb-1">参考費用（合計）</p>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-800">
            ¥{grandTotalMin.toLocaleString()} 〜 ¥{grandTotalMax.toLocaleString()}
          </p>
          <p className="text-xs text-emerald-600 mt-1">
            ※ 参考価格です。実際の価格は店舗・時期により異なります
          </p>
        </div>

        {/* 工具トグル */}
        <label className="flex items-center gap-2 mb-5 print:hidden cursor-pointer">
          <input
            type="checkbox"
            checked={includeTools}
            onChange={(e) => setIncludeTools(e.target.checked)}
            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-sm text-gray-700">
            工具代を含める（+¥{TOOL_TOTAL_MIN.toLocaleString()}〜¥{TOOL_TOTAL_MAX.toLocaleString()}）
          </span>
        </label>

        {/* カテゴリ別テーブル */}
        {Object.entries(groupedItems).map(([category, catItems]) => (
          <div key={category} className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-gray-700">{category}</h3>
              {PARTS_LINK_MAP[category] && (
                <a
                  href={PARTS_LINK_MAP[category].href}
                  className="text-xs text-emerald-600 hover:underline print:hidden"
                >
                  {PARTS_LINK_MAP[category].label} →
                </a>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-3 py-2 font-semibold text-gray-600">
                      品名
                    </th>
                    <th className="text-right px-3 py-2 font-semibold text-gray-600">
                      数量
                    </th>
                    <th className="text-right px-3 py-2 font-semibold text-gray-600">
                      単価（税込目安）
                    </th>
                    <th className="text-right px-3 py-2 font-semibold text-gray-600">
                      小計
                    </th>
                    <th className="text-center px-3 py-2 font-semibold text-gray-600 print:hidden">
                      Amazon
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {catItems.map((item, idx) => (
                    <tr
                      key={item.material.id + idx}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                    >
                      <td className="px-3 py-2 text-gray-800">
                        <span>{item.material.name}</span>
                        {item.material.note && (
                          <span className="block text-xs text-gray-400">
                            {item.material.note}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-600">
                        {item.quantity}
                        {item.material.unit}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-500 text-xs">
                        ¥{item.material.priceMin.toLocaleString()}〜¥
                        {item.material.priceMax.toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-gray-700">
                        ¥{item.subtotal[0].toLocaleString()}〜¥
                        {item.subtotal[1].toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-center print:hidden">
                        <a
                          href={buildAmazonUrl(item.material.amazonKeyword)}
                          target="_blank"
                          rel="noopener noreferrer nofollow sponsored"
                          className="inline-block px-2 py-1 text-xs bg-amber-50 text-amber-700 rounded border border-amber-200 hover:bg-amber-100 transition-colors"
                        >
                          検索 →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* 工具テーブル（トグルONの場合） */}
        {includeTools && (
          <div className="mb-5">
            <h3 className="text-sm font-bold text-gray-700 mb-2">工具</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-3 py-2 font-semibold text-gray-600">
                      品名
                    </th>
                    <th className="text-right px-3 py-2 font-semibold text-gray-600">
                      数量
                    </th>
                    <th className="text-right px-3 py-2 font-semibold text-gray-600">
                      参考価格
                    </th>
                    <th className="text-center px-3 py-2 font-semibold text-gray-600 print:hidden">
                      Amazon
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {TOOL_ITEMS.map((item, idx) => (
                    <tr
                      key={item.material.id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                    >
                      <td className="px-3 py-2 text-gray-800">
                        {item.material.name}
                        <span className="block text-xs text-gray-400">
                          {item.material.note}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right text-gray-600">
                        {item.quantity}
                        {item.material.unit}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-500 text-xs">
                        ¥{item.subtotal[0].toLocaleString()}〜¥
                        {item.subtotal[1].toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-center print:hidden">
                        <a
                          href={buildAmazonUrl(item.material.amazonKeyword)}
                          target="_blank"
                          rel="noopener noreferrer nofollow sponsored"
                          className="inline-block px-2 py-1 text-xs bg-amber-50 text-amber-700 rounded border border-amber-200 hover:bg-amber-100 transition-colors"
                        >
                          検索 →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 入力仕様サマリー（印刷用） */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600 print:bg-white print:border print:border-gray-300">
          <h3 className="font-bold text-gray-700 mb-2">入力仕様</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
            <p>幅: {width}mm</p>
            <p>奥行: {depth}mm</p>
            <p>高さ: {height}mm</p>
            <p>棚板枚数: {shelves}枚</p>
            <p>板材: {BOARD_TYPES.find((b) => b.id === material)?.name}</p>
            <p>
              支柱方式:{" "}
              {SUPPORT_TYPE_OPTIONS.find((s) => s.id === supportType)?.name}
            </p>
          </div>
        </div>
      </section>

      {/* 注意事項 */}
      <section className="bg-amber-50 rounded-xl border border-amber-200 p-4 text-sm text-amber-800 print:bg-white print:text-gray-600">
        <h3 className="font-bold mb-2">ご注意</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>表示価格は参考価格であり、実際の価格は販売店・時期により異なります。</li>
          <li>木材はホームセンターでのカットサービスを利用すると、端材のロスを減らせます。</li>
          <li>塗装面積は棚板の表裏を基準に概算しています。支柱の塗装が必要な場合は追加でご用意ください。</li>
          <li>工具をお持ちの方は「工具代を含める」のチェックを外してください。</li>
        </ul>
      </section>
    </div>
  );
}
