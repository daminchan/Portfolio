'use client';

type NoiseOverlayProps = {
  opacity?: number;
};

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

export function NoiseOverlay({ opacity = 0.04 }: NoiseOverlayProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 animate-noise-flicker"
      style={{
        backgroundImage: NOISE_SVG,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px',
        ['--noise-opacity' as string]: opacity,
        opacity,
      }}
      aria-hidden="true"
    />
  );
}
