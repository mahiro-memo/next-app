import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | Mahiro App",
  description: "Mahiro Appのプライバシーポリシーについて",
};

export default function PrivacyPolicy() {
  return (
    <article className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">プライバシーポリシー</h1>
      <p className="text-sm text-gray-500 mb-8">最終更新日：2026年2月7日</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">はじめに</h2>
        <p className="mb-4 leading-relaxed">
          Mahiro App（以下「当サイト」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めています。本プライバシーポリシーでは、当サイトにおける個人情報の取り扱いについて説明します。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">収集する情報</h2>
        <p className="mb-4 leading-relaxed">
          当サイトでは、以下の情報を収集する場合があります。
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            アクセス解析に関する情報（IPアドレス、ブラウザの種類、閲覧ページ、アクセス日時など）
          </li>
          <li>お問い合わせフォームからご提供いただく情報（お名前、メールアドレスなど）</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          Google AdSense について
        </h2>
        <p className="mb-4 leading-relaxed">
          当サイトでは、Google AdSense による広告配信を行っております。Google
          AdSense では、ユーザーの興味に応じた広告を表示するために Cookie
          を使用することがあります。
        </p>
        <p className="mb-4 leading-relaxed">
          Google による Cookie
          の使用については、
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 underline"
          >
            Google のポリシーと規約
          </a>
          をご確認ください。
        </p>
        <p className="mb-4 leading-relaxed">
          ユーザーは、Google
          の広告設定ページからパーソナライズ広告を無効にすることができます。また、
          <a
            href="https://www.aboutads.info/choices/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 underline"
          >
            aboutads.info
          </a>
          にアクセスすることで、第三者配信事業者による Cookie
          の使用を無効にすることができます。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          Google Analytics について
        </h2>
        <p className="mb-4 leading-relaxed">
          当サイトでは、アクセス解析のために Google Analytics
          を使用する場合があります。Google Analytics は Cookie
          を使用してデータを収集しますが、個人を特定する情報は含まれません。Google
          Analytics の利用規約については、
          <a
            href="https://marketingplatform.google.com/about/analytics/terms/jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 underline"
          >
            こちら
          </a>
          をご確認ください。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">情報の利用目的</h2>
        <p className="mb-4 leading-relaxed">
          収集した情報は、以下の目的で利用します。
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>サイトの運営および改善</li>
          <li>ユーザーからのお問い合わせへの対応</li>
          <li>アクセス解析によるコンテンツの品質向上</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">第三者への情報提供</h2>
        <p className="mb-4 leading-relaxed">
          当サイトでは、法令に基づく場合を除き、ユーザーの個人情報を第三者に提供することはありません。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">免責事項</h2>
        <p className="mb-4 leading-relaxed">
          当サイトに掲載されている情報の正確性には万全を期しておりますが、その内容について保証するものではありません。当サイトの利用によって生じた損害について、一切の責任を負いかねます。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          プライバシーポリシーの変更
        </h2>
        <p className="mb-4 leading-relaxed">
          当サイトは、必要に応じて本プライバシーポリシーを変更することがあります。変更後のプライバシーポリシーは、当ページに掲載した時点で効力を生じるものとします。
        </p>
      </section>
    </article>
  );
}
