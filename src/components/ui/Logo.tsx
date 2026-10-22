import Image from "next/image";
import { cn } from "@/lib/cn";

/** Emblema da Destino Ideal (palmeira + sol sobre as lagoas) — recorte da logo, em /public/brand/mark.png. */
export function DiMark({ className, priority = false }: { className?: string; priority?: boolean }) {
  return <Image src="/brand/mark.png" alt="Destino Ideal Turismo" width={480} height={480} priority={priority} className={cn("h-auto select-none", className ?? "w-full")} />;
}

/** Logo completa (com o letreiro dourado), em /public/brand/logo.png — pra fundos escuros grandes, como o hero. */
export function DiFullLogo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return <Image src="/brand/logo.png" alt="Destino Ideal Turismo — Lençóis Maranhenses" width={1201} height={596} priority={priority} className={cn("h-auto select-none", className ?? "w-full")} />;
}

/** Logo completa, sem recorte, no cabeçalho e no rodapé (o letreiro já faz parte da arte). A altura vem de `className`. */
export function DiLogo({ className }: { className?: string }) {
  return <Image src="/brand/logo.png" alt="Destino Ideal Turismo — Lençóis Maranhenses" width={1201} height={596} priority className={cn("w-auto max-w-none select-none", className)} />;
}
