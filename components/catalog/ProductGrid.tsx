// SERVER COMPONENT — sem "use client"
// Recebe produtos já filtrados e o slot de card (client) como children factory.

import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  /** Slot: função que renderiza cada card (client component) */
  renderCard: (product: Product) => React.ReactNode;
  searchQuery?: string;
}

export function ProductGrid({
  products,
  renderCard,
  searchQuery,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
        <span className="text-5xl" aria-hidden>😕</span>
        <p className="font-semibold">Nenhum item encontrado</p>
        <p className="text-sm">Tente outro termo ou categoria</p>
      </div>
    );
  }

  return (
    <div>
      {searchQuery && (
        <p className="text-sm text-muted-foreground mb-4">
          {products.length} resultado{products.length !== 1 ? "s" : ""} para{" "}
          <strong className="text-foreground">&ldquo;{searchQuery}&rdquo;</strong>
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => renderCard(product))}
      </div>
    </div>
  );
}
