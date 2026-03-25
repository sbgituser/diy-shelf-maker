"use client";

import type { DesignInput, DesignResult } from "@/types";

interface Props {
  input: DesignInput;
  result: DesignResult;
  /** 選択中の棚板インデックス (-1 = 未選択) */
  selectedShelf?: number;
  /** 棚板クリック時のコールバック */
  onShelfClick?: (index: number) => void;
}

const C = {
  pillar: "#C4A46A",
  pillarStroke: "#8B6914",
  shelf: "#D4A76A",
  shelfStroke: "#9B7530",
  shelfSelected: "#F59E0B",
  shelfSelectedStroke: "#D97706",
  adjuster: "#666",
  bracket: "#888",
  dimension: "#E74C3C",
  dimText: "#C0392B",
  line: "#888",
  bg: "#FAFAF7",
  wall: "#ddd",
};

export default function ShelfDiagram({ input, result, selectedShelf = -1, onShelfClick }: Props) {
  const isLong = input.pillarOrientation === "long";

  return (
    <div className="space-y-6">
      {/* ── 正面図 ── */}
      <div>
        <p className="text-xs text-gray-500 font-medium mb-1">▼ 正面図</p>
        <FrontView input={input} result={result} selectedShelf={selectedShelf} onShelfClick={onShelfClick} />
      </div>

      {/* ── 側面図 ── */}
      <div>
        <p className="text-xs text-gray-500 font-medium mb-1">▼ 側面図（{isLong ? "長辺" : "短辺"}が壁側）</p>
        <SideView input={input} result={result} />
      </div>

      {/* ── 上面図 ── */}
      <div>
        <p className="text-xs text-gray-500 font-medium mb-1">▼ 上面図</p>
        <TopView input={input} result={result} />
      </div>
    </div>
  );
}

