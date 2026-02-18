'use client';

type ScanlineOverlayProps = {
  opacity?: number;
  speed?: string;
};

export function ScanlineOverlay({
  opacity = 0.06,
  speed = '8s',
}: ScanlineOverlayProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 animate-scanline-scroll"
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        backgroundSize: '100% 4px',
        opacity,
        ['--scanline-speed' as string]: speed,
      }}
      aria-hidden="true"
    />
  );
}
