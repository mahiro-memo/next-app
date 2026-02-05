'use client';

import { useState, useEffect } from 'react';

interface ParticipantGroup {
  ratio: number; // 10, 20, ..., 100 (%)
  count: number;
}

interface CalculationResult {
  ratio: number;
  count: number;
  amountPerPerson: number;
}

export default function WarikanTool() {
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [roundingUnit, setRoundingUnit] = useState<number>(100);
  const [groups, setGroups] = useState<ParticipantGroup[]>([
    { ratio: 100, count: 0 },
    { ratio: 90, count: 0 },
    { ratio: 80, count: 0 },
    { ratio: 70, count: 0 },
    { ratio: 60, count: 0 },
    { ratio: 50, count: 0 },
  ]);

  // LocalStorageからデータを読み込み
  useEffect(() => {
    const saved = localStorage.getItem('warikan-data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setTotalAmount(data.totalAmount || '');
        setRoundingUnit(data.roundingUnit || 100);
        setGroups(data.groups || groups);
      } catch (e) {
        console.error('Failed to load data:', e);
      }
    }
  }, []);

  // データが変更されたらLocalStorageに保存
  useEffect(() => {
    const data = { totalAmount, roundingUnit, groups };
    localStorage.setItem('warikan-data', JSON.stringify(data));
  }, [totalAmount, roundingUnit, groups]);

  const updateGroupCount = (index: number, count: string) => {
    const newGroups = [...groups];
    newGroups[index].count = Math.max(0, parseInt(count) || 0);
    setGroups(newGroups);
  };

  const calculateResults = (): CalculationResult[] => {
    const amount = parseFloat(totalAmount) || 0;
    if (amount === 0) return [];

    // 負担ウェイトの合計を計算
    const totalWeight = groups.reduce((sum, group) => {
      return sum + (group.ratio / 100) * group.count;
    }, 0);

    if (totalWeight === 0) return [];

    // 基準単価を計算
    const basePrice = amount / totalWeight;

    // 各グループの支払額を計算（端数処理あり）
    return groups
      .filter(group => group.count > 0)
      .map(group => {
        const rawAmount = basePrice * (group.ratio / 100);
        const roundedAmount = Math.ceil(rawAmount / roundingUnit) * roundingUnit;
        return {
          ratio: group.ratio,
          count: group.count,
          amountPerPerson: roundedAmount,
        };
      });
  };

  const results = calculateResults();
  const totalAfterRounding = results.reduce(
    (sum, result) => sum + result.amountPerPerson * result.count,
    0
  );

  const handleReset = () => {
    if (confirm('すべてのデータをリセットしますか？')) {
      setTotalAmount('');
      setRoundingUnit(100);
      setGroups([
        { ratio: 100, count: 0 },
        { ratio: 90, count: 0 },
        { ratio: 80, count: 0 },
        { ratio: 70, count: 0 },
        { ratio: 60, count: 0 },
        { ratio: 50, count: 0 },
      ]);
      localStorage.removeItem('warikan-data');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">割り勘計算ツール</h2>

      {/* 合計金額入力 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          合計金額
        </label>
        <input
          type="number"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          placeholder="10000"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* 端数処理設定 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          端数切り上げ単位
        </label>
        <div className="flex gap-2 flex-wrap">
          {[1, 10, 100, 1000].map((unit) => (
            <button
              key={unit}
              onClick={() => setRoundingUnit(unit)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                roundingUnit === unit
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {unit === 1 ? '1円' : `${unit}円`}
            </button>
          ))}
        </div>
      </div>

      {/* 負担割合ごとの人数入力 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          負担割合と人数
        </label>
        <div className="space-y-3">
          {groups.map((group, index) => (
            <div key={group.ratio} className="flex items-center gap-4">
              <div className="w-20 text-right font-medium text-gray-700">
                {group.ratio}割
              </div>
              <input
                type="number"
                min="0"
                value={group.count || ''}
                onChange={(e) => updateGroupCount(index, e.target.value)}
                placeholder="0"
                className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-gray-600">人</span>
            </div>
          ))}
        </div>
      </div>

      {/* 計算結果 */}
      {results.length > 0 && (
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-bold mb-4 text-gray-800">計算結果</h3>
          <div className="space-y-3">
            {results.map((result) => (
              <div
                key={result.ratio}
                className="flex justify-between items-center py-2 border-b border-blue-200 last:border-b-0"
              >
                <span className="font-medium text-gray-700">
                  {result.ratio}割負担 × {result.count}人
                </span>
                <span className="text-xl font-bold text-blue-600">
                  ¥{result.amountPerPerson.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t-2 border-blue-300">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                元の合計金額: ¥{parseFloat(totalAmount).toLocaleString()}
              </span>
              <span className="text-sm text-gray-600">
                端数処理後: ¥{totalAfterRounding.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* リセットボタン */}
      <div className="mt-6">
        <button
          onClick={handleReset}
          className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          リセット
        </button>
      </div>
    </div>
  );
}
