"use client";

import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { fmt, cartCount, cartTotal, buildWhatsAppMessage } from "@/lib/utils";
import { CONFIG } from "@/lib/data";
import type { CartItem } from "@/types";
import Image from "next/image";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  onUpdate: (id: number, qty: number) => void;
  onCheckout: () => void;
}

export function CartSheet({
  open,
  onOpenChange,
  cart,
  onUpdate,
  onCheckout,
}: CartSheetProps) {
  const count = cartCount(cart);
  const total = cartTotal(cart);

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${buildWhatsAppMessage(cart)}`,
      "_blank",
    );
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0"
      >
        <SheetHeader className="px-5 pt-5 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-base font-semibold">
            <ShoppingCart size={18} className="text-orange-500" />
            Carrinho
            {count > 0 && (
              <Badge className="bg-orange-500 hover:bg-orange-500 text-white text-xs ml-1">
                {count}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 px-5">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <ShoppingCart size={44} strokeWidth={1.2} />
              <p className="font-semibold text-sm">Carrinho vazio</p>
              <p className="text-xs">Adicione itens do cardápio</p>
            </div>
          ) : (
            <div className="py-4 space-y-1">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 py-3 border-b last:border-0"
                >
                  <Image
                    src={item.image[0]}
                    alt={item.name}
                    width={64}
                    height={64}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {item.name}
                    </p>
                    <p className="text-orange-500 font-semibold text-sm mt-0.5">
                      {fmt(item.price * item.qty)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-lg"
                        onClick={() => onUpdate(item.id, item.qty - 1)}
                      >
                        <Minus size={12} />
                      </Button>
                      <span className="font-semibold text-sm w-5 text-center">
                        {item.qty}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-lg"
                        onClick={() => onUpdate(item.id, item.qty + 1)}
                      >
                        <Plus size={12} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 ml-auto text-destructive hover:text-destructive"
                        onClick={() => onUpdate(item.id, 0)}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {cart.length > 0 && (
          <div className="px-5 py-4 border-t space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Total</span>
              <span className="text-orange-500 font-bold text-2xl">
                {fmt(total)}
              </span>
            </div>
            <Separator />

            <Button
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl"
              onClick={onCheckout}
              disabled={true}
            >
              <CreditCard size={16} className="mr-2" />
              Pagar Online
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 font-semibold rounded-xl"
              onClick={handleWhatsApp}
            >
              <MessageCircle size={16} className="mr-2" />
              Pedir via WhatsApp
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
