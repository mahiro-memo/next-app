import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "運営者情報 | Mahiro App",
  description: "Mahiro Appの運営者情報について",
};

export default function About() {
  return (
    <article className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">運営者情報</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">サイトについて</h2>
        <p className="mb-4 leading-relaxed">
          Mahiro App
          は、日常生活で役立つ便利なWebアプリケーションを提供するサイトです。シンプルで使いやすいツールを通じて、皆さまのお役に立てることを目指しています。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">提供中のアプリ</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            <Link
              href="/random"
              className="text-blue-600 dark:text-blue-400 underline"
            >
              乱数作成アプリ
            </Link>
            ：ランダムな番号割り当てを簡単に行えるツール
          </li>
          <li>
            <Link
              href="/warikan"
              className="text-blue-600 dark:text-blue-400 underline"
            >
              割り勘アプリ
            </Link>
            ：飲み会やイベントの会計を簡単に分配できるツール
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">運営者</h2>
        <dl className="space-y-3">
          <div className="flex gap-4">
            <dt className="font-medium min-w-[120px]">サイト名</dt>
            <dd>Mahiro App</dd>
          </div>
          <div className="flex gap-4">
            <dt className="font-medium min-w-[120px]">運営者</dt>
            <dd>Mahiro</dd>
          </div>
          <div className="flex gap-4">
            <dt className="font-medium min-w-[120px]">お問い合わせ</dt>
            <dd>
              <Link
                href="/contact"
                className="text-blue-600 dark:text-blue-400 underline"
              >
                お問い合わせフォーム
              </Link>
            </dd>
          </div>
        </dl>
      </section>
    </article>
  );
}
