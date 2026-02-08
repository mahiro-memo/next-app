# Mahiro App

## プロジェクト概要
日常生活で役立つ便利なWebアプリケーション集。

## 技術スタック
- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4 + `@tailwindcss/typography`
- **React**: v19
- **Markdown**: react-markdown

## ディレクトリ構成
```
app/
├── layout.tsx          # ルートレイアウト（グローバルヘッダー・フッター）
├── page.tsx            # トップページ
├── globals.css         # グローバルCSS
├── random/page.tsx     # 乱数作成アプリ（"use client"）
├── warikan/            # 割り勘アプリ
│   ├── page.tsx
│   ├── Tool.tsx        # メイン計算UI（"use client"）
│   └── Article.tsx     # Markdown記事コンポーネント（"use client"）
├── about/page.tsx      # 運営者情報
├── privacy/page.tsx    # プライバシーポリシー
├── terms/page.tsx      # 利用規約
└── contact/page.tsx    # お問い合わせ


```

## 既存アプリ一覧
- `/random` - 乱数生成ツール
- `/warikan` - 割り勘計算ツール（Tool.tsx + Article.tsx構成）

## 新規アプリ追加時の標準構成
```
app/
└── [app-name]/
    ├── page.tsx        # メインページ（Server Component）
    ├── Tool.tsx        # 計算UI（"use client"）
    └── Article.tsx     # 解説記事（"use client"、任意）
```
## 新規アプリ開発フロー
1. **仕様策定**: Bridge_Input.JSON → 対話でブラッシュアップ → Bridge_Output.JSON
2. **実装**: Bridge_Output.JSON + CLAUDE.md → コード生成
3. **動作確認**: 開発者が `npm run dev` で確認
4. **修正**: 必要に応じてコード調整

## 共通UI要素
- **ヘッダー**: ホームリンク + アプリタイトル
- **フッター**: About / Privacy / Terms / Contact
- **カラー**: Tailwind CSS + ダークモード対応

## コーディングルール
- コンポーネントはページディレクトリ内にコロケーション（components/フォルダは使わない）
- クライアントコンポーネントには `"use client"` を付ける
- スタイリングはTailwind CSSクラスを優先
- ダークモード対応必須（`dark:` プレフィックスまたは `prefers-color-scheme`）
- 言語は日本語（`lang="ja"`）

## コマンド
- `npm run dev` — 開発サーバー起動
- `npx next build` — ビルド