// ════════════════════════════════════
// 正面図
// ════════════════════════════════════
function FrontView({ input, result, selectedShelf = -1, onShelfClick }: Props) {
  const SVG_W = 520;
  const SVG_H = 560;
  const MARGIN = { top: 40, bottom: 50, left: 80, right: 80 };
  const drawW = SVG_W - MARGIN.left - MARGIN.right;
  const drawH = SVG_H - MARGIN.top - MARGIN.bottom;

  const isLong = input.pillarOrientation === "long";
  const effectiveHeight = input.fullHeight ? input.ceilingHeight : input.unitHeight ?? 1200;
  const scaleY = drawH / effectiveHeight;
  const toY = (mmFromFloor: number) => MARGIN.top + drawH - mmFromFloor * scaleY;

  // 柱の正面幅
  const pillarFaceWidth = isLong ? result.lumberSpec.depthMm : result.lumberSpec.widthMm;
  const pillarWidthPx = Math.max(pillarFaceWidth * (drawW / (input.shelfWidth + 250)), 10);
  const shelfThickPx = Math.max(result.shelfBoard.thicknessMm * scaleY, 3);

  // 柱X座標
  const pillarGap = input.pillarCount > 1
    ? (drawW - pillarWidthPx * input.pillarCount) / (input.pillarCount - 1)
    : 0;
  const pillars: number[] = [];
  if (input.pillarCount === 1) {
    pillars.push(MARGIN.left + drawW / 2 - pillarWidthPx / 2);
  } else {
    for (let i = 0; i < input.pillarCount; i++) {
      pillars.push(MARGIN.left + i * (pillarGap + pillarWidthPx));
    }
  }

  // 個別棚板幅
  const getShelfWidth = (idx: number) =>
    input.shelfWidths?.[idx] ?? input.shelfWidth;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full max-w-[520px] mx-auto"
        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
      >
        <rect width={SVG_W} height={SVG_H} fill={C.bg} rx="8" />

        {/* 天井/床 */}
        {input.fullHeight && (
          <>
            <line x1={MARGIN.left - 20} y1={MARGIN.top} x2={SVG_W - MARGIN.right + 20} y2={MARGIN.top} stroke={C.line} strokeWidth="2" strokeDasharray="8,4" />
            <text x={MARGIN.left - 25} y={MARGIN.top + 4} textAnchor="end" fontSize="10" fill={C.line}>天井</text>
          </>
        )}
        <line x1={MARGIN.left - 20} y1={MARGIN.top + drawH} x2={SVG_W - MARGIN.right + 20} y2={MARGIN.top + drawH} stroke={C.line} strokeWidth="2" />
        <text x={MARGIN.left - 25} y={MARGIN.top + drawH + 4} textAnchor="end" fontSize="10" fill={C.line}>床</text>

        {/* 壁面背景 */}
        <rect x={MARGIN.left - 5} y={MARGIN.top - 5} width={drawW + 10} height={drawH + 10} fill="none" stroke="#ddd" strokeWidth="1" strokeDasharray="4,4" rx="2" />
        <text x={SVG_W - MARGIN.right + 15} y={MARGIN.top + 15} fontSize="9" fill="#bbb" writingMode="vertical-rl">壁面</text>

        {/* 柱 */}
        {pillars.map((px, i) => (
          <g key={`p-${i}`}>
            <rect x={px} y={MARGIN.top + (input.fullHeight ? 6 : 0)} width={pillarWidthPx} height={drawH - (input.fullHeight ? 12 : 0)} fill={C.pillar} stroke={C.pillarStroke} strokeWidth="1" rx="2" />
            {Array.from({ length: 5 }).map((_, j) => (
              <line key={`g-${i}-${j}`} x1={px + 2} y1={MARGIN.top + 30 + j * (drawH / 6)} x2={px + pillarWidthPx - 2} y2={MARGIN.top + 35 + j * (drawH / 6)} stroke={C.pillarStroke} strokeWidth="0.5" opacity="0.3" />
            ))}
            {input.fullHeight && (
              <>
                <rect x={px - 1} y={MARGIN.top} width={pillarWidthPx + 2} height={6} fill={C.adjuster} rx="1" />
                <rect x={px - 1} y={MARGIN.top + drawH - 6} width={pillarWidthPx + 2} height={6} fill={C.adjuster} rx="1" />
              </>
            )}
          </g>
        ))}

        {/* 棚板 */}
        {result.shelfHeights.map((h, i) => {
          const y = toY(h);
          const isDesk = input.layout === "desk" && i === 0;
          const isSelected = selectedShelf === i;
          const shelfW = getShelfWidth(i);

          // short: 棚板は柱間に渡す
          // long: 棚板は柱の手前にブラケットで張り出す（正面から見ると柱と重なる）
          let sx: number, sw: number;
          if (isLong && input.pillarCount >= 2) {
            // 長辺壁側: 棚板が柱の前面に張り出す → 柱外縁より少しはみ出す
            const leftP = pillars[0];
            const rightP = pillars[pillars.length - 1] + pillarWidthPx;
            const center = (leftP + rightP) / 2;
            const shelfPxW = (shelfW / input.shelfWidth) * (rightP - leftP + pillarWidthPx * 2);
            sx = center - shelfPxW / 2;
            sw = shelfPxW;
          } else {
            // 短辺壁側: 柱間に棚板を渡す
            const scaledW = (shelfW / input.shelfWidth) * (pillars[pillars.length - 1] + pillarWidthPx - pillars[0] + 6);
            const center = (pillars[0] + pillars[pillars.length - 1] + pillarWidthPx) / 2;
            sx = center - scaledW / 2;
            sw = scaledW;
          }

          return (
            <g
              key={`s-${i}`}
              onClick={() => onShelfClick?.(i)}
              style={{ cursor: onShelfClick ? "pointer" : "default" }}
            >
              <rect
                x={sx}
                y={y - shelfThickPx / 2}
                width={sw}
                height={isDesk ? shelfThickPx * 1.5 : shelfThickPx}
                fill={isSelected ? C.shelfSelected : isDesk ? "#B8956A" : C.shelf}
                stroke={isSelected ? C.shelfSelectedStroke : C.shelfStroke}
                strokeWidth={isSelected ? 2 : 1}
                rx="1"
              />
              {/* 長辺壁側: ブラケット三角を描画 */}
              {isLong && pillars.map((px, pi) => (
                <polygon
                  key={`br-${i}-${pi}`}
                  points={`${px + pillarWidthPx / 2 - 4},${y - shelfThickPx / 2} ${px + pillarWidthPx / 2 + 4},${y - shelfThickPx / 2} ${px + pillarWidthPx / 2},${y + 8}`}
                  fill={C.bracket}
                  opacity="0.7"
                />
              ))}
              <text x={sx + sw + 8} y={y + 4} fontSize="9" fill={isSelected ? C.shelfSelectedStroke : "#666"}>
                {isDesk ? "天板" : `${i + 1}段 ${shelfW}mm`}
              </text>
            </g>
          );
        })}

        {/* 寸法線: 全高 */}
        <line x1={MARGIN.left - 50} y1={MARGIN.top} x2={MARGIN.left - 50} y2={MARGIN.top + drawH} stroke={C.dimension} strokeWidth="1" markerStart="url(#aU)" markerEnd="url(#aD)" />
        <text x={MARGIN.left - 55} y={MARGIN.top + drawH / 2} textAnchor="middle" fontSize="11" fill={C.dimText} fontWeight="bold" transform={`rotate(-90, ${MARGIN.left - 55}, ${MARGIN.top + drawH / 2})`}>
          {input.fullHeight ? `天井高 ${input.ceilingHeight}mm` : `高さ ${input.unitHeight}mm`}
        </text>

        {/* 寸法線: 柱カット長 */}
        {input.fullHeight && (
          <>
            <line x1={MARGIN.left - 30} y1={MARGIN.top + 6} x2={MARGIN.left - 30} y2={MARGIN.top + drawH - 6} stroke="#3498DB" strokeWidth="1" strokeDasharray="4,2" />
            <text x={MARGIN.left - 35} y={MARGIN.top + drawH / 2} textAnchor="middle" fontSize="9" fill="#2980B9" transform={`rotate(-90, ${MARGIN.left - 35}, ${MARGIN.top + drawH / 2})`}>
              柱 {result.pillarLength}mm
            </text>
          </>
        )}

        {/* 矢印マーカー */}
        <defs>
          <marker id="aU" markerWidth="6" markerHeight="6" refX="3" refY="6"><path d="M0,6 L3,0 L6,6" fill={C.dimension} /></marker>
          <marker id="aD" markerWidth="6" markerHeight="6" refX="3" refY="0"><path d="M0,0 L3,6 L6,0" fill={C.dimension} /></marker>
        </defs>
      </svg>
    </div>
  );
}

