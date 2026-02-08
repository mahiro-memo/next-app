import Tool from './Tool';

export const metadata = {
  title: '3D Chain-Angle Solver | Mahiro App',
  description: '3D空間で任意軸まわりに回転する点Bと固定点Aの距離がLとなる角度θを求める計算ツール',
};

export default function ChainAnglePage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          3D Chain-Angle Solver
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          3D空間での角度計算・公差解析・リアルタイム可視化
        </p>
        
        <Tool />
      </div>
    </main>
  );
}
