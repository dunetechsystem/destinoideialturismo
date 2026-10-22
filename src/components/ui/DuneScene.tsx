import { cn } from "@/lib/cn";

/**
 * Pôr do sol nas dunas em SVG — o fundo de marca quando um passeio ainda não tem foto
 * (e a base do hero, por baixo do slideshow). Sol listrado, como um pôr do sol sobre as lagoas.
 */
export function DuneScene({ className, sun = true, id = "a" }: { className?: string; sun?: boolean; id?: string }) {
  // Posição do sol varia por id, pra cards sem foto não ficarem todos iguais.
  const seed = [...id].reduce((n, c) => n + c.charCodeAt(0), 0);
  const cx = 330 + ((seed * 37) % 140);
  const dx = cx - 400;
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className={cn("absolute inset-0 h-full w-full", className)} aria-hidden>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#07142b" />
          <stop offset=".45" stopColor="#16427a" />
          <stop offset=".72" stopColor="#e8a33a" />
          <stop offset="1" stopColor="#ffe69a" />
        </linearGradient>
        <linearGradient id={`d1-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b3d4a" />
          <stop offset="1" stopColor="#07142b" />
        </linearGradient>
        <clipPath id={`sunclip-${id}`}>
          <circle cx={cx} cy="330" r="120" />
        </clipPath>
      </defs>
      <rect width="800" height="600" fill={`url(#sky-${id})`} />
      {sun && (
        <g clipPath={`url(#sunclip-${id})`}>
          <rect x={270 + dx} y="205" width="260" height="250" fill="#fff1c2" />
          {[245, 275, 300, 322, 342, 360].map((y, i) => (
            <rect key={y} x={270 + dx} y={y} width="260" height={2 + i * 1.6} fill={`url(#sky-${id})`} />
          ))}
        </g>
      )}
      <path d="M0 380c90-22 170-30 260-14s150 34 240 20 200-44 300-24v238H0z" fill="#2a6f8a" opacity=".75" />
      <path d="M0 440c110-40 190-34 290-8s190 36 290 6 160-26 220-8v176H0z" fill="#17506a" />
      <path d="M0 510c130-32 230-18 330 6s210 24 470-14v98H0z" fill={`url(#d1-${id})`} />
    </svg>
  );
}
