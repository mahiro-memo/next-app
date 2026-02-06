import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ | Mahiro App",
  description: "Mahiro Appへのお問い合わせ",
};

export default function Contact() {
  return (
    <article className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">お問い合わせ</h1>

      <section className="mb-8">
        <p className="mb-4 leading-relaxed">
          Mahiro App
          に関するお問い合わせは、以下のフォームよりお願いいたします。内容を確認の上、折り返しご連絡いたします。
        </p>
      </section>

      <form className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-1"
          >
            お名前 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-1"
          >
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium mb-1"
          >
            件名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium mb-1"
          >
            お問い合わせ内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          送信する
        </button>
      </form>

      <section className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">お問い合わせについて</h2>
        <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
          <li>お問い合わせへの返信には数日お時間をいただく場合があります。</li>
          <li>内容によっては返信いたしかねる場合がありますのでご了承ください。</li>
          <li>
            お預かりした個人情報は、お問い合わせ対応の目的のみに使用いたします。
          </li>
        </ul>
      </section>
    </article>
  );
}
