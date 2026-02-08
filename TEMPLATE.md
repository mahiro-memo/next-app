# 標準テンプレート（詳細版）

このファイルは新規アプリ実装時の完全なテンプレートとガイドラインです。

---

## 1. ディレクトリ構成

```
app/
└── [app-name]/
    ├── page.tsx        # Server Component（エントリーポイント）
    ├── Tool.tsx        # Client Component（メイン機能）
    └── Article.tsx     # Client Component（解説記事、任意）
```

---

## 2. ファイルテンプレート

### 2.1 page.tsx（Server Component）

```typescript
import Tool from './Tool';
import Article from './Article';

export const metadata = {
  title: '[アプリ名] | Mahiro App',
  description: '[SEO最適化された説明文（120-160文字程度）]',
};

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        [アプリ名]
      </h1>
      <Tool />
      <Article />
    </div>
  );
}
```

**ポイント**:
- metadata は必須（SEO対策）
- container + max-w-4xl でレスポンシブ対応
- h1 にダークモード対応クラス

---

### 2.2 Tool.tsx（Client Component）

```typescript
'use client';

import { useState } from 'react';

export default function Tool() {
  // ステート管理
  const [inputValue, setInputValue] = useState<number>(0);
  const [result, setResult] = useState<number | null>(null);

  // 計算ロジック
  const handleCalculate = () => {
    // バリデーション
    if (inputValue <= 0) {
      alert('正の数値を入力してください');
      return;
    }

    // 計算処理
    const calculated = inputValue * 2; // 実際のロジックに置き換え
    setResult(calculated);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        [ツール名]
      </h2>
      
      {/* 入力フォーム */}
      <div className="space-y-4 mb-6">
        <div>
          <label
            htmlFor="input1"
            className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
          >
            入力項目
          </label>
          <input
            id="input1"
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(Number(e.target.value))}
            placeholder="例: 100"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* 実行ボタン */}
      <button
        onClick={handleCalculate}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        計算する
      </button>

      {/* 結果表示 */}
      {result !== null && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
            計算結果
          </h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {result}
          </p>
        </div>
      )}
    </div>
  );
}
```

**ポイント**:
- `'use client'` 必須
- TypeScript型定義（`useState<number>`）
- バリデーション実装
- label + htmlFor でアクセシビリティ対応
- ダークモード対応（全要素に `dark:` クラス）

---

### 2.3 Article.tsx（Client Component）

```typescript
'use client';

import ReactMarkdown from 'react-markdown';

const articleContent = `
# [アプリ名]とは？

[アプリの概要説明をここに記述]

## 使い方

1. **ステップ1**: 入力項目に値を入力します
2. **ステップ2**: 「計算する」ボタンをクリックします
3. **ステップ3**: 結果が表示されます

## 計算方法

[計算ロジックの詳細説明]

\`\`\`
例: 100 × 2 = 200
\`\`\`

## よくある質問

### Q1: [質問内容]
A: [回答内容]

### Q2: [質問内容]
A: [回答内容]

## まとめ

[アプリの利点や使いどころをまとめる]
`;

