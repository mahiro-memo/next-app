'use client';

import { useState } from 'react';
import { calculateChainAngle } from './logic';
import ThreeScene from './ThreeScene';
import type { InputParams, CalculationResult, DisplayOptions } from './types';

export default function Tool() {
  // 入力パラメータ
  const [A, setA] = useState<[number, number, number]>([100, 0, 0]);
  const [B0, setB0] = useState<[number, number, number]>([0, 100, 0]);
  const [P, setP] = useState<[number, number, number]>([0, 0, 0]);
  const [d, setD] = useState<[number, number, number]>([0, 0, 1]);
  const [L, setL] = useState<number>(141.42);
  const [theta0, setTheta0] = useState<number>(90);
  
  // 公差解析
  const [enableTolerance, setEnableTolerance] = useState(false);
  const [Lmin, setLmin] = useState<number>(140);
  const [Lmax, setLmax] = useState<number>(143);
  
  // 計算結果
  const [result, setResult] = useState<CalculationResult | null>(null);
  
  // 3D表示オプション
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
    showAxis: true,
    showOrbit: true,
    showPoints: true,
    showChains: true,
    showTolerance: true,
  });

  const handleCalculate = () => {
    const params: InputParams = {
      A,
      B0,
      P,
      d,
      L,
      theta0,
      tolerances: enableTolerance
        ? {
            L: { min: Lmin, max: Lmax },
          }
        : undefined,
    };
    
    const calcResult = calculateChainAngle(params);
    setResult(calcResult);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 左カラム: 入力フォーム */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              入力パラメータ
            </h2>
            
            {/* 固定点 A */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                固定点 A (mm)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={A[0]}
                  onChange={(e) => setA([parseFloat(e.target.value) || 0, A[1], A[2]])}
                  className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Ax"
                />
                <input
                  type="number"
                  value={A[1]}
                  onChange={(e) => setA([A[0], parseFloat(e.target.value) || 0, A[2]])}
                  className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Ay"
                />
                <input
                  type="number"
                  value={A[2]}
                  onChange={(e) => setA([A[0], A[1], parseFloat(e.target.value) || 0])}
                  className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Az"
                />
              </div>
            </div>
            
            {/* 回転点 B0 */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                回転点 B0 (mm)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={B0[0]}
                  onChange={(e) => setB0([parseFloat(e.target.value) || 0, B0[1], B0[2]])}
                  className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Bx"
                />
                <input
                  type="number"
                  value={B0[1]}
                  onChange={(e) => setB0([B0[0], parseFloat(e.target.value) || 0, B0[2]])}
                  className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="By"
                />
                <input
                  type="number"
                  value={B0[2]}
                  onChange={(e) => setB0([B0[0], B0[1], parseFloat(e.target.value) || 0])}
                  className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Bz"
                />
              </div>
            </div>
            
            {/* 回転軸上の点 P */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                回転軸上の点 P (mm)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={P[0]}
                  onChange={(e) => setP([parseFloat(e.target.value) || 0, P[1], P[2]])}
                  className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Px"
                />
                <input
                  type="number"
                  value={P[1]}
                  onChange={(e) => setP([P[0], parseFloat(e.target.value) || 0, P[2]])}
                  className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Py"
                />
                <input
                  type="number"
                  value={P[2]}
                  onChange={(e) => setP([P[0], P[1], parseFloat(e.target.value) || 0])}
                  className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Pz"
                />
              </div>
            </div>
            
            {/* 回転軸方向 d */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                回転軸方向 d (自動正規化)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={d[0]}
                  onChange={(e) => setD([parseFloat(e.target.value) || 0, d[1], d[2]])}
                  className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="dx"
                />
                <input
                  type="number"
                  value={d[1]}
                  onChange={(e) => setD([d[0], parseFloat(e.target.value) || 0, d[2]])}
                  className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="dy"
                />
                <input
                  type="number"
                  value={d[2]}
                  onChange={(e) => setD([d[0], d[1], parseFloat(e.target.value) || 0])}
                  className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="dz"
                />
              </div>
            </div>
            
            {/* チェーン長 L */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                チェーン長 L (mm)
              </label>
              <input
                type="number"
                value={L}
                onChange={(e) => setL(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            {/* 初期角度 θ0 */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                初期角度 θ0 (度)
              </label>
              <input
                type="number"
                value={theta0}
                onChange={(e) => setTheta0(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            {/* 公差解析 */}
            <div className="mb-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableTolerance}
                  onChange={(e) => setEnableTolerance(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  公差解析を有効化
                </span>
              </label>
            </div>
            
            {enableTolerance && (
              <div className="mb-4 pl-6 border-l-2 border-blue-500">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  L の公差範囲 (mm)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={Lmin}
                    onChange={(e) => setLmin(parseFloat(e.target.value) || 0)}
                    className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Lmin"
                  />
                  <input
                    type="number"
                    value={Lmax}
                    onChange={(e) => setLmax(parseFloat(e.target.value) || 0)}
                    className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Lmax"
                  />
                </div>
              </div>
            )}
            
            {/* 計算ボタン */}
            <button
              onClick={handleCalculate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              計算実行
            </button>
          </div>
          
          {/* 計算結果 */}
          {result && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                計算結果
              </h2>
              
              {result.error ? (
                <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded" role="alert">
                  <p className="font-bold">エラー</p>
                  <p>{result.error}</p>
                </div>
              ) : result.result && (
                <div className="space-y-4">
                  {/* 解1 */}
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                      解1（閉じ側: 0° 〜 90°）
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      θ1 = <span className="font-mono">{result.result.theta1.toFixed(2)}°</span>
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Δθ1 = <span className="font-mono">{result.result.deltaTheta1.toFixed(2)}°</span>
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      B(θ1) = <span className="font-mono">
                        [{result.result.B_theta1.map(v => v.toFixed(2)).join(', ')}]
                      </span>
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      距離 = <span className="font-mono">{result.result.distance1.toFixed(2)} mm</span>
                    </p>
                  </div>
                  
                  {/* 解2 */}
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                      解2（開き側: 90° 〜 180°）
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      θ2 = <span className="font-mono">{result.result.theta2.toFixed(2)}°</span>
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Δθ2 = <span className="font-mono">{result.result.deltaTheta2.toFixed(2)}°</span>
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      B(θ2) = <span className="font-mono">
                        [{result.result.B_theta2.map(v => v.toFixed(2)).join(', ')}]
                      </span>
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      距離 = <span className="font-mono">{result.result.distance2.toFixed(2)} mm</span>
                    </p>
                  </div>
                  
                  {/* 公差範囲 */}
                  {result.result.toleranceAngles && (
                    <div className="border-l-4 border-cyan-500 pl-4">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                        公差範囲
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        θmin = <span className="font-mono">{result.result.toleranceAngles.thetaMin.toFixed(2)}°</span>
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        θmax = <span className="font-mono">{result.result.toleranceAngles.thetaMax.toFixed(2)}°</span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* 右カラム: 3D表示 */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              3D 可視化
            </h2>
            
            <ThreeScene
              data={result?.threeDData ?? null}
              options={displayOptions}
            />
            
            {/* 表示オプション */}
            <div className="mt-4 space-y-2">
              <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300 mb-2">
                表示オプション
              </h3>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={displayOptions.showAxis}
                  onChange={(e) => setDisplayOptions({ ...displayOptions, showAxis: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">回転軸を表示（赤線）</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={displayOptions.showOrbit}
                  onChange={(e) => setDisplayOptions({ ...displayOptions, showOrbit: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">軌道円を表示（青円）</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={displayOptions.showPoints}
                  onChange={(e) => setDisplayOptions({ ...displayOptions, showPoints: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">点を表示（A:緑, B0:橙, 解:黄）</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={displayOptions.showChains}
                  onChange={(e) => setDisplayOptions({ ...displayOptions, showChains: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">チェーン線を表示（灰線）</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={displayOptions.showTolerance}
                  onChange={(e) => setDisplayOptions({ ...displayOptions, showTolerance: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">公差範囲を表示（半透明）</span>
              </label>
            </div>
            
            {/* 凡例 */}
            <div className="mt-4 text-xs text-gray-600 dark:text-gray-400">
              <p>💡 操作: ドラッグで回転、ホイールでズーム</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
