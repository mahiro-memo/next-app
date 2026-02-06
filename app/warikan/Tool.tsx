"use client";

import { useState, useEffect, KeyboardEvent, ChangeEvent } from "react";

interface Ratio {
  ratio: number;
  count: number;
}

interface CalculationResult extends Ratio {
  amount: number;
}

const colors = [
  "blue",
  "green",
  "orange",
  "purple",
  "pink",
  "yellow",
  "red",
  "indigo",
];

export default function Tool() {
  const [totalAmount, setTotalAmount] = useState(10000);
  const [roundingUnit, setRoundingUnit] = useState(100);
  const [ratios, setRatios] = useState<Ratio[]>([
    { ratio: 100, count: 2 },
    { ratio: 80, count: 1 },
    { ratio: 50, count: 2 },
  ]);
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [totalPeople, setTotalPeople] = useState(0);
  const [averageAmount, setAverageAmount] = useState(0);
  const [totalCollected, setTotalCollected] = useState(0);
  const [difference, setDifference] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);

  // カンマ区切りフォーマット
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // カンマを除去して数値取得
  const parseNumber = (str: string): number => {
    return parseInt(str.replace(/,/g, "")) || 0;
  };

  // 計算処理
  useEffect(() => {
    const validRatios = ratios.filter((r) => r.count > 0);

    if (totalAmount === 0 || validRatios.length === 0) {
      setResults([]);
      setTotalPeople(0);
      setAverageAmount(0);
      setTotalCollected(0);
      setDifference(0);
      return;
    }

    // 合計人数
    const people = validRatios.reduce((sum, r) => sum + r.count, 0);
    setTotalPeople(people);

    // 平均額
    const avg = Math.floor(totalAmount / people);
    setAverageAmount(avg);

    // 負担ウェイトの合計
    const totalWeight = validRatios.reduce(
      (sum, r) => sum + (r.ratio / 100) * r.count,
      0,
    );

    // 基準単価
    const basePrice = totalAmount / totalWeight;

    // 各割合の支払額（切り上げ）
    const calculatedResults = validRatios.map((r) => {
      const price = basePrice * (r.ratio / 100);
      const rounded = Math.ceil(price / roundingUnit) * roundingUnit;
      return { ...r, amount: rounded };
    });

    setResults(calculatedResults);

    // 合計回収額
    const collected = calculatedResults.reduce(
      (sum, r) => sum + r.amount * r.count,
      0,
    );
    setTotalCollected(collected);
    setDifference(collected - totalAmount);
  }, [totalAmount, roundingUnit, ratios]);

  // 合計金額の入力処理
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const num = parseInt(value) || 0;
    setTotalAmount(num);
  };

  // 人数の入力処理
  const handleCountChange = (index: number, value: string) => {
    const num = parseInt(value.replace(/[^0-9]/g, "")) || 0;
    const newRatios = [...ratios];
    newRatios[index].count = num;
    setRatios(newRatios);
  };

  // 割合の変更処理
  const handleRatioChange = (index: number, value: number) => {
    const newRatios = [...ratios];
    newRatios[index].ratio = value;
    setRatios(newRatios);
  };

  // 行の追加
  const addRow = () => {
    setRatios([...ratios, { ratio: 100, count: 0 }]);
  };

  // 行の削除
  const deleteRow = (index: number) => {
    if (ratios.length === 1) return;
    const newRatios = ratios.filter((_, i) => i !== index);
    setRatios(newRatios);
  };

  // Enterキーで次の入力欄へ
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = document.getElementById(`count${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      } else {
        addRow();
        setTimeout(() => {
          const newInput = document.getElementById(`count${ratios.length}`);
          if (newInput) newInput.focus();
        }, 100);
      }
    }
  };

  // リセット処理
  const resetAll = () => {
    setTotalAmount(0);
    setRoundingUnit(100);
    setRatios([{ ratio: 100, count: 0 }]);
  };

  // Ctrl+R でリセット
  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.ctrlKey && e.key === "r") {
        e.preventDefault();
        resetAll();
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // 結果をコピー
  const copyResults = async () => {
    if (results.length === 0 || totalAmount === 0) return;

    let text = "【割り勘結果】\n";
    text += `合計金額: ${formatNumber(totalAmount)}円\n`;
    text += `合計人数: ${totalPeople}人\n\n`;

    results.forEach((r) => {
      text += `${r.ratio}%負担: ${formatNumber(r.amount)}円 × ${r.count}人\n`;
    });

    text += `\n合計回収額: ${formatNumber(totalCollected)}円`;
    if (difference > 0) {
      text += ` (+${formatNumber(difference)}円)`;
    } else if (difference < 0) {
      text += ` (-${formatNumber(Math.abs(difference))}円)`;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      alert("コピーに失敗しました");
    }
  };

  return (
    <div className="bg-[#2d2d2d] rounded-lg shadow-2xl p-6 md:p-8 border border-gray-700">
      {/* 合計金額入力 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          合計金額
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            ¥
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={totalAmount === 0 ? "" : formatNumber(totalAmount)}
            onChange={handleAmountChange}
            className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-12 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="10,000"
          />
        </div>
        {totalAmount === 0 && (
          <p className="text-xs text-red-400 mt-1">
            合計金額を入力してください
          </p>
        )}
      </div>

      {/* 端数処理設定 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          端数処理（切り上げ単位）
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[100, 500, 1000].map((unit) => (
            <button
              key={unit}
              onClick={() => setRoundingUnit(unit)}
              className={`rounded-lg py-2 text-sm font-semibold transition ${
                roundingUnit === unit
                  ? "bg-blue-600 border border-blue-500 text-white shadow-lg"
                  : "bg-[#1a1a1a] border border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {formatNumber(unit)}円
            </button>
          ))}
        </div>
      </div>

      {/* 負担割合設定 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-semibold text-gray-300">
            負担割合と人数
          </label>
          <button
            onClick={addRow}
            className="text-xs text-blue-400 hover:text-blue-300 transition"
          >
            + 行を追加
          </button>
        </div>

        <div className="space-y-2">
          {ratios.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-5">
                <select
                  value={item.ratio}
                  onChange={(e) =>
                    handleRatioChange(index, parseInt(e.target.value))
                  }
                  className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10].map((r) => (
                    <option key={r} value={r}>
                      {r}%
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-6">
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    id={`count${index}`}
                    value={item.count || ""}
                    onChange={(e) => handleCountChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    人
                  </span>
                </div>
              </div>
              <div className="col-span-1">
                <button
                  onClick={() => deleteRow(index)}
                  disabled={ratios.length === 1}
                  className={`transition ${
                    ratios.length === 1
                      ? "text-gray-700 cursor-not-allowed"
                      : "text-gray-500 hover:text-red-400"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        {totalAmount > 0 && totalPeople === 0 && (
          <p className="text-xs text-red-400 mt-2">人数を入力してください</p>
        )}
      </div>

      {/* 統計情報 */}
      {totalAmount > 0 && totalPeople > 0 && (
        <div className="mb-6 bg-[#1a1a1a] rounded-lg border border-gray-700 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">合計人数</div>
              <div className="text-2xl font-bold text-white">
                {totalPeople}人
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">平均額（参考）</div>
              <div className="text-2xl font-bold text-gray-400">
                ¥{formatNumber(averageAmount)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 結果表示 */}
      <div className="bg-[#1a1a1a] rounded-lg border border-gray-700 overflow-hidden">
        <div className="bg-[#252525] px-4 py-3 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">計算結果</h2>
          {results.length > 0 && (
            <button
              onClick={copyResults}
              className={`text-xs px-3 py-1.5 rounded transition flex items-center gap-1 ${
                copySuccess
                  ? "bg-green-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                ></path>
              </svg>
              <span>{copySuccess ? "コピーしました！" : "結果をコピー"}</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#252525] border-b border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-gray-400 font-semibold">
                  負担割合
                </th>
                <th className="px-4 py-3 text-center text-gray-400 font-semibold">
                  人数
                </th>
                <th className="px-4 py-3 text-right text-gray-400 font-semibold">
                  一人当たり支払額
                </th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {totalAmount === 0
                      ? "合計金額を入力してください"
                      : "人数を入力してください"}
                  </td>
                </tr>
              ) : (
                results.map((r, i) => {
                  const color = colors[i % colors.length];
                  return (
                    <tr
                      key={i}
                      className="border-b border-gray-800 hover:bg-[#252525] transition"
                    >
                      <td className="px-4 py-4 font-semibold text-white">
                        {r.ratio}%
                      </td>
                      <td className="px-4 py-4 text-center text-gray-300">
                        {r.count}人
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span
                          className={`text-2xl font-bold text-${color}-400`}
                        >
                          ¥{formatNumber(r.amount)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 合計回収額 */}
        {results.length > 0 && (
          <div className="bg-[#252525] px-4 py-4 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-semibold">合計回収額</span>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">
                  元の金額: ¥{formatNumber(totalAmount)}
                </div>
                <span className="text-xl font-bold text-white">
                  ¥{formatNumber(totalCollected)}
                </span>
                {difference !== 0 && (
                  <span
                    className={`ml-2 text-xs ${
                      difference > 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    ({difference > 0 ? "+" : "-"}¥
                    {formatNumber(Math.abs(difference))})
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* リセットボタン */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={resetAll}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          リセット
        </button>
      </div>
    </div>
  );
}
