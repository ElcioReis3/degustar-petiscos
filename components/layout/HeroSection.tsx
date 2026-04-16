// SERVER COMPONENT — sem "use client"
// Conteúdo estático, zero JS no cliente.

import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STATS: [string, string][] = [
  ["4.9★", "Avaliação"],
  ["2.1k+", "Pedidos"],
  ["30min", "Entrega"],
  ["100%", "Garantido"],
];

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-orange-950/30 via-background to-background px-4 py-10 border-b border-border/30">
      <div className="max-w-6xl mx-auto">
        <Badge
          variant="outline"
          className="border-orange-500/40 text-orange-500 font-medium mb-4 gap-1.5"
        >
          <Zap size={11} fill="currentColor" aria-hidden />
          Faça sua encomenda via WhatsApp
        </Badge>

        <h1 className="text-4xl sm:text-7xl font-bold leading-[1.05] mb-3">
          O melhor
          <br />
          <span className="text-orange-500 font-extrabold"> PETISCO </span>
          da cidade
        </h1>

        <div className="mb-7">
          <p className="text-muted-foreground text-base">
            Funcionamos Sábado e Domingo das 15:00 às 22:00hrs
          </p>
          <p className="font-bold text-muted-foreground">Delivery 🛵💨</p>
        </div>

        <div className="flex flex-wrap gap-8">
          {STATS.map(([value, label]) => (
            <div key={label}>
              <p className="text-orange-500 font-bold text-xl leading-none">
                {value}
              </p>
              <p className="text-muted-foreground text-xs uppercase tracking-widest mt-0.5">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
