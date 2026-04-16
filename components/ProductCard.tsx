"use client";

import { Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { fmt, calcDiscount } from "@/lib/utils";
import type { Product } from "@/types";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

function StarRating({ rating, reviews }: { rating: number; reviews?: number }) {
  return (
    <div className="flex items-center gap-1 text-xs text-amber-400">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={11}
          fill={i < Math.round(rating) ? "currentColor" : "none"}
        />
      ))}
      <span className="text-muted-foreground ml-1">
        {rating} ({reviews})
      </span>
    </div>
  );
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden border border-border/40 bg-card hover:border-orange-500/40 transition-all duration-200 hover:-translate-y-0.5 flex flex-col">
      {/* Image area */}
      <div className="relative h-36 flex items-center justify-center bg-muted/30 text-6xl select-none">
        <Image
          src={product.image[0]}
          alt={product.name}
          width={64}
          height={64}
        />

        {product.badge && (
          <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-500 text-white text-[10px] font-semibold px-2 py-0.5">
            {product.badge}
          </Badge>
        )}
        {product.isNew && (
          <Badge className="absolute top-2 right-2 bg-emerald-500 hover:bg-emerald-500 text-white text-[10px] font-semibold px-2 py-0.5">
            NOVO
          </Badge>
        )}
      </div>

      <CardContent className="flex flex-col gap-2 p-4 flex-1">
        <StarRating rating={product.rating} reviews={product.reviews} />
        <p className="font-semibold text-sm leading-tight">{product.name}</p>
        <p className="text-xs text-muted-foreground leading-relaxed flex-1">
          {product.description}
        </p>
      </CardContent>

      <CardFooter className="px-4 pb-4 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="text-orange-500 font-bold text-lg leading-none">
            {fmt(product.price)}
          </p>
          {product.originalPrice && (
            <p className="text-xs text-muted-foreground line-through mt-0.5">
              {fmt(product.originalPrice)}{" "}
              <span className="text-emerald-500 no-underline font-semibold">
                -{calcDiscount(product.originalPrice, product.price)}%
              </span>
            </p>
          )}
        </div>
        <Button
          size="sm"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shrink-0"
          onClick={() => onAdd(product)}
        >
          <Plus size={14} className="mr-1" />
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  );
}
