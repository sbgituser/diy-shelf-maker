"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  WOOD_MATERIALS,
  WOOD_MATERIALS_MAP,
  SUPPORT_TYPES,
  SUPPORT_TYPES_MAP,
  LOAD_PRESETS,
  SAFETY_FACTOR,
  DEFLECTION_SAFE_RATIO,
  DEFLECTION_WARN_RATIO,
} from "@/constants/shelfLoadCalc";
import { buildAmazonUrl } from "@/data/products";

// ── 計算ロジック ──

/** 断面二次モーメント I = b * h³ / 12 (mm⁴) */
function calcI(widthMm: number, thicknessMm: number): number {
  return (widthMm * Math.pow(thicknessMm, 3)) / 12;
}

/** 最大耐荷重 (kg) — 両端支持・等分布荷重 */
function calcMaxLoad(
  bendingStrengthMPa: number,
  widthMm: number,
  thicknessMm: number,
  spanMm: number,
  supportFactor: number
): number {
  // σ = M / Z, M = wL²/8 (等分布), Z = bh²/6
  // → w = 8σZ / L²  (N/mm)
  // → W = wL (N), kg = W / 9.81 / safetyFactor
  const Z = (widthMm * Math.pow(thicknessMm, 2)) / 6; // mm³
  const sigma = bendingStrengthMPa; // N/mm² = MPa
  const W_newton = (8 * sigma * Z) / spanMm; // N (total load)
  const W_kg = W_newton / 9.81 / SAFETY_FACTOR;
  return W_kg * supportFactor;
}

/** たわみ量 (mm) — 両端支持・等分布荷重: δ = 5WL³/(384EI) */
function calcDeflection(
  loadKg: number,
  spanMm: number,
  elasticModulusMPa: number,
  widthMm: number,
  thicknessMm: number,
  supportFactor: number
): number {
  const I = calcI(widthMm, thicknessMm);
  const W_N = loadKg * 9.81;
  const L = spanMm / supportFactor; // 実効スパン
  // δ = 5 * w * L⁴ / (384 * E * I), w = W/L → δ = 5WL³/(384EI)
  const delta = (5 * W_N * Math.pow(L, 3)) / (384 * elasticModulusMPa * I);
  return delta;
}

/** たわみがL/300以下になる最大スパンを逆算 */
function calcRecommendedSpan(
  loadKgPerMm: number,
  elasticModulusMPa: number,
  widthMm: number,
  thicknessMm: number
): number {
  // δ = 5wL⁴/(384EI) ≤ L/300
  // → L³ ≤ 384EI/(300*5*w)
  const I = calcI(widthMm, thicknessMm);
  if (loadKgPerMm <= 0) return 2000; // 荷重0ならスパン制限なし
  const w_N_per_mm = loadKgPerMm * 9.81;
  const L3 = (384 * elasticModulusMPa * I) / (1500 * w_N_per_mm);
  return Math.pow(L3, 1 / 3);
}

type SafetyLevel = "safe" | "warn" | "danger";

function getSafetyLevel(deflectionMm: number, spanMm: number): SafetyLevel {
  if (spanMm <= 0) return "safe";
  const ratio = spanMm / deflectionMm;
  if (ratio >= DEFLECTION_SAFE_RATIO) return "safe";
  if (ratio >= DEFLECTION_WARN_RATIO) return "warn";
  return "danger";
}

const SAFETY_LABEL: Record<SafetyLevel, string> = {
  safe: "安全",
  warn: "注意",
  danger: "危険",
};

const SAFETY_COLOR: Record<SafetyLevel, string> = {
  safe: "text-green-600",
  warn: "text-yellow-600",
  danger: "text-red-600",
};

const SAFETY_BG: Record<SafetyLevel, string> = {
  safe: "bg-green-500",
  warn: "bg-yellow-500",
  danger: "bg-red-500",
};

const SAFETY_BORDER: Record<SafetyLevel, string> = {
  safe: "border-green-200 bg-green-50",
  warn: "border-yellow-200 bg-yellow-50",
  danger: "border-red-200 bg-red-50",
};

