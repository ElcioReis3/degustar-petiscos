"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { StarRating } from "./StarRating";
import { fmt, calcDiscount } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const [zoomOpen, setZoomOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  // fallback caso não tenha imagens
  const images =
    product.image && product.image.length > 0
      ? product.image
      : ["/placeholder.png"];

  return (
    <>
      <Card className="group overflow-hidden border border-border/40 bg-card hover:border-orange-500/40 transition-all duration-200 hover:-translate-y-0.5 flex flex-col">
        {/* CAROUSEL */}
        <div className="relative">
          <Carousel>
            <CarouselContent>
              {images.map((img, index) => (
                <CarouselItem key={index}>
                  <div
                    className="relative aspect-[3/4] w-full overflow-hidden cursor-pointer bg-muted/30"
                    onClick={() => {
                      setCurrentImage(index);
                      setZoomOpen(true);
                    }}
                  >
                    <Image
                      src={img}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.png";
                      }}
                    />

                    {/* Badges */}
                    {product.badge && (
                      <Badge className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] px-2 py-0.5">
                        {product.badge}
                      </Badge>
                    )}
                    {product.isNew && (
                      <Badge className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] px-2 py-0.5">
                        NOVO
                      </Badge>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* CONTENT */}
        <CardContent className="flex flex-col gap-2 p-4 flex-1">
          <StarRating rating={product.rating} reviews={product.reviews} />
          <p className="font-semibold text-sm leading-tight">{product.name}</p>
          <p className="text-xs text-muted-foreground leading-relaxed flex-1">
            {product.description}
          </p>
        </CardContent>

        {/* FOOTER */}
        <CardFooter className="px-4 pb-4 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="text-orange-500 font-bold text-lg leading-none">
              {fmt(product.price)}
            </p>
            {product.originalPrice && (
              <p className="text-xs text-muted-foreground line-through mt-0.5">
                {fmt(product.originalPrice)}{" "}
                <span className="text-emerald-500 font-semibold">
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

      {/* MODAL ZOOM */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setZoomOpen(false)}
        >
          <div className="w-xl h-full max-w-6xl max-h-[90vh] px-4">
            <Carousel className="w-full h-full">
              <CarouselContent className="h-full">
                {images.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="relative w-full h-[80vh] flex items-center justify-center">
                      <Image
                        src={img}
                        alt={product.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      )}
    </>
  );
}
