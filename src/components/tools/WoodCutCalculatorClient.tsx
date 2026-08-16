"use client";

import { useState, useMemo, useCallback } from "react";
import { ADJUSTERS, LUMBER_SPECS, buildAmazonUrl } from "@/data/products";
import {
  SHELF_MATERIAL_OPTIONS,
  BRACKET_OPTIONS,
  CUT_FEE_PER_CUT,
  KERF_WIDTH_MM,
  STANDARD_LENGTHS,
  type CutItem,
} from "@/constants/woodCutCalculator";
import { optimizeMixedCutPlan } from "@/lib/cut-optimizer";

// ── アジャスター選択肢（柱用のみ抽出） ──
const ADJUSTER_OPTIONS = [
  { id: "none", name: "アジャスターなし（直接固定）", cutOffset: 0 },
  ...Object.values(ADJUSTERS)
    .filter((a) => a.supportedLumber.includes("2x4"))
    .map((a) => ({ id: a.id, name: a.name, cutOffset: a.cutOffset })),
];

// ── 柱用木材（2×4 / 2×6） ──
const PILLAR_LUMBER_OPTIONS = [
  LUMBER_SPECS["2x4"],
  LUMBER_SPECS["2x6"],
];

export default function WoodCutCalculatorClient() {
  // ── 入力 state ──
  const [ceilingHeight, setCeilingHeight] = useState(2400);
  const [adjusterId, setAdjusterId] = useState("labrico");
  const [pillarLumberId, setPillarLumberId] = useState("2x4");
  const [pillarCount, setPillarCount] = useState(2);
  const [pillarSpacing, setPillarSpacing] = useState(600);
  const [shelfCount, setShelfCount] = useState(3);
  const [shelfMaterialId, setShelfMaterialId] = useState("pine-18");
  const [bracketId, setBracketId] = useState("l-bracket");
  const [copied, setCopied] = useState(false);

  // ── 計算 ──
  const adjuster = ADJUSTER_OPTIONS.find((a) => a.id === adjusterId)!;
  const pillarLumber = LUMBER_SPECS[pillarLumberId];
  const shelfMaterial = SHELF_MATERIAL_OPTIONS.find(
    (m) => m.id === shelfMaterialId
  )!;
  const bracket = BRACKET_OPTIONS.find((b) => b.id === bracketId)!;

  const result = useMemo(() => {
    const pillarLength = ceilingHeight - adjuster.cutOffset;

    // 棚板の長さ = 柱間距離（内寸）
    // 柱の太さ（奥行き方向）は棚板幅に影響しない（柱の間に棚板を渡す想定）
    const shelfLength = pillarSpacing;

    // カットリスト
    const cutList: CutItem[] = [];

    // 柱
    cutList.push({
      name: "柱",
      material: pillarLumber.name,
      lengthMm: pillarLength,
      quantity: pillarCount,
      note:
        adjuster.cutOffset > 0
          ? `天井高${ceilingHeight}mm − オフセット${adjuster.cutOffset}mm`
          : `天井高${ceilingHeight}mm（直接固定）`,
    });

    // 棚板
    if (shelfCount > 0) {
      cutList.push({
        name: "棚板",
        material: shelfMaterial.name,
        lengthMm: shelfLength,
        quantity: shelfCount,
        note: `柱間距離${pillarSpacing}mm`,
      });
    }

    // 費用計算
    // 柱: 複数の定尺材長を組み合わせて最適な切り出し方を求める
    const pillarCandidates = STANDARD_LENGTHS.map((s) => ({
      lengthMm: s.value,
      barPriceYen: Math.round(pillarLumber.pricePerUnit * s.priceMult),
      limitedAvailability: s.limitedAvailability,
    }));
    const pillarPlanRaw = optimizeMixedCutPlan(
      [{ lengthMm: pillarLength, quantity: pillarCount }],
      pillarCandidates,
      { kerfMm: KERF_WIDTH_MM, cutFeePerCut: CUT_FEE_PER_CUT },
    );
    const pillarPlan = pillarPlanRaw.barsNeeded > 0 ? pillarPlanRaw : null;
    // 柱は全て同じ長さなので、使われた定尺材長は基本的に1種類のみ
    const pillarUsedLengthMm = pillarPlan
      ? Number(Object.keys(pillarPlan.barsByLength)[0])
      : undefined;
    const pillarStdLength = STANDARD_LENGTHS.find((s) => s.value === pillarUsedLengthMm);
    const pillarBarsNeeded = pillarPlan?.barsNeeded ?? pillarCount;
    const pillarTotalPrice = pillarPlan?.materialCost ?? pillarLumber.pricePerUnit * pillarCount;
    // 最長12ft(3650mm)材にも収まらない長さの場合は計算が破綻するため警告する
    const pillarExceedsMaxStock = pillarPlanRaw.unfitPieces.length > 0;

    // 棚板費用
    const shelfPricePerUnit = Math.ceil(
      (shelfLength / 1000) * shelfMaterial.pricePerMeter
    );
    const shelfTotalPrice = shelfPricePerUnit * shelfCount;

    // アジャスター費用
    const adjusterData = Object.values(ADJUSTERS).find(
      (a) => a.id === adjusterId
    );
    const adjusterUnitPrice = adjusterData?.priceYen ?? 0;
    const adjusterTotalPrice = adjusterUnitPrice * pillarCount;

    // 棚受け金具費用（柱1セットあたり × 棚板枚数）
    const bracketSetsNeeded = shelfCount; // 1枚の棚板に1セット
    const bracketTotalPrice = bracket.pricePerSet * bracketSetsNeeded;

    // カット回数（柱 + 棚板）
    const totalCuts = (pillarPlan?.totalCutCount ?? pillarCount) + shelfCount;
    const cutFeeTotal = totalCuts * CUT_FEE_PER_CUT;

    // 合計
    const totalPrice =
      pillarTotalPrice +
      shelfTotalPrice +
      adjusterTotalPrice +
      bracketTotalPrice +
      cutFeeTotal;

    // 費用内訳
    const costBreakdown = [
      {
        label: `柱 (${pillarLumber.name}) × ${pillarBarsNeeded}本購入（部材${pillarCount}本分）`,
        price: pillarTotalPrice,
      },
      ...(shelfCount > 0
        ? [
            {
              label: `棚板 (${shelfMaterial.name}) × ${shelfCount}枚`,
              price: shelfTotalPrice,
            },
          ]
        : []),
      ...(adjusterTotalPrice > 0
        ? [
            {
              label: `${adjuster.name} × ${pillarCount}個`,
              price: adjusterTotalPrice,
            },
          ]
        : []),
      {
        label: `${bracket.name} × ${bracketSetsNeeded}セット`,
        price: bracketTotalPrice,
      },
      {
        label: `カット代 (${totalCuts}カット × ¥${CUT_FEE_PER_CUT})`,
        price: cutFeeTotal,
      },
    ];

    return {
      pillarLength,
      shelfLength,
      cutList,
      costBreakdown,
      totalPrice,
      pillarStdLength,
      pillarBarsNeeded,
      pillarExceedsMaxStock,
    };
  }, [
    ceilingHeight,
    adjuster,
    pillarLumber,
    pillarCount,
    pillarSpacing,
    shelfCount,
    shelfMaterial,
    bracket,
    adjusterId,
    bracketId,
  ]);

  // ── クリップボードコピー ──
  const orderMemo = useMemo(() => {
    const lines = [
      "【ホームセンター注文メモ】",
      `日付: ____年__月__日`,
      "",
      "■ カットリスト",
      ...result.cutList.map(
        (item) =>
          `  ${item.name}: ${item.material} ${item.lengthMm}mm × ${item.quantity}本`
      ),
      "",
      "■ 追加購入品",
      ...(adjusterId !== "none"
        ? [`  ${adjuster.name} × ${pillarCount}個`]
        : []),
      `  ${bracket.name} × ${shelfCount}セット`,
      "",
      `■ 概算合計: ¥${result.totalPrice.toLocaleString()}`,
      "",
      "※ 価格は参考値です。店舗により異なります。",
      "※ 生成元: diy-shelf-maker.kuras-plus.com",
    ];
    return lines.join("\n");
  }, [result, adjuster, adjusterId, bracket, pillarCount, shelfCount]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(orderMemo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // フォールバック
      const textarea = document.createElement("textarea");
      textarea.value = orderMemo;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [orderMemo]);

  return (
    <div className="space-y-8">
      {/* 入力フォーム */}
      <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-5">
          計算条件を入力
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* 天井高 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              天井高 (mm)
            </label>
            <input
              type="number"
              value={ceilingHeight}
              onChange={(e) =>
                setCeilingHeight(
                  Math.max(1500, Math.min(3500, Number(e.target.value)))
                )
              }
              min={1500}
              max={3500}
              step={10}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
            <input
              type="range"
              value={ceilingHeight}
              onChange={(e) => setCeilingHeight(Number(e.target.value))}
              min={1500}
              max={3500}
              step={10}
              className="w-full mt-1 accent-amber-500"
            />
            <p className="text-xs text-gray-400 mt-0.5">
              一般的な天井高: 2,400mm
            </p>
          </div>

          {/* アジャスター */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              アジャスター
            </label>
            <select
              value={adjusterId}
              onChange={(e) => setAdjusterId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            >
              {ADJUSTER_OPTIONS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                  {a.cutOffset > 0 ? `（−${a.cutOffset}mm）` : ""}
                </option>
              ))}
            </select>
            {adjuster.cutOffset > 0 && (
              <p className="text-xs text-amber-600 mt-1">
                オフセット: 天井高から {adjuster.cutOffset}mm 短くカット
              </p>
            )}
          </div>

          {/* 柱の木材 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              柱の木材
            </label>
            <select
              value={pillarLumberId}
              onChange={(e) => setPillarLumberId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            >
              {PILLAR_LUMBER_OPTIONS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}（¥{l.pricePerUnit}/本）
                </option>
              ))}
            </select>
          </div>

          {/* 柱の本数 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              柱の本数
            </label>
            <select
              value={pillarCount}
              onChange={(e) => setPillarCount(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            >
              {[2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}本
                </option>
              ))}
            </select>
          </div>

          {/* 柱間距離 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              柱間距離 (mm)
            </label>
            <input
              type="number"
              value={pillarSpacing}
              onChange={(e) =>
                setPillarSpacing(
                  Math.max(200, Math.min(2000, Number(e.target.value)))
                )
              }
              min={200}
              max={2000}
              step={10}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
            <p className="text-xs text-gray-400 mt-0.5">
              棚板の長さになります
            </p>
          </div>

          {/* 棚板の枚数 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              棚板の枚数
            </label>
            <select
              value={shelfCount}
              onChange={(e) => setShelfCount(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}枚
                </option>
              ))}
            </select>
          </div>

          {/* 棚板の材質 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              棚板の材質
            </label>
            <select
              value={shelfMaterialId}
              onChange={(e) => setShelfMaterialId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            >
              {SHELF_MATERIAL_OPTIONS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* 棚受け金具 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              棚受け金具
            </label>
            <select
              value={bracketId}
              onChange={(e) => setBracketId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            >
              {BRACKET_OPTIONS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}（¥{b.pricePerSet}/セット）
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* カットリスト結果 */}
      <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">カットリスト</h2>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
          >
            {copied ? (
              <>
                <span>&#10003;</span> コピー済み
              </>
            ) : (
              <>
                <span>&#128203;</span> 注文メモをコピー
              </>
            )}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  部材
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  材種
                </th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">
                  カット寸法
                </th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">
                  本数
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  算出根拠
                </th>
              </tr>
            </thead>
            <tbody>
              {result.cutList.map((item, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.material}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-800">
                    {item.lengthMm.toLocaleString()}mm
                  </td>
                  <td className="px-4 py-3 text-right text-gray-800">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {item.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* オフセット解説カード */}
        {adjuster.cutOffset > 0 && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm font-medium text-amber-800 mb-1">
              カット寸法の計算式
            </p>
            <p className="text-sm text-amber-700">
              柱の長さ = 天井高{" "}
              <span className="font-mono font-bold">
                {ceilingHeight.toLocaleString()}mm
              </span>{" "}
              − {adjuster.name}オフセット{" "}
              <span className="font-mono font-bold">{adjuster.cutOffset}mm</span>{" "}
              ={" "}
              <span className="font-mono font-bold text-amber-900">
                {result.pillarLength.toLocaleString()}mm
              </span>
            </p>
          </div>
        )}

        {/* 購入する木材の標準サイズ */}
        {result.pillarStdLength && (
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm font-medium text-blue-800 mb-1">
              購入する木材サイズ
            </p>
            <p className="text-sm text-blue-700">
              柱{result.pillarLength.toLocaleString()}mm × {pillarCount}本分をカットするには、
              <span className="font-bold">
                {result.pillarStdLength.label}
              </span>
              の{pillarLumber.name}を
              <span className="font-bold">{result.pillarBarsNeeded}本</span>
              購入してください
              {result.pillarBarsNeeded < pillarCount
                ? `（1本の定尺材から複数本切り出せるため、${pillarCount}本分が${result.pillarBarsNeeded}本の購入で済みます）`
                : "。"}
            </p>
          </div>
        )}
        {result.pillarExceedsMaxStock && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-700">
              ⚠️ 柱の長さ{result.pillarLength.toLocaleString()}mmは、市販の定尺材(最長12ft/3,650mm)には収まりません。
              特注または木材の継ぎ足しをご検討ください。
            </p>
          </div>
        )}
      </section>

      {/* 費用概算 */}
      <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-5">費用概算</h2>
        <div className="space-y-2">
          {result.costBreakdown.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
            >
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="text-sm font-medium text-gray-800">
                ¥{item.price.toLocaleString()}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-3 border-t-2 border-gray-200">
            <span className="text-base font-bold text-gray-800">合計（税込目安）</span>
            <span className="text-xl font-bold text-amber-600">
              ¥{result.totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-400">
          ※ 価格は参考値です。店舗・時期・地域により異なります。
        </p>
      </section>

      {/* Amazon購入リンク */}
      <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-5">
          Amazonで材料を探す
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* 柱木材 */}
          <a
            href={buildAmazonUrl(pillarLumber.amazonKeyword)}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 hover:bg-amber-100 transition-colors"
          >
            <span className="text-2xl">🪵</span>
            <div>
              <p className="text-sm font-medium text-gray-800">
                {pillarLumber.name}
              </p>
              <p className="text-xs text-amber-600">Amazonで検索 →</p>
            </div>
          </a>

          {/* 棚板材 */}
          <a
            href={buildAmazonUrl(shelfMaterial.amazonKeyword)}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 hover:bg-amber-100 transition-colors"
          >
            <span className="text-2xl">📏</span>
            <div>
              <p className="text-sm font-medium text-gray-800">
                {shelfMaterial.name}
              </p>
              <p className="text-xs text-amber-600">Amazonで検索 →</p>
            </div>
          </a>

          {/* アジャスター */}
          {adjusterId !== "none" && (() => {
            const adjData = Object.values(ADJUSTERS).find(
              (a) => a.id === adjusterId
            );
            return adjData ? (
              <a
                href={buildAmazonUrl(adjData.amazonKeyword)}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 hover:bg-amber-100 transition-colors"
              >
                <span className="text-2xl">🔧</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {adjData.name}
                  </p>
                  <p className="text-xs text-amber-600">Amazonで検索 →</p>
                </div>
              </a>
            ) : null;
          })()}

          {/* 棚受け金具 */}
          <a
            href={buildAmazonUrl(bracket.amazonKeyword)}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 hover:bg-amber-100 transition-colors"
          >
            <span className="text-2xl">🔩</span>
            <div>
              <p className="text-sm font-medium text-gray-800">
                {bracket.name}
              </p>
              <p className="text-xs text-amber-600">Amazonで検索 →</p>
            </div>
          </a>
        </div>
      </section>
    </div>
  );
}
