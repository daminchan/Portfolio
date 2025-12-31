/**
 * About - 自己紹介ページ（テスト段階）
 */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

// 雪の粒を生成
function generateSnowflakes(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 5 + Math.random() * 5,
    size: 2 + Math.random() * 4,
    opacity: 0.4 + Math.random() * 0.6,
  }));
}

export default function AboutPage() {
  const [snowflakes, setSnowflakes] = useState<ReturnType<typeof generateSnowflakes>>([]);
  const [blink, setBlink] = useState(1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // クライアント側でのみ雪を生成（Hydrationエラー回避）
  useEffect(() => {
    setSnowflakes(generateSnowflakes(50));
  }, []);

  // 発光エフェクト（チカチカ）
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(Math.random() > 0.5 ? 1 : 0);
    }, 300);
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        opacity: isImageLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-out',
      }}
    >
      {/* Layer 1: 白とオレンジで点滅 */}
      <div
        className="absolute inset-0"
        style={{
          background: blink === 1 ? '#ffffff' : '#ffe0b0',
        }}
      />

      {/* Layer 2: 窓切り抜き画像 */}
      <div
        className="absolute pointer-events-none"
        style={{ inset: '-20px' }}
      >
        <Image
          src="/about_card.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          onLoad={() => setIsImageLoaded(true)}
        />
      </div>

      {/* Layer 3: 雪（画像の上） */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${flake.left}%`,
              top: '-10px',
              width: `${flake.size}px`,
              height: `${flake.size}px`,
              opacity: flake.opacity,
              animation: `snowfall ${flake.duration}s linear ${flake.delay}s infinite`,
            }}
          />
        ))}
        <style jsx>{`
          @keyframes snowfall {
            0% {
              transform: translateY(0) translateX(0);
            }
            100% {
              transform: translateY(100vh) translateX(20px);
            }
          }
        `}</style>
      </div>

      {/* コンテンツ */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <p className="text-xs tracking-[0.5em] text-orange-300/60 uppercase">
              Test Page
            </p>
            <h1 className="text-5xl font-extralight tracking-[0.3em] text-white drop-shadow-[0_0_10px_rgba(255,150,50,0.5)]">
              ABOUT
            </h1>
            <p className="text-sm text-orange-100/50">
              発光背景テスト
            </p>
          </div>

          <div className="w-16 h-px bg-orange-400/30 mx-auto" />

          <Link
            href="/"
            className="inline-block mt-8 px-6 py-3 border border-orange-400/30 text-sm tracking-widest text-orange-200/70 hover:bg-orange-400/10 hover:border-orange-400/50 transition-colors"
          >
            ← TOP に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
