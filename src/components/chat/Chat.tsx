"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Check, Clock, Compass, Copy, Home, Minus, Phone, Plus, Send, ShoppingBag, Trash2, X } from "lucide-react";
import { useFormat, useLang, useT } from "@/i18n/client";
import { fmt, strong } from "@/i18n/text";
import type { AgencyInfo } from "@/lib/agency-info";
import { site } from "@/config/site";
import { todayISO, whatsappUrl } from "@/lib/format";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { cn } from "@/lib/cn";
import { useBudget, useBudgetReady, type BudgetItem } from "./budget";
import { lineTotal, unitsFor, type ChatOption, type ChatTour } from "./chat-tours";

type Tab = "home" | "tours" | "budget" | "contact";
type Msg = { from: "carol" | "me"; text: string; chips?: "main" | "faq" | "transfer" };

const BUBBLE_KEY = "di-chat-bubble";

function Avatar({ size = 36, online = false, className }: { size?: number; online?: boolean; className?: string }) {
  return (
    <span className={cn("relative inline-block shrink-0", className)} style={{ width: size, height: size }}>
      <Image src="/brand/carol.jpg" alt="" width={size * 2} height={size * 2} className="h-full w-full rounded-full object-cover ring-2 ring-white" />
      {online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#25D366] ring-2 ring-white" />}
    </span>
  );
}

function CarolBubble({ children, time }: { children: React.ReactNode; time?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2">
      <Avatar size={30} />
      <div className="max-w-[82%] rounded-2xl rounded-bl-md bg-white px-4 py-3 text-[14px] leading-relaxed text-ink shadow-sm ring-1 ring-ink/10">
        <div className="whitespace-pre-line">{children}</div>
        {time && <p className="mt-1 text-[11px] text-ink/40">{time}</p>}
      </div>
    </motion.div>
  );
}

function MeBubble({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-ink px-4 py-3 text-[14px] text-white">
      {children}
    </motion.div>
  );
}

function Typing() {
  return (
    <div className="flex items-end gap-2" aria-hidden>
      <Avatar size={30} />
      <div className="flex gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3.5 shadow-sm ring-1 ring-ink/10">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );
}

function Chip({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="min-h-10 rounded-full border border-gold-500 bg-white px-4 py-2 text-left text-[13px] font-semibold text-ink transition hover:bg-gold-500 active:scale-95">
      {children}
    </button>
  );
}

function Stepper({ value, onChange, min = 0, max = 30, label }: { value: number; onChange: (v: number) => void; min?: number; max?: number; label: string }) {
  const t = useT();
  return (
    <div className="flex items-center gap-1.5" role="group" aria-label={label}>
      <button type="button" aria-label={t.chat.stepper.dec} disabled={value <= min} onClick={() => onChange(value - 1)} className="flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-ink/20 transition hover:bg-sand disabled:opacity-30">
        <Minus size={15} />
      </button>
      <span className="w-7 text-center text-sm font-bold tabular-nums text-ink" aria-live="polite">
        {value}
      </span>
      <button type="button" aria-label={t.chat.stepper.inc} disabled={value >= max} onClick={() => onChange(value + 1)} className="flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-ink/20 transition hover:bg-sand disabled:opacity-30">
        <Plus size={15} />
      </button>
    </div>
  );
}

export function Chat({ info, tours }: { info: AgencyInfo; tours: ChatTour[] }) {
  const t = useT();
  const c = t.chat;
  const lang = useLang();
  const f = useFormat();
  const ready = useBudgetReady();
  const { items, customer, add, update, remove, setCustomer, clear } = useBudget();
  const budgetItems = useMemo(() => (ready ? items : []), [ready, items]);

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("home");
  const [detail, setDetail] = useState<string | null>(null);
  const [bubble, setBubble] = useState(false);
  const [copied, setCopied] = useState(false);
  const [thread, setThread] = useState<Msg[]>([]);
  const [replyTyping, setReplyTyping] = useState(false);
  // "Digitando…" também enquanto a saudação inicial ainda está chegando.
  const typing = replyTyping || (open && thread.length < 2);
  const [transferText, setTransferText] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const today = todayISO();
  const wa = useCallback((text: string) => whatsappUrl(info.phone, text), [info.phone]);

  // Balão de convite: aparece uma vez por visita, alguns segundos depois de abrir o site.
  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(BUBBLE_KEY) === "1";
    } catch {}
    if (dismissed) return;
    const id = setTimeout(() => setBubble(true), 3500);
    return () => clearTimeout(id);
  }, []);
  const dismissBubble = () => {
    setBubble(false);
    try {
      sessionStorage.setItem(BUBBLE_KEY, "1");
    } catch {}
  };

  // Abrir: foco no botão de fechar, Esc fecha e, no celular (tela cheia), trava a rolagem do site.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const lock = window.matchMedia("(max-width: 639px)").matches;
    const prev = document.body.style.overflow;
    if (lock) document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Saudação da Carol com "digitando…" antes de cada mensagem — só na primeira abertura.
  const greeted = useRef(false);
  useEffect(() => {
    if (!open || greeted.current) return;
    greeted.current = true;
    setTimeout(() => setThread([{ from: "carol", text: c.greeting }]), 700);
    setTimeout(() => setThread((m) => [...m, { from: "carol", text: c.ask, chips: "main" }]), 1500);
  }, [open, c.greeting, c.ask]);

  // Idioma trocado: a conversa recomeça no idioma novo.
  const langRef = useRef(lang);
  useEffect(() => {
    if (langRef.current !== lang) {
      langRef.current = lang;
      greeted.current = false;
      setThread([]);
    }
  }, [lang]);

  // Conversa: acompanha a última mensagem. Outras abas e o detalhe de um passeio abrem do topo.
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTo({ top: tab === "home" ? el.scrollHeight : 0, behavior: tab === "home" ? "smooth" : "auto" });
  }, [thread, tab, detail, typing]);

  const reply = (me: string, carol: Msg) => {
    setThread((m) => [...m, { from: "me", text: me }]);
    setReplyTyping(true);
    setTimeout(() => (setThread((m) => [...m, carol]), setReplyTyping(false)), 650);
  };

  const goto = (next: Tab) => {
    setTab(next);
    setDetail(null);
  };

  const tourById = (id: string) => tours.find((x) => x.id === id);
  const optionOf = (tour: ChatTour, id: string): ChatOption => tour.options.find((o) => o.id === id) ?? tour.options[0];

  const rows = budgetItems
    .map((item) => {
      const tour = tourById(item.tourId);
      return tour ? { item, tour, option: optionOf(tour, item.optionId) } : null;
    })
    .filter((r): r is { item: BudgetItem; tour: ChatTour; option: ChatOption } => !!r);
  const total = rows.reduce((sum, r) => sum + lineTotal(r.option, r.item.people), 0);
  const missingDate = rows.some((r) => !r.item.date || r.item.date < today);
  const missingName = customer.name.trim().length < 2;
  const canSend = rows.length > 0 && !missingDate && !missingName;

  const priceLabel = (o: ChatOption) => fmt(o.saleUnit === "PESSOA" ? c.perPerson : c.perVehicle, { price: f.money(o.price) });
  const kindLabel = (o: ChatOption) => (o.kind === "shared" ? c.shared : c.private);

  const summary = () => {
    const m = c.msg;
    const lines = [c.whatsappIntro, "", `*${m.name}:* ${customer.name.trim()}`];
    if (customer.hotel.trim()) lines.push(`*${m.hotel}:* ${customer.hotel.trim()}`);
    rows.forEach(({ item, tour, option }, i) => {
      lines.push("", `*${i + 1}. ${tour.title}*`);
      lines.push(`${m.format}: ${kindLabel(option)}`);
      lines.push(`${m.date}: ${item.date ? f.longDate(item.date) : "—"}`);
      lines.push(`${m.people}: ${item.people}${item.kids > 0 ? ` · ${m.kids}: ${item.kids}` : ""}`);
      if (option.saleUnit !== "PESSOA") lines.push(fmt(c.vehiclesNote, { n: unitsFor(option, item.people), unit: f.unitLabel(option.saleUnit, unitsFor(option, item.people)), cap: option.capacity ?? "—" }));
      lines.push(`${c.lineTotal}: ${f.money(lineTotal(option, item.people))}`);
    });
    lines.push("", `*${m.total}: ${f.money(total)}*`);
    if (customer.notes.trim()) lines.push("", `${m.notes}: ${customer.notes.trim()}`);
    return lines.join("\n");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary().replace(/\*/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const addTour = (tour: ChatTour, option: ChatOption) => {
    add({ tourId: tour.id, optionId: option.id, date: "", people: option.capacity && option.capacity <= 2 ? option.capacity : 2, kids: 0 });
    setDetail(null);
    setTab("budget");
  };

  const input = "w-full rounded-xl border border-ink/15 bg-white px-3.5 py-3 text-[14px] text-ink outline-none transition placeholder:text-ink/35 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/15";

  const quick: Record<string, { label: string; run: () => void }[]> = {
    main: [
      { label: c.quick.tours, run: () => goto("tours") },
      { label: c.quick.budget, run: () => goto("budget") },
      { label: c.quick.transfer, run: () => reply(c.quick.transfer, { from: "carol", text: c.transfer.text, chips: "transfer" }) },
      { label: c.quick.formats, run: () => reply(c.quick.formats, { from: "carol", text: c.formats.text, chips: "main" }) },
      { label: c.quick.faq, run: () => reply(c.quick.faq, { from: "carol", text: c.faqText, chips: "faq" }) },
      { label: c.quick.human, run: () => window.open(wa(c.humanMsg), "_blank", "noopener") },
    ],
    faq: [
      { label: c.quick.tours, run: () => goto("tours") },
      { label: c.quick.budget, run: () => goto("budget") },
      { label: c.quick.human, run: () => window.open(wa(c.humanMsg), "_blank", "noopener") },
    ],
  };

  const tabs: { id: Tab; label: string; icon: typeof Home; badge?: number }[] = [
    { id: "home", label: c.tabs.home, icon: Home },
    { id: "tours", label: c.tabs.tours, icon: Compass },
    { id: "budget", label: c.tabs.budget, icon: ShoppingBag, badge: rows.length },
    { id: "contact", label: c.tabs.contact, icon: Phone },
  ];

  const current = detail ? tourById(detail) : undefined;

  return (
    <>
      {/* Lançador: avatar da Guia Carol + balão de convite */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ delay: 0.8 }}
            className="fixed bottom-5 right-4 z-40 flex items-end gap-3 sm:right-6"
          >
            <AnimatePresence>
              {bubble && (
                <motion.div initial={{ opacity: 0, x: 16, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative mb-1 max-w-[15rem] rounded-2xl rounded-br-sm bg-white py-3 pl-4 pr-9 text-[13px] font-medium leading-snug text-ink shadow-[0_16px_40px_-14px_rgba(12,35,64,0.5)] ring-1 ring-ink/10">
                  <button
                    onClick={() => {
                      setOpen(true);
                      dismissBubble();
                    }}
                    className="text-left"
                  >
                    {c.bubble}
                  </button>
                  <button onClick={dismissBubble} aria-label={c.close} className="absolute right-2 top-2 rounded-full p-1 text-ink/40 transition hover:bg-sand hover:text-ink">
                    <X size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => {
                setOpen(true);
                dismissBubble();
              }}
              aria-label={c.launcher}
              title={c.launcher}
              className="group relative h-16 w-16 shrink-0 rounded-full bg-white p-1 shadow-[0_18px_40px_-12px_rgba(12,35,64,0.6)] ring-2 ring-gold-500 transition hover:scale-105 active:scale-95"
            >
              <Image src="/brand/carol.jpg" alt={c.guide} width={128} height={128} className="h-full w-full rounded-full object-cover" />
              <span className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full bg-[#25D366] ring-2 ring-white" />
              {rows.length > 0 && <span className="absolute -left-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-ink px-1 text-xs font-bold text-white ring-2 ring-white">{rows.length}</span>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Painel */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={c.title}
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-paper sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[min(42rem,calc(100vh-2.5rem))] sm:w-[26rem] sm:rounded-[1.75rem] sm:shadow-[0_40px_100px_-30px_rgba(4,12,26,0.75)] sm:ring-1 sm:ring-ink/15"
          >
            <header className="flex items-center gap-3 bg-gradient-to-br from-night-800 to-night-950 px-4 py-3.5 text-white">
              <span className="flex h-12 shrink-0 items-center rounded-xl bg-paper px-2 ring-2 ring-gold-500">
                <Image src="/brand/logo.png" alt={c.title} width={1201} height={596} className="h-10 w-auto max-w-none" />
              </span>
              <div className="min-w-0 flex-1 leading-tight">
                <h2 className="truncate font-display text-lg">{c.title}</h2>
                <p className="truncate text-xs text-white/70">{c.subtitle}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-white/90">
                  <span className="h-2 w-2 rounded-full bg-[#25D366]" /> {c.online}
                </p>
              </div>
              <button ref={closeRef} onClick={() => setOpen(false)} aria-label={c.close} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20">
                <X size={20} />
              </button>
            </header>
            <ul className="grid grid-cols-3 border-b border-ink/10 bg-sand/60 px-2 py-2 text-center text-[10px] font-medium text-ink/70">
              {c.trust.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>

            <div ref={bodyRef} className="flex-1 space-y-4 overflow-y-auto overscroll-contain bg-[radial-gradient(circle_at_20%_10%,rgba(245,179,1,0.08),transparent_35%)] px-4 py-5">
              {/* INÍCIO */}
              {tab === "home" && (
                <>
                  {thread.map((m, i) =>
                    m.from === "me" ? (
                      <MeBubble key={i}>{m.text}</MeBubble>
                    ) : (
                      <div key={i} className="space-y-3">
                        <CarolBubble time={i === 0 ? c.now : undefined}>{strong(m.text)}</CarolBubble>
                        {m.chips === "main" && i === thread.length - 1 && !typing && (
                          <div className="flex flex-wrap gap-2 pl-10">
                            {quick.main.map((q) => (
                              <Chip key={q.label} onClick={q.run}>
                                {q.label}
                              </Chip>
                            ))}
                          </div>
                        )}
                        {m.chips === "faq" && i === thread.length - 1 && (
                          <div className="flex flex-wrap gap-2 pl-10">
                            {quick.faq.map((q) => (
                              <Chip key={q.label} onClick={q.run}>
                                {q.label}
                              </Chip>
                            ))}
                          </div>
                        )}
                        {m.chips === "transfer" && i === thread.length - 1 && (
                          <div className="space-y-2 pl-10">
                            <textarea value={transferText} onChange={(e) => setTransferText(e.target.value)} rows={3} placeholder={c.transfer.placeholder} className={input} />
                            <a
                              href={wa(fmt(c.transfer.msg, { text: transferText.trim() || "…" }))}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-sm font-semibold text-night-900 transition hover:bg-[#1ebe5b]"
                            >
                              <WhatsAppIcon size={18} /> {c.transfer.send}
                            </a>
                          </div>
                        )}
                      </div>
                    )
                  )}
                  {typing && <Typing />}
                </>
              )}

              {/* PASSEIOS — lista */}
              {tab === "tours" && !current && (
                <>
                  <CarolBubble>{strong(c.ask)}</CarolBubble>
                  <div className="flex items-baseline justify-between px-1">
                    <h3 className="font-display text-xl text-ink">{c.toursTitle}</h3>
                    <span className="text-xs text-ink/50">{fmt(c.toursCount, { n: tours.length })}</span>
                  </div>
                  <ul className="space-y-3">
                    {tours.map((tour) => {
                      const inBudget = budgetItems.some((i) => i.tourId === tour.id);
                      return (
                        <li key={tour.id} className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10">
                          <button onClick={() => setDetail(tour.id)} className="flex w-full gap-3 p-2.5 text-left">
                            <span className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-sand">
                              {tour.image && <Image src={tour.image} alt="" fill sizes="112px" className="object-cover" />}
                            </span>
                            <span className="min-w-0 flex-1 py-0.5">
                              <strong className="block font-display text-[15px] leading-snug text-ink">{tour.title}</strong>
                              <span className="mt-1 flex items-center gap-1 text-xs text-ink/55">
                                <Clock size={12} /> {tour.schedule}
                              </span>
                              <span className="mt-2 flex flex-wrap gap-1.5">
                                {tour.options.map((o) => (
                                  <span key={o.id} className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", o.kind === "shared" ? "bg-cyan-brand/10 text-cyan-brand" : "bg-gold-500/20 text-gold-600")}>
                                    {kindLabel(o)} · {f.money(o.price)}
                                  </span>
                                ))}
                              </span>
                              {inBudget && (
                                <span className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-cyan-brand">
                                  <Check size={12} /> {c.inBudget}
                                </span>
                              )}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}

              {/* PASSEIOS — detalhe */}
              {tab === "tours" && current && (
                <div className="space-y-4">
                  <button onClick={() => setDetail(null)} className="flex items-center gap-1.5 text-sm font-semibold text-ink/70 hover:text-ink">
                    <ArrowLeft size={16} /> {c.seeOthers}
                  </button>
                  <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10">
                    <div className="relative aspect-[16/10] bg-sand">{current.image && <Image src={current.image} alt={current.title} fill sizes="400px" className="object-cover" />}</div>
                    <div className="space-y-4 p-4">
                      <div>
                        <h3 className="font-display text-xl leading-tight text-ink">{current.title}</h3>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-ink/55">
                          <Clock size={13} /> {c.duration}: {current.schedule}
                        </p>
                      </div>
                      <p className="text-[14px] leading-relaxed text-ink/75">{current.description}</p>
                      {current.itinerary.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-brand">{c.itinerary}</p>
                          <ol className="mt-2 space-y-1.5 text-[13px] text-ink/75">
                            {current.itinerary.map((s, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-brand/10 text-[11px] font-bold text-cyan-brand">{i + 1}</span>
                                {s}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                      {current.bring.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-brand">{c.bring}</p>
                          <p className="mt-1.5 text-[13px] leading-relaxed text-ink/70">{current.bring.join(" · ")}</p>
                        </div>
                      )}
                      <div className="grid gap-2">
                        {current.options.map((o) => {
                          const already = budgetItems.some((i) => i.tourId === current.id);
                          return (
                            <button
                              key={o.id}
                              disabled={already}
                              onClick={() => addTour(current, o)}
                              className={cn(
                                "flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition",
                                already ? "bg-sand text-ink/50" : o.kind === "shared" ? "bg-gold-500 text-night-900 hover:bg-gold-400" : "bg-ink text-white hover:bg-night-600"
                              )}
                            >
                              <span>
                                {already ? c.added : c.add}
                                <span className="block text-xs font-medium opacity-80">{kindLabel(o)}</span>
                              </span>
                              <span className="text-right">{priceLabel(o)}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ORÇAMENTO */}
              {tab === "budget" && (
                <>
                  <CarolBubble>{strong(c.budgetIntro.replace("💰 ", "💰 "))}</CarolBubble>
                  {rows.length === 0 ? (
                    <div className="rounded-2xl bg-white p-6 text-center ring-1 ring-ink/10">
                      <ShoppingBag className="mx-auto text-ink/30" size={34} />
                      <p className="mt-3 text-sm text-ink/60">{c.empty}</p>
                      <button onClick={() => goto("tours")} className="mt-4 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-night-900 transition hover:bg-gold-400">
                        {c.pickTours}
                      </button>
                    </div>
                  ) : (
                    <>
                      <ul className="space-y-3">
                        {rows.map(({ item, tour, option }) => {
                          const units = unitsFor(option, item.people);
                          const dateBad = !item.date || item.date < today;
                          return (
                            <li key={tour.id} className="space-y-3 rounded-2xl bg-white p-4 ring-1 ring-ink/10">
                              <div className="flex items-start gap-3">
                                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-sand">{tour.image && <Image src={tour.image} alt="" fill sizes="56px" className="object-cover" />}</span>
                                <div className="min-w-0 flex-1">
                                  <strong className="block font-display text-[15px] leading-snug text-ink">{tour.title}</strong>
                                  <span className="text-xs text-ink/55">{tour.schedule}</span>
                                </div>
                                <button onClick={() => remove(tour.id)} aria-label={`${c.remove}: ${tour.title}`} className="rounded-full p-2 text-ink/40 transition hover:bg-sand hover:text-ink">
                                  <Trash2 size={16} />
                                </button>
                              </div>

                              {tour.options.length > 1 && (
                                <div role="radiogroup" aria-label={c.format} className="grid grid-cols-2 gap-1.5 rounded-xl bg-sand p-1">
                                  {tour.options.map((o) => (
                                    <button
                                      key={o.id}
                                      role="radio"
                                      aria-checked={o.id === option.id}
                                      onClick={() => update(tour.id, { optionId: o.id })}
                                      className={cn("rounded-lg px-2 py-2 text-xs font-semibold transition", o.id === option.id ? "bg-white text-ink shadow-sm" : "text-ink/60")}
                                    >
                                      {kindLabel(o)}
                                      <span className="block font-normal opacity-70">{priceLabel(o)}</span>
                                    </button>
                                  ))}
                                </div>
                              )}

                              <label className="block">
                                <span className="mb-1 block text-xs font-semibold text-ink/70">{c.date}</span>
                                <input type="date" min={today} value={item.date} onChange={(e) => update(tour.id, { date: e.target.value })} className={cn(input, dateBad && item.date !== "" && "border-red-400")} />
                                {item.date && item.date >= today && <span className="mt-1 block text-xs text-cyan-brand">{f.longDate(item.date)}</span>}
                              </label>

                              <div className="flex items-center justify-between gap-3">
                                <span className="text-sm font-medium text-ink">{c.people}</span>
                                <Stepper value={item.people} min={1} onChange={(v) => update(tour.id, { people: v })} label={c.people} />
                              </div>
                              {option.allowKids && (
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-sm text-ink/80">
                                    {c.kids}
                                    <span className="block text-[11px] text-ink/45">{c.kidsHint}</span>
                                  </span>
                                  <Stepper value={item.kids} max={6} onChange={(v) => update(tour.id, { kids: v })} label={c.kids} />
                                </div>
                              )}
                              {option.saleUnit !== "PESSOA" && (
                                <p className="rounded-lg bg-sand px-3 py-2 text-xs text-ink/65">
                                  {fmt(c.vehiclesNote, { n: units, unit: f.unitLabel(option.saleUnit, units), cap: option.capacity ?? "—" })}
                                </p>
                              )}
                              <div className="flex items-baseline justify-between border-t border-ink/10 pt-3">
                                <span className="text-xs text-ink/55">{c.lineTotal}</span>
                                <strong className="font-display text-lg text-ink">{f.money(lineTotal(option, item.people))}</strong>
                              </div>
                            </li>
                          );
                        })}
                      </ul>

                      <button onClick={() => goto("tours")} className="flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-ink/25 py-3 text-sm font-semibold text-ink/70 transition hover:border-gold-500 hover:text-ink">
                        <Plus size={16} /> {c.addAnother}
                      </button>

                      <div className="space-y-3 rounded-2xl bg-white p-4 ring-1 ring-ink/10">
                        <h3 className="font-display text-lg text-ink">{c.yourData}</h3>
                        <label className="block">
                          <span className="sr-only">{c.name}</span>
                          <input value={customer.name} onChange={(e) => setCustomer({ name: e.target.value })} placeholder={c.name} autoComplete="name" className={input} />
                        </label>
                        <label className="block">
                          <span className="sr-only">{c.hotel}</span>
                          <input value={customer.hotel} onChange={(e) => setCustomer({ hotel: e.target.value })} placeholder={c.hotel} className={input} />
                        </label>
                        <label className="block">
                          <span className="sr-only">{c.notes}</span>
                          <textarea value={customer.notes} onChange={(e) => setCustomer({ notes: e.target.value })} rows={2} placeholder={c.notes} className={input} />
                        </label>
                      </div>

                      <div className="rounded-2xl bg-ink p-4 text-white">
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm text-white/70">{c.total}</span>
                          <strong className="font-display text-3xl">{f.money(total)}</strong>
                        </div>
                        <p className="mt-1 text-[11px] leading-snug text-white/55">{c.totalNote}</p>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* CONTATO */}
              {tab === "contact" && (
                <>
                  <CarolBubble>{c.contactText}</CarolBubble>
                  <div className="space-y-2.5">
                    {[info.phone, site.secondaryWhatsapp].filter((p, i, a) => p && a.indexOf(p) === i).map((p) => (
                      <a key={p} href={whatsappUrl(p, c.humanMsg)} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-ink/10 transition hover:ring-[#25D366]">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white">
                          <WhatsAppIcon size={22} />
                        </span>
                        <span className="font-semibold text-ink">{fmt(c.callWhatsapp, { phone: p })}</span>
                      </a>
                    ))}
                    <a href={`https://instagram.com/${info.instagram}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-ink/10 transition hover:ring-cyan-brand/50">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-400 text-white">
                        <InstagramIcon size={20} />
                      </span>
                      <span className="font-semibold text-ink">@{info.instagram}</span>
                    </a>
                    <div className="rounded-2xl bg-white p-4 text-sm text-ink/70 ring-1 ring-ink/10">
                      <p className="font-semibold text-ink">{c.address}</p>
                      <p className="mt-1">{site.address}</p>
                      <p className="mt-3 flex items-center gap-1.5 text-xs text-ink/55">
                        <Clock size={13} /> {c.hours} · {t.location.hoursValue[1]}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Rodapé: ação principal da aba + navegação */}
            {tab === "budget" && rows.length > 0 && (
              <div className="space-y-2 border-t border-ink/10 bg-white px-4 py-3">
                <a
                  href={canSend ? wa(summary()) : undefined}
                  target="_blank"
                  rel="noreferrer"
                  aria-disabled={!canSend}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-sm font-bold text-night-900 shadow-lg shadow-[#25D366]/25 transition hover:bg-[#1ebe5b]",
                    !canSend && "pointer-events-none opacity-40 shadow-none"
                  )}
                >
                  <WhatsAppIcon size={20} /> {c.sendBudget}
                </a>
                {!canSend && (
                  <p className="text-center text-xs text-ink/55">{missingDate ? c.missing.date : c.missing.name}</p>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={copy} className="flex items-center justify-center gap-1.5 rounded-full border border-ink/15 py-2.5 text-xs font-semibold text-ink/80 transition hover:bg-sand">
                    {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? c.copied : c.copy}
                  </button>
                  <button onClick={clear} className="flex items-center justify-center gap-1.5 rounded-full border border-ink/15 py-2.5 text-xs font-semibold text-ink/80 transition hover:bg-sand">
                    <Trash2 size={14} /> {c.clear}
                  </button>
                </div>
              </div>
            )}
            {tab === "home" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const data = new FormData(e.currentTarget);
                  const text = String(data.get("msg") ?? "").trim();
                  if (!text) return;
                  window.open(wa(fmt(c.msgIntro, { text })), "_blank", "noopener");
                  e.currentTarget.reset();
                }}
                className="flex items-center gap-2 border-t border-ink/10 bg-white px-3 py-2.5"
              >
                <label className="flex-1">
                  <span className="sr-only">{c.placeholder}</span>
                  <input name="msg" placeholder={c.placeholder} autoComplete="off" className="w-full rounded-full bg-sand/70 px-4 py-3 text-[14px] text-ink outline-none placeholder:text-ink/40 focus:ring-2 focus:ring-gold-500/50" />
                </label>
                <button type="submit" aria-label={c.sendMsg} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-500 text-night-900 transition hover:bg-gold-400">
                  <Send size={18} />
                </button>
              </form>
            )}
            <nav className="grid grid-cols-4 border-t border-ink/10 bg-white pb-[env(safe-area-inset-bottom)]" aria-label={c.title}>
              {tabs.map(({ id, label, icon: Icon, badge }) => (
                <button
                  key={id}
                  onClick={() => goto(id)}
                  aria-current={tab === id ? "page" : undefined}
                  className={cn("relative flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition", tab === id ? "text-ink" : "text-ink/45 hover:text-ink/75")}
                >
                  <span className="relative">
                    <Icon size={20} />
                    {!!badge && <span className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-night-900">{badge}</span>}
                  </span>
                  {label}
                  {tab === id && <span className="absolute inset-x-6 top-0 h-0.5 rounded-full bg-gold-500" />}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
