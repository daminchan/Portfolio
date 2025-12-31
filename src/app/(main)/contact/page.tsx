/**
 * Contact - お問い合わせページ
 *
 * ピクセルトランジション実験用ページ
 */
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 text-center space-y-8">
        <div className="space-y-4">
          <p className="text-xs tracking-[0.5em] text-gray-400 uppercase">
            Test Page
          </p>
          <h1 className="text-5xl font-extralight tracking-[0.3em] text-gray-800">
            CONTACT
          </h1>
          <p className="text-sm text-gray-500">
            お問い合わせページ（ピクセルトランジション実験）
          </p>
        </div>

        <div className="w-16 h-px bg-gray-300 mx-auto" />

        <Link
          href="/"
          className="inline-block mt-8 px-6 py-3 border border-gray-300 text-sm tracking-widest text-gray-600 hover:bg-gray-50 transition-colors"
        >
          ← TOP に戻る
        </Link>
      </div>
    </div>
  );
}
