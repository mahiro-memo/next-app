# 新しいアプリページ作成

新しいWebアプリ（ツール）ページを追加するスキル。

## ファイル構成（必須）

```
app/{アプリ名}/
  ├── page.tsx      ← Server Component（metadata + header + Tool + Article + footer）
  ├── Tool.tsx      ← "use client" インタラクティブUI
  └── Article.tsx   ← "use client" SEO記事（react-markdown使用）
```

## 手順

1. `app/{アプリ名}/` ディレクトリを作成
2. 以下の3ファイルを作成:
   - `page.tsx` — メタデータ（Metadata）+ レイアウト（Server Component）
   - `Tool.tsx` — メインのインタラクティブUI（`"use client"`）
   - `Article.tsx` — アプリの使い方・解説記事（`"use client"`, react-markdown使用）
3. `app/page.tsx` のアプリ一覧にカードリンクを追加
4. `app/layout.tsx` のヘッダーナビにリンクを追加（アプリが増えすぎたらドロップダウン化を検討）
5. `app/about/page.tsx` の提供アプリ一覧にも追加
6. `npx next build` でビルド確認

## テンプレート

### page.tsx（Server Component）

```tsx
import type { Metadata } from "next";
import Tool from "./Tool";
import Article from "./Article";

export const metadata: Metadata = {
  title: "{アプリ名}",
  description: "{アプリの説明文（60〜90文字）}",
};

export default function Page() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-[#1a1a1a]">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">
            {アプリ名}
          </h1>
          <p className="text-gray-300 text-center text-sm">
            {サブタイトル}
          </p>
        </header>

        {/* ツール */}
        <Tool />

        {/* 解説記事 */}
        <Article />

        <footer className="mt-8 text-center text-gray-500 text-xs">
          <p>&copy; 2026 {アプリ名}</p>
        </footer>
      </div>
    </main>
  );
}
```

### Tool.tsx（Client Component）

```tsx
"use client";

import { useState } from "react";

export default function Tool() {
  // --- 状態管理 ---

  // --- ロジック ---

  // --- 共通ボタンスタイル ---
  const btnPrimary =
    "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition";
  const btnSecondary =
    "bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2.5 px-6 rounded-lg transition";

  return (
    <>
      {/* ツールUI */}
      <div className="bg-[#2d2d2d] rounded-lg shadow-2xl p-6 md:p-8 border border-gray-700">
        {/* ... */}
      </div>
    </>
  );
}
```

### Article.tsx（Client Component）

```tsx
"use client";

import ReactMarkdown from "react-markdown";

const articleContent = `
# {アプリ名}の使い方

{アプリの概要説明}

## こんな悩みを解決します

- 悩み1
- 悩み2
- 悩み3

## 主な機能

### 1. 機能名
機能の説明...

### 2. 機能名
機能の説明...

## 使い方

### Step 1: ○○
操作手順の説明...

### Step 2: ○○
操作手順の説明...

## よくある使用例

### ケース1: ○○
具体的な使用シーンの説明...

### ケース2: ○○
具体的な使用シーンの説明...

## Tips

### ヒント1
便利な使い方の説明...

## まとめ

まとめ文...

---

*何か不具合や要望があれば、お気軽にお問い合わせください。*
`;

export default function Article() {
  return (
    <article className="bg-[#2d2d2d] rounded-lg shadow-2xl p-6 md:p-10 border border-gray-700 mt-8">
      <div className="prose prose-sm prose-invert max-w-none">
        <ReactMarkdown>{articleContent}</ReactMarkdown>
      </div>
    </article>
  );
}
```

## デザインルール

### 配色（ダークテーマ）
- ページ背景: `bg-[#1a1a1a]`
- カード背景: `bg-[#2d2d2d]`
- 内部カード: `bg-[#252525]`
- ボーダー: `border-gray-700`
- テキスト見出し: `text-white`
- テキスト本文: `text-gray-300`
- テキスト補足: `text-gray-400` / `text-gray-500`
- アクセント: `text-blue-400` / `bg-blue-600`

### コンポーネントパターン
- カード: `bg-[#2d2d2d] rounded-lg shadow-2xl p-6 md:p-8 border border-gray-700`
- 内部ボックス: `bg-[#1a1a1a] rounded-lg border border-gray-700 px-4 py-3`
- 入力欄: `bg-[#1a1a1a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`
- プライマリボタン: `bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition`
- セカンダリボタン: `bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2.5 px-6 rounded-lg transition`

### レイアウト
- コンテンツ幅: `max-w-3xl mx-auto`
- レスポンシブ余白: `p-4 md:p-8`
- 記事: `prose prose-sm prose-invert max-w-none`

## Article.tsx 記事ルール（AdSense対策）
- 1000文字以上のオリジナルコンテンツ
- 見出しタグの正しい階層（h1 > h2 > h3）
- 具体的な使用例を3つ以上
- アルゴリズムや計算方法の解説セクション
- Tipsセクションでユーザーに役立つ情報を提供
- 問い合わせへの誘導文を末尾に配置
