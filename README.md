# Mahiro App

日常生活で役立つ便利なWebアプリケーション集。

## 概要

Mahiro Appは、乱数生成、割り勘計算など、日常で使える実用的なツールを提供するWebアプリケーションです。各アプリには詳細な解説記事が付属しており、ツールの使い方や背景知識を学ぶことができます。

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4
- **React**: v19
- **Markdown**: react-markdown

## 機能

### 既存アプリ
- **乱数生成ツール** (`/random`) - カスタマイズ可能な乱数生成
- **割り勘計算ツール** (`/warikan`) - グループでの支払い分割計算

### 今後の追加予定
- 各種計算ツール
- 日常生活で役立つユーティリティ

## セットアップ

### 必要要件
- Node.js 18.x 以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>

# 依存関係をインストール
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### ビルド

```bash
npm run build
```

## プロジェクト構成

```
app/
├── layout.tsx          # ルートレイアウト
├── page.tsx            # トップページ
├── random/             # 乱数生成アプリ
├── warikan/            # 割り勘計算アプリ
│   ├── page.tsx
│   ├── Tool.tsx        # メインUI
│   └── Article.tsx     # 解説記事
├── about/              # 運営者情報
├── privacy/            # プライバシーポリシー
├── terms/              # 利用規約
└── contact/            # お問い合わせ
```

## 開発ガイド

### 新規アプリの追加

新規アプリを追加する場合は、以下のドキュメントを参照してください:

- **CLAUDE.md** - プロジェクト概要と開発フロー
- **TEMPLATE.md** - 実装テンプレートと詳細ガイドライン

### コーディング規約

- TypeScript を使用し、型定義を明示
- Tailwind CSS でスタイリング
- ダークモード対応必須
- アクセシビリティを考慮

## デプロイ

Vercel での簡単デプロイに対応しています。

```bash
# Vercel CLI でデプロイ
npm install -g vercel
vercel
```

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## お問い合わせ

- ウェブサイト: [サイトURL]
- お問い合わせフォーム: `/contact`

---

Built with [Next.js](https://nextjs.org) and ❤️