"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryBarProps {
  categories: Category[];
  active: string;
  onChange: (id: string) => void;
}

export function CategoryBar({
  categories,
  active,
  onChange,
}: CategoryBarProps) {
  return (
    <nav
      className="sticky top-16 z-40 bg-background/90 backdrop-blur border-b border-border/40"
      aria-label="Categorias"
    >
      <div className="max-w-6xl mx-auto px-4">
        <ScrollArea className="w-full">
          <div className="flex gap-2 py-3 w-max" role="tablist">
            {categories.map((cat) => {
              const isActive = active === cat.id;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onChange(cat.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border",
                    isActive
                      ? "bg-orange-500 text-white border-orange-500"
                      : "border-border/40 text-muted-foreground hover:border-border hover:text-foreground",
                  )}
                >
                  <span className="text-sm" aria-hidden>
                    {cat.icon}
                  </span>
                  {cat.label}
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </nav>
  );
}
