export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden bg-ink py-4">
      <div className="flex w-max animate-marquee gap-8 hover:[animation-play-state:paused]">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap font-display text-xl text-white/90 sm:text-2xl">
            {item}
            <span className="h-2 w-2 rotate-45 bg-gold-500" />
          </span>
        ))}
      </div>
    </div>
  );
}
