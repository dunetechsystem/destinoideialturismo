"use client";

import { useState } from "react";
import { CalendarDays, Loader2 } from "lucide-react";
import { useDayRules } from "@/lib/availability";
import type { CartItem } from "@/lib/cart-item";
import { todayISO, whatsappUrl } from "@/lib/format";
import { useFormat, useT } from "@/i18n/client";
import { fmt } from "@/i18n/text";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { Calendar } from "./Calendar";
import { NumberStepper } from "@/components/ui/Stepper";
import { cn } from "@/lib/cn";

export type BookingBase = Omit<CartItem, "date" | "seats" | "infants">;

/**
 * Data + quantidade de um passeio/pacote; o botão manda a escolha pro WhatsApp da agência, que confirma a vaga.
 * (Pra juntar vários passeios num orçamento só, existe o chat da Guia Carol.)
 */
export function BookingForm({ base, phone }: { base: BookingBase; phone: string }) {
  const tt = useT();
  const t = tt.booking;
  const { money, longDate, unitCount, unitLabel } = useFormat();
  const [date, setDate] = useState("");
  const [seats, setSeats] = useState(1);
  const [infants, setInfants] = useState(0);
  const rules = useDayRules({ kind: base.kind, id: base.id, trek: base.trek });
  const today = todayISO();

  const error = rules.dateError(date, seats);
  const canSave = !!date && !error && seats > 0;
  const total = base.unitPrice * seats;
  const vehicle = base.saleUnit && base.saleUnit !== "PESSOA";

  const askMessage = [
    fmt(t.waMessage.intro, { title: base.title }),
    "",
    `${t.waMessage.date} ${date ? longDate(date) : ""}`,
    `${vehicle ? t.waMessage.qty : t.waMessage.people} ${vehicle ? unitCount(base.saleUnit, seats) : seats}`,
    ...(base.allowInfants && infants > 0 ? [`${t.waMessage.kids} ${infants}`] : []),
    `${t.waMessage.total} ${money(total)}`,
  ].join("\n");

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-3xl border border-ink/10 bg-white p-4">
        {rules.loading ? (
          <div className="flex h-72 items-center justify-center text-ink/40">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <Calendar key={rules.firstOpenDate ?? "cal"} value={date} onChange={setDate} minDate={today} dayInfo={rules.dayInfo} initialMonth={rules.firstOpenDate} />
        )}
      </div>

      <div className={cn("flex items-center gap-2 rounded-2xl px-4 py-3 text-sm", error ? "bg-red-50 text-red-700" : date ? "bg-cyan-brand/10 text-cyan-brand" : "bg-paper text-ink/60")}>
        <CalendarDays size={16} className="shrink-0" />
        <span className="font-semibold">{error ?? (date ? longDate(date) : t.pickDate)}</span>
      </div>

      <div className="divide-y divide-ink/10 rounded-3xl border border-ink/10 bg-white px-4">
        <NumberStepper
          label={vehicle ? `${unitLabel(base.saleUnit, 2)[0].toUpperCase()}${unitLabel(base.saleUnit, 2).slice(1)}` : t.people}
          hint={
            vehicle
              ? base.vehicleMaxOccupancy
                ? fmt(t.upToPer, { n: base.vehicleMaxOccupancy, unit: unitLabel(base.saleUnit, 1) })
                : fmt(t.priceFor, { unit: unitLabel(base.saleUnit, 1) })
              : t.peopleHint
          }
          value={seats}
          onChange={setSeats}
          min={1}
          max={30}
        />
        {base.allowInfants && <NumberStepper label={tt.common.kids} hint={t.kidsHint} value={infants} onChange={setInfants} max={6} />}
      </div>

      <div className="flex items-end justify-between px-1">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">{tt.common.total}</p>
          <p className="text-sm text-ink/60">
            {unitCount(base.saleUnit, seats)} × {money(base.unitPrice)}
          </p>
        </div>
        <p className="font-display text-3xl text-ink">{money(total)}</p>
      </div>

      <a
        href={canSave ? whatsappUrl(phone, askMessage) : undefined}
        target="_blank"
        rel="noreferrer"
        aria-disabled={!canSave}
        className={cn(
          "flex items-center justify-center gap-3 rounded-full bg-[#25D366] py-4 text-sm font-bold text-night-900 shadow-xl shadow-[#25D366]/30 transition hover:bg-[#1ebe5b]",
          !canSave && "pointer-events-none opacity-40 shadow-none"
        )}
      >
        <WhatsAppIcon size={22} /> {t.check}
      </a>
    </div>
  );
}
