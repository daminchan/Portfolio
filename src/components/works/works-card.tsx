/**
 * WorksCard - Stream Deck風カード
 *
 * アイコンが切り替わる単一カード。
 * Stream Deckボタンのような光沢感のある質感。
 */
'use client';

import { useState, useRef, useCallback } from 'react';

// アイコンデータ
export interface WorkItem {
  id: string;
  icon: 'youtube' | 'github' | 'code';
  label: string;
  href: string;
}

interface WorksCardProps {
  item: WorkItem;
  onClick: () => void;
}

// SVGアイコン
function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-20 h-20" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-20 h-20" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-20 h-20" fill="currentColor">
      <path d="M8.293 6.293L2.586 12l5.707 5.707 1.414-1.414L5.414 12l4.293-4.293-1.414-1.414zm7.414 0l-1.414 1.414L18.586 12l-4.293 4.293 1.414 1.414L21.414 12l-5.707-5.707z" />
    </svg>
  );
}

function getIcon(type: WorkItem['icon']) {
  switch (type) {
    case 'youtube':
      return <YouTubeIcon />;
    case 'github':
      return <GitHubIcon />;
    case 'code':
      return <CodeIcon />;
  }
}

export function WorksCard({ item, onClick }: WorksCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // マウス追従回転
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    setRotateY(((e.clientX - centerX) / (rect.width / 2)) * 15);
    setRotateX(-((e.clientY - centerY) / (rect.height / 2)) * 15);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
    setIsPressed(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseDown = useCallback(() => {
    setIsPressed(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  return (
    <div className="animate-float">
      <div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="cursor-pointer"
        style={{
          transform: `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(${isPressed ? 0.95 : isHovered ? 1.02 : 1})
          `,
          transition: 'transform 0.15s ease-out',
        }}
      >
        {/* カード本体 - サイトコンセプトに合わせた薄いグレー */}
        <div
          className="relative h-[400px] w-[300px] overflow-hidden rounded-2xl border border-gray-200"
          style={{
            background: `
              linear-gradient(135deg,
                rgba(250, 248, 245, 1) 0%,
                rgba(240, 237, 232, 1) 50%,
                rgba(235, 232, 227, 1) 100%
              )
            `,
            boxShadow: isHovered
              ? `
                0 25px 50px -12px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 rgba(255,255,255,0.8)
              `
              : `
                0 10px 30px -10px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255,255,255,0.6)
              `,
            transition: 'box-shadow 0.3s ease-out',
          }}
        >
          {/* 光沢オーバーレイ */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                linear-gradient(
                  135deg,
                  rgba(255,255,255,0.6) 0%,
                  rgba(255,255,255,0.2) 40%,
                  transparent 60%
                )
              `,
            }}
          />

          {/* アイコンエリア */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="text-gray-600 transition-all duration-300"
              style={{
                filter: isHovered ? 'drop-shadow(0 0 15px rgba(100,100,100,0.3))' : 'none',
                transform: isPressed ? 'scale(0.9)' : 'scale(1)',
              }}
            >
              {getIcon(item.icon)}
            </div>
          </div>

          {/* ラベル */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="border-t border-gray-300 pt-4">
              <h3 className="text-xl font-medium tracking-wider text-gray-700">
                {item.label}
              </h3>
            </div>
          </div>

          {/* プレスエフェクト */}
          {isPressed && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'rgba(0,0,0,0.05)',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
