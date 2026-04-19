"use client";

import { useState, useMemo, useCallback } from "react";

// ── デバイスプリセット ──

type DeviceType =
  | "スマートプラグ"
  | "スマート照明"
  | "スマートリモコン"
  | "IoTセンサー"
  | "スマートスピーカー"
  | "ネットワークカメラ"
  | "カスタム入力";

const DEVICE_PRESETS: Record<DeviceType, number> = {
  スマートプラグ: 1,
  スマート照明: 9,
  スマートリモコン: 2,
  IoTセンサー: 0.5,
  スマートスピーカー: 3,
  ネットワークカメラ: 8,
  カスタム入力: 5,
};

const DEVICE_TYPES = Object.keys(DEVICE_PRESETS) as DeviceType[];

// ── 計算ロジック ──

function calcResults(
  watt: number,
  hours: number,
  devices: number,
  rate: number
) {
  const monthlyKwh = (watt * hours * 30 * devices) / 1000;
  const monthlyCost = monthlyKwh * rate;
  const yearlyCost = monthlyCost * 12;
  const tenYearCost = yearlyCost * 10;
  return { monthlyKwh, monthlyCost, yearlyCost, tenYearCost };
}

// ── コンポーネント ──

export default function SmartHomePowerCalcClient() {
  const [deviceType, setDeviceType] = useState<DeviceType>("スマートプラグ");
  const [watt, setWatt] = useState(DEVICE_PRESETS["スマートプラグ"]);
  const [hours, setHours] = useState(24);
  const [devices, setDevices] = useState(1);
  const [rate, setRate] = useState(31);

  const handleDeviceChange = useCallback((type: DeviceType) => {
    setDeviceType(type);
    setWatt(DEVICE_PRESETS[type]);
  }, []);

  const results = useMemo(
    () => calcResults(watt, hours, devices, rate),
    [watt, hours, devices, rate]
  );

  const fmt = (n: number) => n.toLocaleString("ja-JP");
  const fmtDecimal = (n: number, digits: number = 2) =>
    n.toLocaleString("ja-JP", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });

  return (
    <div className="mb-10">
      {/* 入力フォーム */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
          <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm">
            ⚡
          </span>
          計算条件を入力
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* デバイス種類 */}
          <div>
            <label
              htmlFor="deviceType"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              デバイス種類
            </label>
            <select
              id="deviceType"
              value={deviceType}
              onChange={(e) =>
                handleDeviceChange(e.target.value as DeviceType)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            >
              {DEVICE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}（{DEVICE_PRESETS[type]}W）
                </option>
              ))}
            </select>
          </div>

          {/* 消費電力 */}
          <div>
            <label
              htmlFor="watt"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              消費電力（W）
            </label>
            <input
              id="watt"
              type="number"
              min={0}
              step={0.1}
              value={watt}
              onChange={(e) => setWatt(Number(e.target.value))}
              disabled={deviceType !== "カスタム入力"}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
            />
            {deviceType !== "カスタム入力" && (
              <p className="mt-1 text-xs text-gray-400">
                「カスタム入力」を選ぶと自由に設定できます
              </p>
            )}
          </div>

          {/* 稼働時間 */}
          <div>
            <label
              htmlFor="hours"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              稼働時間（時間/日）
            </label>
            <input
              id="hours"
              type="number"
              min={0}
              max={24}
              step={0.5}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>

          {/* 台数 */}
          <div>
            <label
              htmlFor="devices"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              台数（台）
            </label>
            <input
              id="devices"
              type="number"
              min={1}
              max={100}
              step={1}
              value={devices}
              onChange={(e) => setDevices(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>

          {/* 電気料金単価 */}
          <div className="sm:col-span-2">
            <label
              htmlFor="rate"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              電気料金単価（円/kWh）
            </label>
            <input
              id="rate"
              type="number"
              min={0}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full sm:w-1/2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
            <p className="mt-1 text-xs text-gray-400">
              2026年現在、日本の一般家庭は約28〜35円/kWhが目安です
            </p>
          </div>
        </div>
      </div>

      {/* 結果表示 */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
          <span className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center text-sm">
            📊
          </span>
          計算結果
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* 月間消費電力量 */}
          <div className="bg-white rounded-xl border border-amber-100 p-4">
            <p className="text-xs text-gray-500 mb-1">月間消費電力量</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">
              {fmtDecimal(results.monthlyKwh)}
            </p>
            <p className="text-xs text-gray-400 mt-1">kWh</p>
          </div>

          {/* 月間電気代 */}
          <div className="bg-white rounded-xl border border-amber-100 p-4">
            <p className="text-xs text-gray-500 mb-1">月間電気代</p>
            <p className="text-xl sm:text-2xl font-bold text-amber-600">
              {fmt(Math.round(results.monthlyCost))}
            </p>
            <p className="text-xs text-gray-400 mt-1">円</p>
          </div>

          {/* 年間電気代 */}
          <div className="bg-white rounded-xl border border-amber-100 p-4">
            <p className="text-xs text-gray-500 mb-1">年間電気代</p>
            <p className="text-xl sm:text-2xl font-bold text-amber-600">
              {fmt(Math.round(results.yearlyCost))}
            </p>
            <p className="text-xs text-gray-400 mt-1">円</p>
          </div>

          {/* 10年間コスト */}
          <div className="bg-white rounded-xl border border-amber-100 p-4">
            <p className="text-xs text-gray-500 mb-1">10年間コスト</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">
              {fmt(Math.round(results.tenYearCost))}
            </p>
            <p className="text-xs text-gray-400 mt-1">円</p>
          </div>
        </div>

        {/* 補足情報 */}
        <div className="mt-5 bg-white rounded-xl border border-amber-100 p-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            <span className="font-semibold text-gray-800">
              {deviceType === "カスタム入力" ? "カスタムデバイス" : deviceType}
            </span>
            {devices > 1 ? `${fmt(devices)}台` : "1台"}を1日{hours}
            時間稼働した場合、月間の電気代は約
            <span className="font-semibold text-amber-600">
              {fmt(Math.round(results.monthlyCost))}円
            </span>
            です。
            {results.monthlyCost < 100 && (
              <>
                DIY棚にスマートデバイスを組み込んでも、電気代への影響はごくわずかです。
              </>
            )}
          </p>
        </div>

        {/* 計算式 */}
        <details className="mt-4">
          <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
            計算式を表示
          </summary>
          <div className="mt-2 bg-white rounded-lg border border-gray-100 p-3 text-xs text-gray-500 space-y-1">
            <p>
              月間消費電力量 = {watt}W × {hours}時間 × 30日 × {devices}台 ÷ 1,000 ={" "}
              {fmtDecimal(results.monthlyKwh)} kWh
            </p>
            <p>
              月間電気代 = {fmtDecimal(results.monthlyKwh)} kWh × {rate}円 ={" "}
              {fmt(Math.round(results.monthlyCost))}円
            </p>
            <p>年間電気代 = 月間電気代 × 12 = {fmt(Math.round(results.yearlyCost))}円</p>
            <p>10年間コスト = 年間電気代 × 10 = {fmt(Math.round(results.tenYearCost))}円</p>
          </div>
        </details>
      </div>
    </div>
  );
}
