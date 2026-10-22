import type { TourRiskType, TourSaleUnit } from "./dunastour/types";

/** Item do roteiro — um passeio ou pacote com a própria data (cada um pode ser num dia). */
export interface CartItem {
  kind: "tour" | "package";
  id: string;
  title: string;
  image: string | null;
  /** Preço unitário já com desconto. */
  unitPrice: number;
  /** Preço cheio (pra mostrar a economia). */
  fullPrice: number;
  saleUnit?: TourSaleUnit;
  vehicleMaxOccupancy?: number | null;
  risk: boolean;
  riskType?: TourRiskType | null;
  allowInfants: boolean;
  durationMinutes: number;
  tags: string[];
  trek: boolean;
  /** "YYYY-MM-DD" */
  date: string;
  seats: number;
  infants: number;
}