// ════════════════════════════════════
// 側面図
// ════════════════════════════════════
function SideView({ input, result }: { input: DesignInput; result: DesignResult }) {
  const SVG_W = 300;
  const SVG_H = 400;
  const MARGIN = { top: 30, bottom: 40, left: 50, right: 60 };
  const drawW = SVG_W - MARGIN.left - MARGIN.right;
  const drawH = SVG_H - MARGIN.top - MARGIN.bottom;

  const isLong = input.pillarOrientation === "long";
  const lumber = result.lumberSpec;
  const effectiveHeight = input.fullHeight ? input.ceilingHeight : input.unitHeight ?? 1200;
  const scaleY = drawH / effectiveHeight;
  const toY = (mmFromFloor: number) => MARGIN.top + drawH - mmFromFloor * scaleY;

  // 柱の側面奥行（壁からの出っ張り）
  const pillarDepthMm = isLong ? lumber.widthMm : lumber.depthMm; // 壁側の寸法
  const shelfDepthMm = input.shelfDepth;
  const totalDepthMm = isLong
    ? pillarDepthMm + shelfDepthMm // 長辺壁側: 柱奥行 + 棚板が手前に張り出し
    : Math.max(pillarDepthMm, shelfDepthMm); // 短辺壁側: 柱と棚が重なる

  const scaleX = drawW / totalDepthMm;
  const wallX = MARGIN.left;

  // 柱位置（側面から見た）
  const pillarX = wallX;
  const pillarW = pillarDepthMm * scaleX;

  // 棚板位置（側面から見た）
  let shelfX: number, shelfW: number;
  if (isLong) {
    // 長辺壁側: 柱の手前にブラケットで取付、手前に張り出す
    shelfX = wallX + pillarW;
    shelfW = shelfDepthMm * scaleX;
  } else {
    // 短辺壁側: 柱の奥行内に棚板がある
    shelfX = wallX;
    shelfW = shelfDepthMm * scaleX;
  }

  const shelfThickPx = Math.max(result.shelfBoard.thicknessMm * scaleY, 3);

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full max-w-[300px] mx-auto"
        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
      >
        <rect width={SVG_W} height={SVG_H} fill={C.bg} rx="8" />

        {/* 壁 */}
        <line x1={wallX} y1={MARGIN.top - 10} x2={wallX} y2={MARGIN.top + drawH + 10} stroke={C.wall} strokeWidth="4" />
        <text x={wallX - 5} y={MARGIN.top + drawH / 2} textAnchor="end" fontSize="9" fill="#999" transform={`rotate(-90, ${wallX - 5}, ${MARGIN.top + drawH / 2})`}>壁</text>

        {/* 天井/床 */}
        {input.fullHeight && (
          <line x1={wallX - 5} y1={MARGIN.top} x2={wallX + drawW + 10} y2={MARGIN.top} stroke={C.line} strokeWidth="1.5" strokeDasharray="6,3" />
        )}
        <line x1={wallX - 5} y1={MARGIN.top + drawH} x2={wallX + drawW + 10} y2={MARGIN.top + drawH} stroke={C.line} strokeWidth="1.5" />

        {/* 柱（側面） */}
        <rect
          x={pillarX}
          y={MARGIN.top + (input.fullHeight ? 5 : 0)}
          width={pillarW}
          height={drawH - (input.fullHeight ? 10 : 0)}
          fill={C.pillar}
          stroke={C.pillarStroke}
          strokeWidth="1"
          rx="2"
        />

        {/* アジャスター */}
        {input.fullHeight && (
          <>
            <rect x={pillarX - 1} y={MARGIN.top} width={pillarW + 2} height={5} fill={C.adjuster} rx="1" />
            <rect x={pillarX - 1} y={MARGIN.top + drawH - 5} width={pillarW + 2} height={5} fill={C.adjuster} rx="1" />
          </>
        )}

        {/* 棚板（側面） */}
        {result.shelfHeights.map((h, i) => {
          const y = toY(h);
          return (
            <g key={`ss-${i}`}>
              <rect
                x={shelfX}
                y={y - shelfThickPx / 2}
                width={shelfW}
                height={shelfThickPx}
                fill={C.shelf}
                stroke={C.shelfStroke}
                strokeWidth="1"
                rx="1"
              />
              {/* ブラケット（長辺壁側の場合） */}
              {isLong && (
                <polygon
                  points={`${pillarX + pillarW},${y - shelfThickPx / 2} ${pillarX + pillarW + Math.min(shelfW * 0.4, 15)},${y + 6} ${pillarX + pillarW},${y + 6}`}
                  fill={C.bracket}
                  opacity="0.7"
                />
              )}
            </g>
          );
        })}

        {/* 寸法線: 奥行 */}
        <line x1={wallX} y1={MARGIN.top + drawH + 15} x2={wallX + Math.max(pillarW, shelfX - wallX + shelfW)} y2={MARGIN.top + drawH + 15} stroke={C.dimension} strokeWidth="0.8" />
        <text
          x={wallX + Math.max(pillarW, shelfX - wallX + shelfW) / 2}
          y={MARGIN.top + drawH + 28}
          textAnchor="middle"
          fontSize="9"
          fill={C.dimText}
        >
          {isLong ? `柱${pillarDepthMm}mm + 棚${shelfDepthMm}mm` : `奥行 ${shelfDepthMm}mm`}
        </text>

        {/* 寸法ラベル */}
        <text x={pillarX + pillarW / 2} y={MARGIN.top + drawH / 2} textAnchor="middle" fontSize="8" fill="#654" fontWeight="bold" transform={`rotate(-90, ${pillarX + pillarW / 2}, ${MARGIN.top + drawH / 2})`}>
          柱 {pillarDepthMm}mm
        </text>

        {/* 正面方向矢印 */}
        <text x={SVG_W - MARGIN.right + 10} y={MARGIN.top + drawH + 28} fontSize="8" fill="#999">→正面</text>
      </svg>
    </div>
  );
}

