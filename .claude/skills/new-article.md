# 新しいブログ記事ページ作成

ブログ記事や解説コンテンツのページを追加するスキル。

## 手順

1. `app/blog/{記事スラッグ}/` ディレクトリを作成
   - 初回のみ `app/blog/page.tsx`（記事一覧ページ）も作成
2. 以下のファイルを作成:
   - `page.tsx` — メタデータとレイアウト（Server Component）
3. トップページまたはブログ一覧に記事リンクを追加
4. `npx next build` でビルド確認

## テンプレート

### page.tsx
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "{記事タイトル} | Mahiro App",
  description: "{記事の概要}",
};

export default function ArticlePage() {
  return (
    <article className="max-w-3xl mx-auto py-8 px-4 prose dark:prose-invert">
      <h1>{記事タイトル}</h1>
      <p className="text-sm text-gray-500">公開日：{日付}</p>

      <section>
        <h2>見出し</h2>
        <p>本文...</p>
      </section>

      {/* 運営者プロフィール（簡略版） */}
      <footer className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div>
            <p className="font-semibold">Mahiro</p>
            <p className="text-sm text-gray-500">Mahiro App 運営者</p>
          </div>
        </div>
      </footer>
    </article>
  );
}
```

## SEO チェックリスト
- [ ] titleタグに主要キーワードを含める
- [ ] descriptionを120文字以内で記述
- [ ] h1は1つだけ、h2/h3で構造化
- [ ] 記事末尾に運営者プロフィールを配置
- [ ] 内部リンク（関連アプリへのリンク）を含める

## ルール
- 記事はSEOを意識して構造化する
- 見出しタグを正しい階層で使う（h1 > h2 > h3）
- 記事の最後に運営者プロフィール（簡略版）を表示
- AdSense審査を意識し、十分なオリジナルコンテンツ量を確保（1000文字以上）