export default function ShelfLoadCalcClient() {
  const [materialId, setMaterialId] = useState("pine");
  const [thickness, setThickness] = useState(18);
  const [width, setWidth] = useState(300);
  const [span, setSpan] = useState(600);
  const [supportId, setSupportId] = useState("both_ends");
  const [loadKg, setLoadKg] = useState(10);

  const material = WOOD_MATERIALS_MAP[materialId];
  const support = SUPPORT_TYPES_MAP[supportId];

  const result = useMemo(() => {
    if (!material || !support) return null;

    const maxLoad = calcMaxLoad(
      material.bendingStrength,
      width,
      thickness,
      span,
      support.factor
    );
    const deflection = calcDeflection(
      loadKg,
      span,
      material.elasticModulus,
      width,
      thickness,
      support.factor
    );
    const safetyLevel = getSafetyLevel(deflection, span);

    // プリセット換算
    const presetResults = LOAD_PRESETS.filter((p) => p.weightPerCm > 0).map(
      (preset) => {
        const totalWeightForSpan = preset.weightPerCm * (span / 10); // span(mm) → cm
        const count = Math.floor(maxLoad / (preset.weightPerCm * 2)); // 約2cm幅/冊
        return { ...preset, totalWeightForSpan, count };
      }
    );

    // 推奨スパン（現在の荷重密度ベース）
    const loadPerMm = span > 0 ? loadKg / span : 0;
    const recommendedSpan = calcRecommendedSpan(
      loadPerMm,
      material.elasticModulus,
      width,
      thickness
    );

    return {
      maxLoad,
      deflection,
      safetyLevel,
      presetResults,
      recommendedSpan: Math.min(Math.round(recommendedSpan), 2000),
    };
  }, [material, support, thickness, width, span, loadKg]);

  return (
    <div className="space-y-8">
      {/* 入力フォーム */}
      <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-5">計算条件を入力</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* 板材の種類 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              板材の種類
            </label>
            <select
              value={materialId}
              onChange={(e) => setMaterialId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              {WOOD_MATERIALS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}（{m.priceRange}）
                </option>
              ))}
            </select>
          </div>

          {/* 支持方式 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              支持方式
            </label>
            <select
              value={supportId}
              onChange={(e) => setSupportId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              {SUPPORT_TYPES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}（{s.description}）
                </option>
              ))}
            </select>
          </div>

          {/* 厚み */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              板の厚み (mm)
            </label>
            <input
              type="number"
              min={5}
              max={50}
              value={thickness}
              onChange={(e) => setThickness(Number(e.target.value) || 5)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">一般的: 12mm / 18mm / 24mm</p>
          </div>

          {/* 幅（奥行き） */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              板の幅・奥行き (mm)
            </label>
            <input
              type="number"
              min={50}
              max={600}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value) || 50)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">一般的: 200mm / 300mm / 450mm</p>
          </div>

          {/* スパン */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              棚受け間のスパン (mm)
            </label>
            <input
              type="number"
              min={100}
              max={2000}
              value={span}
              onChange={(e) => setSpan(Number(e.target.value) || 100)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">一般的: 450mm / 600mm / 900mm</p>
          </div>

          {/* 想定荷重 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              想定荷重 (kg)
            </label>
            <input
              type="number"
              min={0}
              max={200}
              step={0.5}
              value={loadKg}
              onChange={(e) => setLoadKg(Number(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {LOAD_PRESETS.filter((p) => p.weightPerCm > 0).map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() =>
                    setLoadKg(
                      Math.round(preset.weightPerCm * (span / 10) * 10) / 10
                    )
                  }
                  className="text-xs px-2 py-1 rounded-full border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                >
                  {preset.icon} {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 計算結果 */}
      {result && (
        <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-5">計算結果</h2>

          {/* メイン数値 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-indigo-50 rounded-xl p-4 text-center border border-indigo-100">
              <p className="text-xs text-indigo-600 font-medium mb-1">最大耐荷重</p>
              <p className="text-3xl font-bold text-indigo-700">
                {result.maxLoad.toFixed(1)}
              </p>
              <p className="text-sm text-indigo-500">kg</p>
            </div>
            <div className={`rounded-xl p-4 text-center border ${SAFETY_BORDER[result.safetyLevel]}`}>
              <p className="text-xs font-medium mb-1 text-gray-600">たわみ量</p>
              <p className={`text-3xl font-bold ${SAFETY_COLOR[result.safetyLevel]}`}>
                {result.deflection.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">mm</p>
            </div>
            <div className={`rounded-xl p-4 text-center border ${SAFETY_BORDER[result.safetyLevel]}`}>
              <p className="text-xs font-medium mb-1 text-gray-600">安全性</p>
              <p className={`text-3xl font-bold ${SAFETY_COLOR[result.safetyLevel]}`}>
                {SAFETY_LABEL[result.safetyLevel]}
              </p>
              <p className="text-sm text-gray-500">
                {result.safetyLevel === "safe"
                  ? "たわみ L/300 以下"
                  : result.safetyLevel === "warn"
                  ? "たわみ L/200〜L/300"
                  : "たわみ L/200 超過"}
              </p>
            </div>
          </div>

          {/* 安全性ゲージ */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>たわみ比率</span>
              <span>
                {span > 0 && result.deflection > 0
                  ? `L/${Math.round(span / result.deflection)}`
                  : "—"}
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${SAFETY_BG[result.safetyLevel]}`}
                style={{
                  width: `${Math.min(
                    100,
                    span > 0 && result.deflection > 0
                      ? (result.deflection / (span / DEFLECTION_WARN_RATIO)) * 100
                      : 0
                  )}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0</span>
              <span>L/300 安全</span>
              <span>L/200 注意</span>
              <span>危険</span>
            </div>
          </div>

          {/* たわみSVG断面図 */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">たわみイメージ</h3>
            <DeflectionDiagram
              spanMm={span}
              deflectionMm={result.deflection}
              safetyLevel={result.safetyLevel}
              supportId={supportId}
            />
          </div>

          {/* 推奨スパン */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">
              推奨棚受け間隔
            </h3>
            <p className="text-sm text-gray-600">
              現在の荷重条件でたわみを安全範囲（L/300以下）に収めるには、
              棚受け間隔を{" "}
              <span className="font-bold text-indigo-600">
                {result.recommendedSpan}mm以下
              </span>{" "}
              にしてください。
            </p>
          </div>

          {/* プリセット換算 */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              何がどれくらい載る？
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {result.presetResults.map((p) => (
                <div
                  key={p.id}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-100 text-center"
                >
                  <p className="text-xl mb-1">{p.icon}</p>
                  <p className="text-xs text-gray-500">{p.name}</p>
                  <p className="text-lg font-bold text-gray-800">
                    約{p.count}冊
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 関連リンク */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* パーツ辞典リンク */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                関連パーツ
              </h3>
              <div className="space-y-2">
                <Link
                  href="/parts/l_bracket"
                  className="block text-sm text-amber-700 hover:text-amber-800 hover:underline"
                >
                  L字棚受け金具 →
                </Link>
                <Link
                  href="/parts/shelf_support"
                  className="block text-sm text-amber-700 hover:text-amber-800 hover:underline"
                >
                  棚受けレール →
                </Link>
                <Link
                  href="/parts/channel_support"
                  className="block text-sm text-amber-700 hover:text-amber-800 hover:underline"
                >
                  チャンネルサポート →
                </Link>
                <Link
                  href="/parts/category/bracket"
                  className="block text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  棚受け金具をすべて見る →
                </Link>
              </div>
            </div>

            {/* Amazonリンク */}
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                おすすめ材料
              </h3>
              <div className="space-y-2">
                <a
                  href={buildAmazonUrl(material.amazonKeyword)}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="block text-sm text-indigo-700 hover:text-indigo-800 hover:underline"
                >
                  {material.name}をAmazonで探す →
                </a>
                <a
                  href={buildAmazonUrl("棚受け金具 L字")}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="block text-sm text-indigo-700 hover:text-indigo-800 hover:underline"
                >
                  棚受け金具をAmazonで探す →
                </a>
                <a
                  href={buildAmazonUrl("棚板 カット オーダー")}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="block text-sm text-indigo-700 hover:text-indigo-800 hover:underline"
                >
                  オーダーカット棚板を探す →
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// ── たわみ断面図 SVG ──
function DeflectionDiagram({
  spanMm,
  deflectionMm,
  safetyLevel,
  supportId,
}: {
  spanMm: number;
  deflectionMm: number;
  safetyLevel: SafetyLevel;
  supportId: string;
}) {
  const svgW = 400;
  const svgH = 120;
  const pad = 40;
  const beamY = 30;
  const beamLen = svgW - pad * 2;

  // たわみを見やすく誇張（最大30px）
  const maxVisualDeflection = 50;
  const visualDeflection = Math.min(
    maxVisualDeflection,
    deflectionMm > 0 ? Math.max(5, (deflectionMm / (spanMm / 200)) * maxVisualDeflection) : 0
  );

  const strokeColor =
    safetyLevel === "safe"
      ? "#16a34a"
      : safetyLevel === "warn"
      ? "#ca8a04"
      : "#dc2626";

  const isCantilever = supportId === "cantilever";

  // たわみ曲線パス
  const points: string[] = [];
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = pad + t * beamLen;
    let deflFrac: number;
    if (isCantilever) {
      // 片持ち: 先端が最大
      deflFrac = t * t * (3 - t) / 2;
    } else {
      // 両端支持: 中央が最大 (放物線近似)
      deflFrac = 4 * t * (1 - t);
    }
    const y = beamY + deflFrac * visualDeflection;
    points.push(`${x},${y}`);
  }

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      className="w-full max-w-md mx-auto"
      aria-label={`たわみ図: ${deflectionMm.toFixed(2)}mm`}
    >
      {/* 元の位置（点線） */}
      <line
        x1={pad}
        y1={beamY}
        x2={svgW - pad}
        y2={beamY}
        stroke="#d1d5db"
        strokeWidth={1}
        strokeDasharray="4,4"
      />

      {/* たわみ曲線 */}
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={strokeColor}
        strokeWidth={3}
        strokeLinecap="round"
      />

      {/* 支点 */}
      {isCantilever ? (
        <>
          {/* 固定端 */}
          <rect x={pad - 6} y={beamY - 10} width={6} height={20} fill="#6b7280" />
          <line x1={pad - 8} y1={beamY - 12} x2={pad - 8} y2={beamY + 12} stroke="#6b7280" strokeWidth={2} />
        </>
      ) : (
        <>
          <polygon
            points={`${pad},${beamY + 2} ${pad - 8},${beamY + 16} ${pad + 8},${beamY + 16}`}
            fill="#6b7280"
          />
          <polygon
            points={`${svgW - pad},${beamY + 2} ${svgW - pad - 8},${beamY + 16} ${svgW - pad + 8},${beamY + 16}`}
            fill="#6b7280"
          />
          {supportId === "three_point" && (
            <polygon
              points={`${svgW / 2},${beamY + 2} ${svgW / 2 - 8},${beamY + 16} ${svgW / 2 + 8},${beamY + 16}`}
              fill="#6b7280"
            />
          )}
        </>
      )}

      {/* たわみ矢印 */}
      {visualDeflection > 2 && (
        <>
          <line
            x1={isCantilever ? svgW - pad : svgW / 2}
            y1={beamY}
            x2={isCantilever ? svgW - pad : svgW / 2}
            y2={beamY + visualDeflection}
            stroke={strokeColor}
            strokeWidth={1}
            strokeDasharray="3,3"
          />
          <text
            x={(isCantilever ? svgW - pad : svgW / 2) + 8}
            y={beamY + visualDeflection / 2 + 4}
            fontSize={11}
            fill={strokeColor}
            fontWeight="bold"
          >
            {deflectionMm.toFixed(2)}mm
          </text>
        </>
      )}

      {/* スパン表示 */}
      <line
        x1={pad}
        y1={svgH - 15}
        x2={svgW - pad}
        y2={svgH - 15}
        stroke="#9ca3af"
        strokeWidth={1}
        markerStart="url(#arrowL)"
        markerEnd="url(#arrowR)"
      />
      <text
        x={svgW / 2}
        y={svgH - 3}
        textAnchor="middle"
        fontSize={11}
        fill="#6b7280"
      >
        スパン {spanMm}mm
      </text>

      <defs>
        <marker id="arrowL" markerWidth={6} markerHeight={6} refX={6} refY={3} orient="auto">
          <path d="M6,0 L0,3 L6,6" fill="none" stroke="#9ca3af" strokeWidth={1} />
        </marker>
        <marker id="arrowR" markerWidth={6} markerHeight={6} refX={0} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="none" stroke="#9ca3af" strokeWidth={1} />
        </marker>
      </defs>
    </svg>
  );
}
