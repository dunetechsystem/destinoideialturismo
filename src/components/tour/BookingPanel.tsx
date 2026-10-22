"use client";

import { ShieldCheck } from "lucide-react";
import { BookingForm, type BookingBase } from "@/components/checkout/BookingForm";
import { useFormat, useT } from "@/i18n/client";

/** Caixa de reserva da página do passeio: lateral fixa no computador, seção #reservar no celular + barra no rodapé. */
export function BookingPanel({ base, phone }: { base: BookingBase; phone: string }) {
  const t = useT().booking;
  const { money, perUnit } = useFormat();
  const discounted = base.unitPrice < base.fullPrice;
  return (
    <>
      <div id="reservar" className="scroll-mt-24 rounded-[2rem] bg-white p-5 shadow-[0_30px_60px_-36px_rgba(12,35,64,0.45)] ring-1 ring-ink/10 sm:p-6">
        <div className="mb-5 flex items-end justify-between">
          <div>
            {discounted && <p className="text-sm text-ink/40 line-through">{money(base.fullPrice)}</p>}
            <p className="font-display text-4xl text-ink">{money(base.unitPrice)}</p>
            <p className="text-sm text-ink/50">{perUnit(base.saleUnit)}</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-cyan-brand/10 px-3 py-1.5 text-xs font-bold text-cyan-brand">
            <ShieldCheck size={14} /> {t.noPayNow}
          </span>
        </div>
        <BookingForm base={base} phone={phone} />
        <p className="mt-3 text-center text-xs text-ink/50">{t.askNote}</p>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-ink/10 bg-paper/90 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div>
          <p className="text-lg font-extrabold leading-tight text-ink">{money(base.unitPrice)}</p>
          <p className="text-xs text-ink/50">{perUnit(base.saleUnit)}</p>
        </div>
        <a href="#reservar" className="mr-20 rounded-full bg-gold-500 px-6 py-3 text-sm font-bold text-night-900 shadow-lg shadow-gold-500/30">
          {t.chooseDate}
        </a>
      </div>
    </>
  );
}
