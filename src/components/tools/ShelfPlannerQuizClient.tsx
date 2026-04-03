"use client";

import { useState, useMemo, useCallback } from "react";
import {
  QUIZ_QUESTIONS,
  SHELF_PLAN_RESULTS,
  type ShelfPlanResult,
} from "@/constants/shelfPlannerQuiz";
import { buildAmazonUrl } from "@/data/products";

// ── スコアリング ──

function calcScores(answers: Record<string, number>): ShelfPlanResult[] {
  const totals: Record<string, number> = {};
  for (const result of SHELF_PLAN_RESULTS) {
    totals[result.id] = 0;
  }

  for (const [qIdx, optIdx] of Object.entries(answers)) {
    const question = QUIZ_QUESTIONS[Number(qIdx)];
    if (!question) continue;
    const option = question.options[optIdx];
    if (!option) continue;
    for (const [resultId, score] of Object.entries(option.scores)) {
      totals[resultId] = (totals[resultId] ?? 0) + score;
    }
  }

  return [...SHELF_PLAN_RESULTS].sort(
    (a, b) => (totals[b.id] ?? 0) - (totals[a.id] ?? 0)
  );
}

// ── 難易度ラベル ──

function difficultyLabel(d: 1 | 2 | 3): string {
  return d === 1 ? "初級（初心者OK）" : d === 2 ? "中級" : "上級";
}

function difficultyColor(d: 1 | 2 | 3): string {
  return d === 1
    ? "bg-green-100 text-green-700"
    : d === 2
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";
}

// ── コンポーネント ──

export default function ShelfPlannerQuizClient() {
  const [step, setStep] = useState(0); // 0..4 = 質問, 5 = 結果
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);

  const totalSteps = QUIZ_QUESTIONS.length;
  const isResult = step >= totalSteps;

  const topResults = useMemo(() => {
    if (!isResult) return [];
    return calcScores(answers).slice(0, 2);
  }, [isResult, answers]);

  const handleSelect = useCallback(
    (optionIndex: number) => {
      setAnswers((prev) => ({ ...prev, [step]: optionIndex }));
      setStep((prev) => prev + 1);
    },
    [step]
  );

  const handleBack = useCallback(() => {
    if (step > 0) setStep((prev) => prev - 1);
  }, [step]);

  const handleReset = useCallback(() => {
    setStep(0);
    setAnswers({});
    setCopied(false);
  }, []);

  const handleCopyResult = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // フォールバック
      }
    },
    []
  );

  // ── 質問画面 ──
  if (!isResult) {
    const question = QUIZ_QUESTIONS[step];
    const progress = ((step) / totalSteps) * 100;

    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        {/* プログレスバー */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>
              質問 {step + 1} / {totalSteps}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-rose-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 質問 */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          {question.question}
        </h2>
        <p className="text-gray-500 mb-6">{question.description}</p>

        {/* 選択肢 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`text-left p-4 rounded-xl border-2 transition-all hover:border-rose-400 hover:bg-rose-50 ${
                answers[step] === idx
                  ? "border-rose-500 bg-rose-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <p className="font-semibold text-gray-800">{option.label}</p>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* 戻るボタン */}
        {step > 0 && (
          <button
            onClick={handleBack}
            className="mt-6 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← 前の質問に戻る
          </button>
        )}
      </div>
    );
  }

  // ── 結果画面 ──
  return (
    <div className="space-y-8">
      <div className="text-center bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 sm:p-8 border border-rose-100">
        <p className="text-sm text-rose-600 font-semibold mb-2">
          診断結果
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          あなたにおすすめの棚はこちら！
        </h2>
      </div>

      {topResults.map((result, rank) => (
        <ResultCard
          key={result.id}
          result={result}
          rank={rank + 1}
          onCopy={handleCopyResult}
          copied={copied}
        />
      ))}

      {/* もう一度診断 */}
      <div className="text-center">
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
        >
          🔄 もう一度診断する
        </button>
      </div>
    </div>
  );
}

// ── 結果カード ──

