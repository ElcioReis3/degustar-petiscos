"use client";

// CLIENT COMPONENT — lê contagem do carrinho e abre o Sheet.

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartButtonProps {
  count: number;
  onClick: () => void;
}

export function CartButton({ count, onClick }: CartButtonProps) {
  return (
    <Button
      className="relative bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold h-10 px-4"
      onClick={onClick}
      aria-label={`Abrir carrinho${count > 0 ? ` — ${count} ${count === 1 ? "item" : "itens"}` : ""}`}
    >
      <ShoppingCart size={16} className="mr-1.5" aria-hidden />
      <span className="hidden sm:inline">Carrinho</span>

      {count > 0 && (
        <span
          className="absolute -top-2 -right-2 bg-white text-orange-500 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-orange-500"
          aria-hidden
        >
          {count}
        </span>
      )}
    </Button>
  );
}
