"use client";

import { useState, useMemo } from "react";
import {
  SUPPORT_SYSTEMS,
  PICKER_QUESTIONS,
  type SupportSystem,
} from "@/constants/supportSystemPicker";
import { buildAmazonUrl } from "@/data/products";

// ── レーダーチャート（SVG） ──

const RADAR_AXES = [
  { key: "maxLoadNorm" as const, label: "耐荷重" },
  { key: "priceNorm" as const, label: "コスパ" },
  { key: "easeNorm" as const, label: "手軽さ" },
  { key: "appearance" as const, label: "見た目" },
  { key: "stability" as const, label: "安定性" },
];

type NormalizedScores = Record<string, number>;

function normalizeSystem(s: SupportSystem): NormalizedScores {
  return {
    maxLoadNorm: Math.min(s.maxLoad / 60, 1) * 5,
    priceNorm: (1 - (s.priceRange[0] + s.priceRange[1]) / 2 / 2500) * 5,
    easeNorm: (5 - s.installDifficulty + 1),
    appearance: s.appearance,
    stability: s.stability,
  };
}

function RadarChart({
  systems,
  highlightId,
}: {
  systems: SupportSystem[];
  highlightId?: string;
}) {
  const cx = 150;
  const cy = 140;
  const r = 100;
  const angleStep = (2 * Math.PI) / RADAR_AXES.length;
  const startAngle = -Math.PI / 2;

  const colors = [
    { stroke: "#7c3aed", fill: "rgba(124,58,237,0.15)" },
    { stroke: "#2563eb", fill: "rgba(37,99,235,0.12)" },
    { stroke: "#059669", fill: "rgba(5,150,105,0.12)" },
    { stroke: "#d97706", fill: "rgba(217,119,6,0.12)" },
    { stroke: "#dc2626", fill: "rgba(220,38,38,0.12)" },
  ];

  function getPoint(axisIndex: number, value: number): [number, number] {
    const angle = startAngle + axisIndex * angleStep;
    const dist = (value / 5) * r;
    return [cx + dist * Math.cos(angle), cy + dist * Math.sin(angle)];
  }

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-sm mx-auto">
      {/* グリッド */}
      {[1, 2, 3, 4, 5].map((level) => (
        <polygon
          key={level}
          points={RADAR_AXES.map((_, i) => getPoint(i, level).join(",")).join(" ")}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={level === 5 ? 1.5 : 0.8}
        />
      ))}

      {/* 軸線 */}
      {RADAR_AXES.map((_, i) => {
        const [x, y] = getPoint(i, 5);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="#d1d5db"
            strokeWidth={0.8}
          />
        );
      })}

      {/* 軸ラベル */}
      {RADAR_AXES.map((axis, i) => {
        const [x, y] = getPoint(i, 5.8);
        return (
          <text
            key={axis.key}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[11px] fill-gray-600"
          >
            {axis.label}
          </text>
        );
      })}

      {/* データポリゴン */}
      {systems.map((s, si) => {
        const scores = normalizeSystem(s);
        const points = RADAR_AXES.map((axis, i) =>
          getPoint(i, scores[axis.key]).join(",")
        ).join(" ");
        const color = colors[si % colors.length];
        const isHighlight = !highlightId || s.id === highlightId;
        return (
          <polygon
            key={s.id}
            points={points}
            fill={color.fill}
            stroke={color.stroke}
            strokeWidth={isHighlight ? 2 : 1}
            opacity={isHighlight ? 1 : 0.3}
          />
        );
      })}

      {/* 凡例 */}
      {systems.map((s, si) => {
        const color = colors[si % colors.length];
        const isHighlight = !highlightId || s.id === highlightId;
        return (
          <g key={s.id} opacity={isHighlight ? 1 : 0.4}>
            <rect
              x={10}
              y={270 + si * 14 - (systems.length * 14) / 2 + 20}
              width={10}
              height={10}
              fill={color.stroke}
              rx={2}
            />
            <text
              x={24}
              y={270 + si * 14 - (systems.length * 14) / 2 + 29}
              className="text-[10px] fill-gray-700"
            >
              {s.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── スコアバー ──

function ScoreBar({ value, max = 5, color = "bg-violet-500" }: { value: number; max?: number; color?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 w-6 text-right">{value}/{max}</span>
    </div>
  );
}

// ── 比較マトリクスモード ──

type SortKey = "maxLoad" | "price" | "installDifficulty" | "appearance" | "stability";

function ComparisonMatrix() {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(false);
  const [highlightId, setHighlightId] = useState<string | undefined>();

  const sorted = useMemo(() => {
    if (!sortKey) return SUPPORT_SYSTEMS;
    return [...SUPPORT_SYSTEMS].sort((a, b) => {
      let va: number, vb: number;
      if (sortKey === "price") {
        va = (a.priceRange[0] + a.priceRange[1]) / 2;
        vb = (b.priceRange[0] + b.priceRange[1]) / 2;
      } else {
        va = a[sortKey];
        vb = b[sortKey];
      }
      return sortAsc ? va - vb : vb - va;
    });
  }, [sortKey, sortAsc]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(key === "price" || key === "installDifficulty");
    }
  }

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return " ↕";
    return sortAsc ? " ↑" : " ↓";
  };

  return (
    <div>
      {/* レーダーチャート */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-6">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          レーダーチャート比較
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          クリックでハイライト表示。もう一度クリックで解除。
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {SUPPORT_SYSTEMS.map((s) => (
            <button
              key={s.id}
              onClick={() => setHighlightId(highlightId === s.id ? undefined : s.id)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                highlightId === s.id
                  ? "bg-violet-100 border-violet-300 text-violet-700"
                  : "bg-white border-gray-200 text-gray-600 hover:border-violet-200"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
        <RadarChart systems={SUPPORT_SYSTEMS} highlightId={highlightId} />
      </div>

      {/* テーブル */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-xl border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-700">
                システム名
              </th>
              <th
                className="text-right px-4 py-3 font-semibold text-gray-700 cursor-pointer hover:text-violet-600 select-none"
                onClick={() => handleSort("maxLoad")}
              >
                耐荷重{sortIcon("maxLoad")}
                <br />
                <span className="text-xs font-normal text-gray-400">kg/本</span>
              </th>
              <th
                className="text-right px-4 py-3 font-semibold text-gray-700 cursor-pointer hover:text-violet-600 select-none"
                onClick={() => handleSort("price")}
              >
                価格帯{sortIcon("price")}
                <br />
                <span className="text-xs font-normal text-gray-400">円</span>
              </th>
              <th
                className="text-center px-4 py-3 font-semibold text-gray-700 cursor-pointer hover:text-violet-600 select-none"
                onClick={() => handleSort("installDifficulty")}
              >
                設置難易度{sortIcon("installDifficulty")}
              </th>
              <th className="text-center px-4 py-3 font-semibold text-gray-700">
                賃貸
              </th>
              <th className="text-center px-4 py-3 font-semibold text-gray-700">
                壁ダメージ
              </th>
              <th
                className="text-center px-4 py-3 font-semibold text-gray-700 cursor-pointer hover:text-violet-600 select-none"
                onClick={() => handleSort("appearance")}
              >
                見た目{sortIcon("appearance")}
              </th>
              <th
                className="text-center px-4 py-3 font-semibold text-gray-700 cursor-pointer hover:text-violet-600 select-none"
                onClick={() => handleSort("stability")}
              >
                安定性{sortIcon("stability")}
              </th>
              <th className="text-center px-4 py-3 font-semibold text-gray-700">
                Amazon
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => (
              <tr
                key={s.id}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">{s.name}</div>
                  <div className="text-xs text-gray-400">{s.brand}</div>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-gray-700">
                  {s.maxLoad}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  ¥{s.priceRange[0].toLocaleString()}〜{s.priceRange[1].toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs">
                    {"★".repeat(s.installDifficulty)}
                    {"☆".repeat(5 - s.installDifficulty)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {s.rentalFriendly ? (
                    <span className="text-green-600 font-semibold">○</span>
                  ) : (
                    <span className="text-red-500 font-semibold">×</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={
                      s.wallDamage === "なし"
                        ? "text-green-600"
                        : s.wallDamage === "微小"
                        ? "text-yellow-600"
                        : "text-red-500"
                    }
                  >
                    {s.wallDamage}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs">
                    {"★".repeat(s.appearance)}
                    {"☆".repeat(5 - s.appearance)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs">
                    {"★".repeat(s.stability)}
                    {"☆".repeat(5 - s.stability)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <a
                    href={buildAmazonUrl(s.amazonKeyword)}
                    target="_blank"
                    rel="noopener noreferrer nofollow sponsored"
                    className="text-xs text-violet-600 hover:text-violet-700 hover:underline"
                  >
                    検索 →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 各システム詳細カード */}
      <div className="mt-8 space-y-4">
        <h3 className="text-base font-semibold text-gray-800">各システム詳細</h3>
        {SUPPORT_SYSTEMS.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-gray-800">{s.name}</h4>
                <p className="text-xs text-gray-400">
                  {s.brand} ／ {s.mechanism}
                </p>
              </div>
              <a
                href={buildAmazonUrl(s.amazonKeyword)}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="text-xs bg-violet-50 text-violet-600 px-3 py-1.5 rounded-lg hover:bg-violet-100 transition-colors shrink-0"
              >
                Amazonで検索
              </a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-sm">
              <div>
                <span className="text-xs text-gray-400">耐荷重</span>
                <p className="font-semibold text-gray-700">{s.maxLoad}kg/本</p>
              </div>
              <div>
                <span className="text-xs text-gray-400">価格帯</span>
                <p className="font-semibold text-gray-700">
                  ¥{s.priceRange[0].toLocaleString()}〜{s.priceRange[1].toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400">必要木材</span>
                <p className="font-semibold text-gray-700 text-xs">{s.requiredWood}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400">壁ダメージ</span>
                <p className={`font-semibold ${s.wallDamage === "なし" ? "text-green-600" : s.wallDamage === "微小" ? "text-yellow-600" : "text-red-500"}`}>
                  {s.wallDamage}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div>
                <span className="text-xs text-gray-400 block mb-1">設置難易度</span>
                <ScoreBar value={s.installDifficulty} />
              </div>
              <div>
                <span className="text-xs text-gray-400 block mb-1">見た目</span>
                <ScoreBar value={s.appearance} />
              </div>
              <div>
                <span className="text-xs text-gray-400 block mb-1">安定性</span>
                <ScoreBar value={s.stability} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="text-xs font-semibold text-green-700 mb-1">メリット</h5>
                <ul className="space-y-0.5">
                  {s.pros.map((p, i) => (
                    <li key={i} className="text-xs text-gray-600 flex gap-1">
                      <span className="text-green-500 shrink-0">✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-xs font-semibold text-red-700 mb-1">デメリット</h5>
                <ul className="space-y-0.5">
                  {s.cons.map((c, i) => (
                    <li key={i} className="text-xs text-gray-600 flex gap-1">
                      <span className="text-red-400 shrink-0">△</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 診断モード ──

function DiagnosisMode() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);

  const allAnswered = Object.keys(answers).length === PICKER_QUESTIONS.length;

  const results = useMemo(() => {
    if (!allAnswered) return [];
    const totals: Record<string, number> = {};
    for (const s of SUPPORT_SYSTEMS) {
      totals[s.id] = 0;
    }
    for (const q of PICKER_QUESTIONS) {
      const selected = q.options[answers[q.id]];
      if (!selected) continue;
      for (const [sysId, score] of Object.entries(selected.scores)) {
        totals[sysId] = (totals[sysId] || 0) + score;
      }
    }
    return SUPPORT_SYSTEMS.map((s) => ({ system: s, score: totals[s.id] || 0 })).sort(
      (a, b) => b.score - a.score
    );
  }, [answers, allAnswered]);

  function handleAnswer(questionId: string, optionIndex: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setShowResult(false);
  }

  function handleReset() {
    setAnswers({});
    setShowResult(false);
  }

  const top2 = results.slice(0, 2);

  return (
    <div>
      <div className="space-y-5">
        {PICKER_QUESTIONS.map((q, qi) => (
          <div
            key={q.id}
            className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6"
          >
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              <span className="text-violet-600 mr-1">Q{qi + 1}.</span>
              {q.question}
            </h3>
            <div className="flex flex-wrap gap-2">
              {q.options.map((opt, oi) => (
                <button
                  key={oi}
                  onClick={() => handleAnswer(q.id, oi)}
                  className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
                    answers[q.id] === oi
                      ? "bg-violet-100 border-violet-300 text-violet-700 font-medium"
                      : "bg-white border-gray-200 text-gray-600 hover:border-violet-200 hover:bg-violet-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 診断ボタン */}
      <div className="mt-6 flex gap-3 justify-center">
        <button
          onClick={() => setShowResult(true)}
          disabled={!allAnswered}
          className={`px-6 py-3 rounded-xl font-semibold text-white transition-colors ${
            allAnswered
              ? "bg-violet-600 hover:bg-violet-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          診断する
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          リセット
        </button>
      </div>

      {/* 診断結果 */}
      {showResult && allAnswered && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
            診断結果
          </h3>

          <div className="space-y-4">
            {top2.map((r, i) => (
              <div
                key={r.system.id}
                className={`rounded-2xl border p-5 sm:p-6 ${
                  i === 0
                    ? "bg-violet-50 border-violet-200"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        i === 0
                          ? "bg-violet-200 text-violet-800"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {i === 0 ? "最もおすすめ" : "次点"}
                    </span>
                    <h4 className="text-xl font-bold text-gray-800 mt-2">
                      {r.system.name}
                    </h4>
                    <p className="text-xs text-gray-400">{r.system.brand}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-violet-600">
                      {r.score}
                    </span>
                    <span className="text-xs text-gray-400 block">スコア</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">{r.system.mechanism}</p>

                <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                  <div className="bg-white/70 rounded-lg p-2 text-center">
                    <span className="text-xs text-gray-400 block">耐荷重</span>
                    <span className="font-semibold text-gray-700">{r.system.maxLoad}kg</span>
                  </div>
                  <div className="bg-white/70 rounded-lg p-2 text-center">
                    <span className="text-xs text-gray-400 block">価格帯</span>
                    <span className="font-semibold text-gray-700">
                      ¥{r.system.priceRange[0].toLocaleString()}〜
                    </span>
                  </div>
                  <div className="bg-white/70 rounded-lg p-2 text-center">
                    <span className="text-xs text-gray-400 block">壁ダメージ</span>
                    <span
                      className={`font-semibold ${
                        r.system.wallDamage === "なし"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {r.system.wallDamage}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <h5 className="text-xs font-semibold text-gray-500 mb-1">こんな用途に最適</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {r.system.bestFor.map((b, bi) => (
                      <span
                        key={bi}
                        className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <a
                    href={buildAmazonUrl(r.system.amazonKeyword)}
                    target="_blank"
                    rel="noopener noreferrer nofollow sponsored"
                    className="text-sm bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
                  >
                    Amazonで見る
                  </a>
                  <a
                    href="/parts"
                    className="text-sm border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    パーツ辞典で詳しく
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* レーダーチャート比較 */}
          <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              トップ2のレーダー比較
            </h4>
            <RadarChart
              systems={top2.map((r) => r.system)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ── メインコンポーネント ──

type TabMode = "compare" | "diagnosis";

export default function SupportSystemPickerClient() {
  const [mode, setMode] = useState<TabMode>("compare");

  return (
    <div>
      {/* タブ切替 */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode("compare")}
          className={`flex-1 text-sm font-semibold py-3 rounded-xl border transition-colors ${
            mode === "compare"
              ? "bg-violet-600 text-white border-violet-600"
              : "bg-white text-gray-600 border-gray-200 hover:border-violet-200"
          }`}
        >
          比較マトリクス
        </button>
        <button
          onClick={() => setMode("diagnosis")}
          className={`flex-1 text-sm font-semibold py-3 rounded-xl border transition-colors ${
            mode === "diagnosis"
              ? "bg-violet-600 text-white border-violet-600"
              : "bg-white text-gray-600 border-gray-200 hover:border-violet-200"
          }`}
        >
          おすすめ診断
        </button>
      </div>

      {mode === "compare" ? <ComparisonMatrix /> : <DiagnosisMode />}
    </div>
  );
}
