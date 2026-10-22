"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DayInfo } from "@/lib/availability";
import { parseISODate, toISODate } from "@/lib/format";
import { useFormat, useT } from "@/i18n/client";
import { cn } from "@/lib/cn";

interface Props {
  value: string;
  onChange: (date: string) => void;
  minDate: string;
  dayInfo: (date: string) => DayInfo | undefined;
  /** Mês aberto de início quando não há data escolhida. */
  initialMonth?: string;
}

/** Calendário do mês com a situação de cada dia: fechado/lotado riscado, poucas vagas em dourado. */
export function Calendar({ value, onChange, minDate, dayInfo, initialMonth }: Props) {
  const t = useT().booking;
  const f = useFormat();
  const WEEKDAYS = f.weekdaysNarrow();
  const start = parseISODate(value || initialMonth || minDate);
  const [month, setMonth] = useState(() => new Date(start.getFullYear(), start.getMonth(), 1));
  const minMonth = useMemo(() => {
    const d = parseISODate(minDate);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }, [minDate]);

  const cells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const list: (string | null)[] = Array(first.getDay()).fill(null);
    for (let d = 1; d <= days; d++) list.push(toISODate(new Date(month.getFullYear(), month.getMonth(), d)));
    return list;
  }, [month]);

  const canPrev = month > minMonth;
  const label = f.monthYear(month);

  return (
    <div className="select-none">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          disabled={!canPrev}
          aria-label={t.prevMonth}
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition hover:bg-white disabled:opacity-25"
        >
          <ChevronLeft size={18} />
        </button>
        <p className="font-display text-lg capitalize text-ink">{label}</p>
        <button
          type="button"
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          aria-label={t.nextMonth}
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition hover:bg-white"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w, i) => (
          <span key={i} className="pb-1 text-[11px] font-bold uppercase text-ink/40">
            {w}
          </span>
        ))}
        {cells.map((date, i) => {
          if (!date) return <span key={`e${i}`} />;
          const info = dayInfo(date);
          const past = date < minDate;
          const blocked = past || info?.status === "closed" || info?.status === "full";
          const selected = date === value;
          const few = info?.status === "open" && info.left != null && info.left <= 5;
          return (
            <button
              key={date}
              type="button"
              disabled={blocked}
              onClick={() => onChange(date)}
              title={info?.status === "full" ? t.full : info?.status === "closed" && !past ? t.unavailable : undefined}
              className={cn(
                "relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm font-semibold transition",
                selected
                  ? "bg-gold-500 text-night-900 shadow-lg shadow-white/30"
                  : blocked
                    ? "cursor-not-allowed text-ink/20"
                    : "text-ink hover:bg-white hover:text-cyan-brand",
                !past && (info?.status === "full" || info?.status === "closed") && "line-through decoration-gold-500/50"
              )}
            >
              {parseISODate(date).getDate()}
              {few && !selected && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-amber-500" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
