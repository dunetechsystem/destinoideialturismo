"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useSyncExternalStore } from "react";

/** Item do orçamento: um passeio (por id) na modalidade escolhida, com data e quantidade de pessoas. */
export interface BudgetItem {
  tourId: string;
  optionId: string;
  /** "YYYY-MM-DD" */
  date: string;
  people: number;
  kids: number;
}

export interface Customer {
  name: string;
  hotel: string;
  notes: string;
}

interface BudgetState {
  items: BudgetItem[];
  customer: Customer;
  add: (item: BudgetItem) => void;
  update: (tourId: string, patch: Partial<BudgetItem>) => void;
  remove: (tourId: string) => void;
  setCustomer: (patch: Partial<Customer>) => void;
  clear: () => void;
}

/** Orçamento guardado no navegador (localStorage): sobrevive a recarregar a página e a trocar de idioma. */
export const useBudget = create<BudgetState>()(
  persist(
    (set) => ({
      items: [],
      customer: { name: "", hotel: "", notes: "" },
      add: (item) => set((s) => (s.items.some((i) => i.tourId === item.tourId) ? s : { items: [...s.items, item] })),
      update: (tourId, patch) => set((s) => ({ items: s.items.map((i) => (i.tourId === tourId ? { ...i, ...patch } : i)) })),
      remove: (tourId) => set((s) => ({ items: s.items.filter((i) => i.tourId !== tourId) })),
      setCustomer: (patch) => set((s) => ({ customer: { ...s.customer, ...patch } })),
      clear: () => set({ items: [] }),
    }),
    { name: "di-orcamento", storage: createJSONStorage(() => localStorage), partialize: (s) => ({ items: s.items, customer: s.customer }) }
  )
);

const noopSubscribe = () => () => {};
/** false no servidor/hidratação, true depois — o orçamento vem do localStorage e não pode divergir do HTML do servidor. */
export const useBudgetReady = () => useSyncExternalStore(noopSubscribe, () => true, () => false);