// ════════════════════════════════════
// 上面図
// ════════════════════════════════════
function TopView({ input, result }: { input: DesignInput; result: DesignResult }) {
  const W = 420;
  const H = 140;
  const lumber = result.lumberSpec;
  const isLong = input.pillarOrientation === "long";

  // 柱断面: 正面幅 × 壁方向奥行
  const faceMm = isLong ? lumber.depthMm : lumber.widthMm;
  const wallMm = isLong ? lumber.widthMm : lumber.depthMm;
  const scale = 1.0;
  const pW = faceMm * scale;
  const pD = wallMm * scale;

  const gap = 30;
  const count = Math.min(input.pillarCount, 4);
  const totalW = pW * count + gap * (count - 1);
  const startX = (W - totalW) / 2;

  // 棚板の上面表示
  const shelfDepthPx = input.shelfDepth * scale * 0.4;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[420px] mx-auto">
        <rect width={W} height={H} fill={C.bg} rx="6" />

        {/* 壁 */}
        <rect x={startX - 20} y={8} width={totalW + 40} height={5} fill={C.wall} rx="1" />
        <text x={W / 2} y={8} textAnchor="middle" fontSize="8" fill="#999">壁</text>

        {/* 柱 */}
        {Array.from({ length: count }).map((_, i) => {
          const x = startX + i * (pW + gap);
          const y = 18;
          return (
            <g key={i}>
              <rect x={x} y={y} width={pW} height={pD} fill={C.pillar} stroke={C.pillarStroke} strokeWidth="1" rx="2" />
              <text x={x + pW / 2} y={y + pD / 2 + 3} textAnchor="middle" fontSize="7" fill="#654" fontWeight="bold">
                {faceMm}×{wallMm}
              </text>
              {i === 0 && (
                <>
                  <line x1={x - 6} y1={y} x2={x - 6} y2={y + pD} stroke={C.dimension} strokeWidth="0.6" />
                  <text x={x - 9} y={y + pD / 2 + 3} textAnchor="end" fontSize="6" fill={C.dimText}>{wallMm}</text>
                </>
              )}
            </g>
          );
        })}

        {/* 棚板（上面） */}
        {isLong ? (
          /* 長辺壁側: 棚板は柱の手前に張り出す */
          <rect
            x={startX - 5}
            y={18 + pD + 3}
            width={totalW + 10}
            height={shelfDepthPx}
            fill={C.shelf}
            stroke={C.shelfStroke}
            strokeWidth="1"
            opacity="0.6"
            rx="1"
          />
        ) : (
          /* 短辺壁側: 棚板は柱間に渡す */
          count >= 2 && Array.from({ length: count - 1 }).map((_, i) => {
            const x1 = startX + i * (pW + gap) + pW;
            const x2 = startX + (i + 1) * (pW + gap);
            return (
              <rect
                key={`shelf-top-${i}`}
                x={x1}
                y={18 + (pD - shelfDepthPx) / 2}
                width={x2 - x1}
                height={shelfDepthPx}
                fill={C.shelf}
                stroke={C.shelfStroke}
                strokeWidth="1"
                opacity="0.6"
                rx="1"
              />
            );
          })
        )}

        {/* 棚板奥行ラベル */}
        <text x={W / 2} y={isLong ? 18 + pD + 3 + shelfDepthPx / 2 + 3 : 18 + pD / 2 + 3} textAnchor="middle" fontSize="7" fill="#9B7530">
          棚板 奥行{input.shelfDepth}mm
        </text>

        {/* 説明文 */}
        <text x={W / 2} y={H - 5} textAnchor="middle" fontSize="7" fill="#999">
          ※ {isLong ? `長辺(${wallMm}mm)を壁側 — 棚板は手前に張り出し` : `短辺(${wallMm}mm)を壁側 — 棚板は柱間に渡す`}
        </text>

        {/* 正面方向矢印 */}
        <text x={W - 25} y={H / 2 + 3} fontSize="8" fill="#999">↓正面</text>
      </svg>
    </div>
  );
}
