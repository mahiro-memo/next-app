import type { Metadata } from "next";
import Tool from "./Tool";
import Article from "./Article";

export const metadata: Metadata = {
  title: "テニス乱数表アプリ",
  description:
    "テニスの練習会やサークルで使える試合組み合わせ自動生成ツール。シングルス・ダブルス対応、グループ分け、公平なラウンド生成。",
};

export default function TennisPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-[#1a1a1a]">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">
            テニス乱数表アプリ
          </h1>
          <p className="text-gray-300 text-center text-sm">
            自動で試合の組み合わせを生成します
          </p>
        </header>

        {/* テニス乱数表ツール */}
        <Tool />

        {/* 解説記事 */}
        <Article />

        <footer className="mt-8 text-center text-gray-500 text-xs">
          <p>&copy; 2026 テニス乱数表アプリ</p>
        </footer>
      </div>
    </main>
  );
}
