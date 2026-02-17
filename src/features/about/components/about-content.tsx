/**
 * AboutContent - LyricMotion デモ
 */
'use client';

import { useState, useEffect } from 'react';

import { AnimatePresence } from 'framer-motion';

import { LyricMotion } from '@/components/lyric-motion';

import { TIMELINE } from '../constants';

export function AboutContent() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % TIMELINE.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  const current = TIMELINE[index];

  return (
    <div className="w-full h-screen bg-black overflow-hidden flex flex-col relative font-sans">
      {/* 背景グリッド */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20" />
        <div className="absolute left-1/2 top-0 w-[1px] h-full bg-white/20" />
      </div>

      {/* メインコンテンツ */}
      <div
        className="relative z-10 w-full h-full flex justify-center items-center"
        style={{ perspective: '2000px' }}
      >
        <AnimatePresence mode="wait">
          <LyricMotion
            key={current.id}
            effects={current.effects}
            stagger={current.stagger}
            size={current.size}
            rgbSplit={true}
          >
            {current.text}
          </LyricMotion>
        </AnimatePresence>
      </div>

      {/* UI装飾 */}
      <div className="fixed top-8 left-8 flex flex-col gap-1 z-50 font-mono text-[10px] tracking-widest text-white/40">
        <div className="text-white bg-white/10 px-2 py-1 border border-white/20">
          EFFECTS: {current.effects.map((l) => l.effect).join(' + ')}
        </div>
        <div>STAGGER: {current.stagger}s</div>
      </div>

      <div className="fixed bottom-8 right-8 font-mono text-white/20 z-50 flex items-end gap-4">
        <div className="text-[8px] leading-tight text-right">
          LYRIC_MOTION<br />COMPONENT_V01
        </div>
        <div className="text-6xl font-black italic tracking-tighter text-white opacity-10">
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Noto+Sans+JP:wght@900&display=swap');
        body {
          font-family: 'Archivo Black', 'Noto Sans JP', sans-serif;
          background-color: black;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
