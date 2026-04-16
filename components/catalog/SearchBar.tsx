"use client";

// CLIENT COMPONENT — controlled input com estado local.

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar no cardápio...",
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        aria-hidden
      />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 h-10 rounded-xl border-border/50 bg-muted/40"
        aria-label="Buscar produtos"
      />
    </div>
  );
}
