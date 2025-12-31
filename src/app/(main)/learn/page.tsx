'use client';

import { useState, useEffect } from 'react';  // useEffect を追加

export default function LearnPage() {
  const [isHovered, setIsHovered] = useState(false);

  // isHovered が true になったら、3秒後に false に戻す
  useEffect(() => {
    if (isHovered) {
      const timer = setTimeout(() => {
        setIsHovered(false);
      }, 3000);  // 3000ms = 3秒

      // クリーンアップ（コンポーネントが消えた時にタイマーを解除）
      return () => clearTimeout(timer);
    }
  }, [isHovered]);  // isHovered が変わるたびに実行

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      {/* 周りのブロック - isHovered で色が変わる */}
      <div
        className="absolute top-10 left-10 w-24 h-24"
        style={{ backgroundColor: isHovered ? 'beige' : 'gray' }}
      />
      <div
        className="absolute top-10 right-10 w-24 h-24"
        style={{ backgroundColor: isHovered ? 'beige' : 'gray' }}
      />
      <div
        className="absolute bottom-10 left-10 w-24 h-24"
        style={{ backgroundColor: isHovered ? 'beige' : 'gray' }}
      />
      <div
        className="absolute bottom-10 right-10 w-24 h-24"
        style={{ backgroundColor: isHovered ? 'beige' : 'gray' }}
      />

      {/* 中央のボタン */}
      <button className="px-6 py-3 bg-gray-900 text-white rounded-lg" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        ホバーしてね（isHovered: {isHovered ? 'true' : 'false'}）
      </button>
    </div>
  );
}