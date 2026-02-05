import type { Metadata } from 'next';
import WarikanTool from './Tool';
import WarikanArticle from './Article';

export const metadata: Metadata = {
  title: '負担割合別割り勘計算ツール | 学生・新人にも対応',
  description: '飲み会や食事会で負担割合が異なる場合の割り勘計算を簡単に。10割、8割、5割など柔軟に設定可能。端数処理にも対応した使いやすいツールです。',
  keywords: '割り勘,計算,ツール,飲み会,学生割引,負担割合,端数処理',
  openGraph: {
    title: '負担割合別割り勘計算ツール',
    description: '負担割合が異なる割り勘を簡単計算。学生や新人にも対応。',
    type: 'website',
  },
};

export default function WarikanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            負担割合別割り勘計算ツール
          </h1>
          <p className="mt-2 text-gray-600">
            学生・新人にも対応した柔軟な割り勘計算
          </p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* ツールセクション */}
        <section className="mb-16">
          <WarikanTool />
        </section>

        {/* 広告スペース（プレースホルダー） */}
        <section className="mb-16">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500">広告スペース</p>
            </div>
          </div>
        </section>

        {/* 記事セクション */}
        <section>
          <WarikanArticle />
        </section>
      </main>

      {/* フッター */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-sm text-gray-400">
            © 2026 負担割合別割り勘計算ツール. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
