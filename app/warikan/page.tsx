import type { Metadata } from "next";
import Tool from "./Tool";
import Article from "./Article";

export const metadata: Metadata = {
  title: "割り勘アプリ - 負担割合別の割り勘計算ツール",
  description:
    "負担割合が異なる人がいる場合の割り勘を簡単に計算。子連れの食事会や学生との飲み会に最適。",
};

export default function WarikanPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-[#1a1a1a]">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">
            割り勘アプリ
          </h1>
          <p className="text-gray-400 text-center text-sm">
            負担割合別の割り勘計算ツール
          </p>
          <p className="text-gray-500 text-center text-xs mt-2">
            Ctrl+R でリセット | Enter で次の入力欄へ
          </p>
        </header>

        {/* 割り勘ツール */}
        <Tool />

        {/* 解説記事 */}
        <Article />

        <footer className="mt-8 text-center text-gray-500 text-xs">
          <p>© 2026 割り勘アプリ</p>
        </footer>
      </div>
    </main>
  );
}
