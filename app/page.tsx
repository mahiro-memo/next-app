// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <section className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Mahiro App</h1>
        <p className="text-lg leading-relaxed">
          日常生活で役立つ便利なWebアプリを提供しています。
          <br />
          シンプルで使いやすいツールをぜひお試しください。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">アプリ一覧</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/random"
            className="block p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <h3 className="text-lg font-semibold mb-2">乱数作成アプリ</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              指定した人数にランダムな番号を割り当てます。席替えや順番決めに便利です。
            </p>
          </Link>
          <Link
            href="/warikan"
            className="block p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <h3 className="text-lg font-semibold mb-2">適当割り勘くん</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              飲み会やイベントの会計をざっくり分配。端数処理も自動で行います。
            </p>
          </Link>
          <Link
            href="/tennis"
            className="block p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <h3 className="text-lg font-semibold mb-2">テニス乱数表</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              テニスの試合組み合わせを自動生成。ペナルティスコアで最適な組み合わせを選びます。
            </p>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Mahiro App について</h2>
        <p className="leading-relaxed mb-4">
          Mahiro App
          は、誰でも無料で使える便利なWebツール集です。面倒な計算やランダムな割り当てを、スマホやPCからすぐに利用できます。
        </p>
        <p className="leading-relaxed">
          新しいアプリも随時追加予定です。ご要望がありましたら
          <Link
            href="/contact"
            className="text-blue-600 dark:text-blue-400 underline"
          >
            お問い合わせ
          </Link>
          よりお気軽にご連絡ください。
        </p>
      </section>
    </div>
  );
}