function ResultCard({
  result,
  rank,
  onCopy,
  copied,
}: {
  result: ShelfPlanResult;
  rank: number;
  onCopy: (text: string) => void;
  copied: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-6 border-b border-rose-100">
        <div className="flex items-start gap-4">
          <span className="text-4xl">{result.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                {rank === 1 ? "🥇 第1位" : "🥈 第2位"}
              </span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColor(result.difficulty)}`}
              >
                {difficultyLabel(result.difficulty)}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
              {result.title}
            </h3>
            <p className="mt-2 text-gray-600 leading-relaxed">
              {result.description}
            </p>
          </div>
        </div>

        {/* 概要情報 */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-rose-200/50">
          <div className="text-center">
            <p className="text-xs text-gray-500">推定時間</p>
            <p className="font-semibold text-gray-800">{result.estimatedTime}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">費用目安</p>
            <p className="font-semibold text-gray-800">
              ¥{result.estimatedCost[0].toLocaleString()}〜
              {result.estimatedCost[1].toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">難易度</p>
            <p className="font-semibold text-gray-800">
              {"★".repeat(result.difficulty)}
              {"☆".repeat(3 - result.difficulty)}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 必要材料リスト */}
        <div>
          <h4 className="font-bold text-gray-800 mb-3">🛒 必要な材料</h4>
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-4 py-2 font-semibold text-gray-600">
                    材料
                  </th>
                  <th className="text-center px-4 py-2 font-semibold text-gray-600">
                    数量
                  </th>
                  <th className="text-center px-4 py-2 font-semibold text-gray-600">
                    Amazon
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.materials.map((m, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                  >
                    <td className="px-4 py-2 text-gray-800">{m.name}</td>
                    <td className="px-4 py-2 text-center text-gray-600">
                      {m.quantity}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <a
                        href={buildAmazonUrl(m.amazonKeyword)}
                        target="_blank"
                        rel="noopener noreferrer nofollow sponsored"
                        className="text-rose-600 hover:text-rose-700 hover:underline text-xs"
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

        {/* 必要工具 */}
        <div>
          <h4 className="font-bold text-gray-800 mb-3">🔧 必要な工具</h4>
          <div className="flex flex-wrap gap-2">
            {result.tools.map((tool, i) => (
              <span
                key={i}
                className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* 簡易手順 */}
        <div>
          <h4 className="font-bold text-gray-800 mb-3">📝 作り方の手順</h4>
          <ol className="space-y-2">
            {result.steps.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <span className="text-gray-700 pt-0.5">{s}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* ツール連携ボタン */}
        <div>
          <h4 className="font-bold text-gray-800 mb-3">🚀 次のステップ</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="/"
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all group"
            >
              <span className="text-2xl">🪵</span>
              <div>
                <p className="font-semibold text-gray-800 group-hover:text-amber-600 text-sm">
                  シミュレーターで設計する
                </p>
                <p className="text-xs text-gray-500">
                  レイアウト設計・部材リスト自動生成
                </p>
              </div>
            </a>
            {result.relatedTemplate && (
              <a
                href={result.relatedTemplate}
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all group"
              >
                <span className="text-2xl">📋</span>
                <div>
                  <p className="font-semibold text-gray-800 group-hover:text-amber-600 text-sm">
                    テンプレートを見る
                  </p>
                  <p className="text-xs text-gray-500">
                    ワンクリックで設計開始
                  </p>
                </div>
              </a>
            )}
            <a
              href="/tools/shelf-load-calc"
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
            >
              <span className="text-2xl">📐</span>
              <div>
                <p className="font-semibold text-gray-800 group-hover:text-indigo-600 text-sm">
                  耐荷重を計算する
                </p>
                <p className="text-xs text-gray-500">
                  棚板の安全な荷重を確認
                </p>
              </div>
            </a>
            <a
              href="/tools/material-cost-estimator"
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all group"
            >
              <span className="text-2xl">💰</span>
              <div>
                <p className="font-semibold text-gray-800 group-hover:text-emerald-600 text-sm">
                  費用を詳しく見積もる
                </p>
                <p className="text-xs text-gray-500">
                  材料費の詳細シミュレーション
                </p>
              </div>
            </a>
            <a
              href="/tools/support-system-picker"
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-all group"
            >
              <span className="text-2xl">🔧</span>
              <div>
                <p className="font-semibold text-gray-800 group-hover:text-violet-600 text-sm">
                  支柱システムを比較する
                </p>
                <p className="text-xs text-gray-500">
                  ディアウォール・ラブリコ等を比較
                </p>
              </div>
            </a>
            <a
              href="/parts"
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all group"
            >
              <span className="text-2xl">📦</span>
              <div>
                <p className="font-semibold text-gray-800 group-hover:text-amber-600 text-sm">
                  パーツ辞典を見る
                </p>
                <p className="text-xs text-gray-500">
                  各パーツの詳細・選び方を確認
                </p>
              </div>
            </a>
            <a
              href="/templates"
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all group"
            >
              <span className="text-2xl">📋</span>
              <div>
                <p className="font-semibold text-gray-800 group-hover:text-amber-600 text-sm">
                  テンプレート一覧
                </p>
                <p className="text-xs text-gray-500">
                  人気の棚デザインを一覧で見る
                </p>
              </div>
            </a>
            <a
              href="/howto"
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all group"
            >
              <span className="text-2xl">📖</span>
              <div>
                <p className="font-semibold text-gray-800 group-hover:text-amber-600 text-sm">
                  作り方ガイド
                </p>
                <p className="text-xs text-gray-500">
                  初心者向けDIYガイド記事
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* SNS共有 */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(result.shareText)}&url=${encodeURIComponent("https://diy-shelf-maker.kuras-plus.com/tools/shelf-planner-quiz")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            𝕏 結果をシェア
          </a>
          <button
            onClick={() => onCopy(result.shareText)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            {copied ? "✅ コピーしました" : "📋 テキストをコピー"}
          </button>
        </div>
      </div>
    </div>
  );
}