export default function Article() {
  return (
    <article className="prose prose-lg dark:prose-invert max-w-none mt-8">
      <ReactMarkdown>{articleContent}</ReactMarkdown>
    </article>
  );
}
```

**ポイント**:
- `'use client'` 必須
- `react-markdown` を使用
- `prose` クラスで読みやすいタイポグラフィ
- `dark:prose-invert` でダークモード対応
- Markdown内でコードブロック・リストが使える

---

## 3. Bridge JSON 仕様

### 3.1 Bridge_Input.JSON（copilotで作成）

```json
{
  "appName": "sample-app",
  "displayName": "サンプル計算アプリ",
  "description": "簡単な説明（1-2文）",
  "category": "計算ツール",
  "features": [
    "機能1の説明",
    "機能2の説明"
  ],
  "inputs": [
    {
      "name": "入力項目1",
      "type": "number",
      "required": true,
      "hint": "例: 100"
    }
  ],
  "outputs": [
    {
      "name": "結果",
      "format": "数値"
    }
  ],
  "notes": "その他の補足情報"
}
```

---

### 3.2 Bridge_Output.JSON（Claude(プロジェクト)で生成）

```json
{
  "appName": "sample-app",
  "displayName": "サンプル計算アプリ",
  "route": "/sample-app",
  "metadata": {
    "title": "サンプル計算アプリ | Mahiro App",
    "description": "SEO最適化された詳細な説明文。120-160文字程度。キーワードを含める。"
  },
  "tool": {
    "title": "計算ツール",
    "states": [
      {
        "name": "inputValue",
        "type": "number",
        "initial": 0,
        "description": "入力値"
      },
      {
        "name": "result",
        "type": "number | null",
        "initial": null,
        "description": "計算結果"
      }
    ],
    "inputs": [
      {
        "id": "input1",
        "label": "入力項目",
        "type": "number",
        "placeholder": "例: 100",
        "validation": {
          "min": 0,
          "required": true,
          "errorMessage": "正の数値を入力してください"
        }
      }
    ],
    "calculation": {
      "description": "計算処理の詳細説明",
      "formula": "result = inputValue * 2",
      "steps": [
        "入力値を取得",
        "バリデーションチェック",
        "計算実行",
        "結果を表示"
      ]
    },
    "outputs": [
      {
        "id": "result",
        "label": "計算結果",
        "format": "{{value}}",
        "condition": "result !== null",
        "style": "highlighted"
      }
    ]
  },
  "article": {
    "sections": [
      {
        "title": "[アプリ名]とは？",
        "content": "アプリの概要説明"
      },
      {
        "title": "使い方",
        "content": "1. ステップ1\n2. ステップ2"
      },
      {
        "title": "計算方法",
        "content": "計算ロジックの詳細"
      },
      {
        "title": "よくある質問",
        "content": "### Q1: 質問\nA: 回答"
      },
      {
        "title": "まとめ",
        "content": "アプリの利点"
      }
    ],
    "keywords": ["キーワード1", "キーワード2", "キーワード3"]
  }
}
```

---

## 4. 共通UIコンポーネント

### 4.1 ボタンスタイル

#### プライマリボタン
```typescript
className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
```

#### セカンダリボタン
```typescript
className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors"
```

#### 危険ボタン
```typescript
className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
```

---

### 4.2 入力フィールド

#### テキスト/数値入力
```typescript
className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
```

#### セレクトボックス
```typescript
className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
```

#### ラベル
```typescript
className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
```

---

### 4.3 カードコンテナ

#### 基本カード
```typescript
className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
```

#### 結果表示カード（ハイライト）
```typescript
className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg"
```

#### 警告カード
```typescript
className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
```

---

### 4.4 テキストスタイル

#### 見出し（h2）
```typescript
className="text-xl font-semibold mb-4 text-gray-900 dark:text-white"
```

#### 見出し（h3）
```typescript
className="text-lg font-semibold mb-2 text-gray-900 dark:text-white"
```

#### 本文
```typescript
className="text-gray-700 dark:text-gray-300"
```

#### 強調テキスト
```typescript
className="text-2xl font-bold text-blue-600 dark:text-blue-400"
```

---

## 5. 実装チェックリスト

新規アプリ実装時の確認項目:

### ファイル構成
- [ ] `page.tsx` 作成済み
- [ ] `Tool.tsx` 作成済み
- [ ] `Article.tsx` 作成済み（任意）

### page.tsx
- [ ] metadata 設定済み（title, description）
- [ ] Server Component（"use client" なし）
- [ ] Tool と Article をインポート

### Tool.tsx
- [ ] `"use client"` 宣言あり
- [ ] TypeScript型定義済み
- [ ] useState でステート管理
- [ ] 入力バリデーション実装
- [ ] ダークモード対応（全要素に `dark:` クラス）
- [ ] アクセシビリティ対応（label + htmlFor）
- [ ] レスポンシブデザイン

### Article.tsx
- [ ] `"use client"` 宣言あり
- [ ] react-markdown 使用
- [ ] `prose dark:prose-invert` クラス適用
- [ ] Markdown内容が充実（SEO対策）

### 共通要素
- [ ] カラースキーム統一（blue-600系）
- [ ] ボタン・入力フィールドが共通スタイル
- [ ] 全テキストにダークモード対応
- [ ] エラーハンドリング実装

---

## 6. コーディング規約

### TypeScript
- 型定義は明示的に（`any` 禁止）
- インターフェースまたは型エイリアスを活用
- 関数の引数・戻り値に型を指定

### React
- 関数コンポーネントを使用
- useState/useEffect 等のフックを適切に使用
- 不要な再レンダリングを避ける

### Tailwind CSS
- クラス名は読みやすく整理
- 長いクラス名は改行して記述
- カスタムCSSは極力避ける

### アクセシビリティ
- フォーム要素に `label` + `htmlFor` を設定
- ボタンに適切な `aria-label` を設定（必要に応じて）
- キーボード操作を考慮

---

## 7. よくある実装パターン

### 数値入力のバリデーション
```typescript
const handleCalculate = () => {
  if (inputValue <= 0) {
    alert('正の数値を入力してください');
    return;
  }
  // 処理続行
};
```

### 複数入力フィールド
```typescript
const [formData, setFormData] = useState({
  field1: 0,
  field2: '',
  field3: false,
});

const handleChange = (field: string, value: any) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};
```

### 条件付き結果表示
```typescript
{result !== null && result > 0 && (
  <div className="mt-6 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
    <p>結果: {result}</p>
  </div>
)}
```

### エラー表示
```typescript
const [error, setError] = useState<string | null>(null);

// エラー設定
setError('エラーメッセージ');

// 表示
{error && (
  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
    {error}
  </div>
)}
```

---

## 8. SEO対策のポイント

### metadata最適化
- title: 30文字以内、キーワード含む
- description: 120-160文字、魅力的な説明

### 記事内容
- h1, h2, h3 を適切に使用
- キーワードを自然に含める
- 1000文字以上のボリューム
- リスト・コードブロックで可読性向上

### 内部リンク
- 関連アプリへのリンク（将来実装）
- トップページへのリンク

---

## 9. 実装フロー（再確認）

1. **Bridge_Output.JSON を確認**
2. **TEMPLATE.md を参照**（このファイル）
3. **page.tsx 作成** → metadata設定
4. **Tool.tsx 作成** → ロジック実装
5. **Article.tsx 作成** → 記事執筆
6. **動作確認** → 開発者が `npm run dev`
7. **修正** → 必要に応じて調整
8. **完了** → merge

---

以上が標準テンプレートの詳細版です。実装時はこのファイルを参照してください。