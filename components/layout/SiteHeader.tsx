// SERVER COMPONENT — sem "use client"
// Renderiza o shell estático do header.
// Partes interativas (busca, auth, carrinho) são injetadas como children.

import { CONFIG } from "@/lib/data";
import { ModeToggle } from "../ui/mode-toggle";

interface SiteHeaderProps {
  searchSlot: React.ReactNode; // <SearchBar /> — client
  authSlot: React.ReactNode; // <AuthButton /> — client
  cartSlot: React.ReactNode; // <CartButton /> — client
}

export function SiteHeader({
  searchSlot,
  authSlot,
  cartSlot,
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b border-border/40">
      <div className="max-w-6xl mx-auto flex items-center gap-3 h-16 px-4">
        {/* Logo — totalmente estático, renderizado no servidor */}
        <div className="flex flex-col leading-none flex-1 min-w-fit select-none">
          <span className="text-xl font-bold text-orange-500 tracking-tight">
            {CONFIG.STORE_NAME}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
            Delivery &amp; Catálogo
          </span>
        </div>

        {/* Search — client component injetado via slot */}
        <div className="relative flex-[2] hidden sm:block">{searchSlot}</div>

        {/* Auth + Cart — client components */}
        <div className="flex items-center gap-2">
          {authSlot}
          {cartSlot}
        </div>
        <ModeToggle />
      </div>

      {/* Search mobile */}
      <div className="sm:hidden px-4 pb-3">{searchSlot}</div>
    </header>
  );
}
