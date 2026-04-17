import type { CartItem } from "@/types";
import { CONFIG } from "./data";

/** Formata número para moeda brasileira */
export const fmt = (n: number): string =>
  `${CONFIG.CURRENCY_SYMBOL} ${n.toFixed(2).replace(".", ",")}`;

/** Calcula percentual de desconto */
export const calcDiscount = (original: number, current: number): number =>
  Math.round(((original - current) / original) * 100);

/** Total de itens no carrinho */
export const cartCount = (cart: CartItem[]): number =>
  cart.reduce((sum, item) => sum + item.qty, 0);

/** Valor total do carrinho */
export const cartTotal = (cart: CartItem[]): number =>
  cart.reduce((sum, item) => sum + item.price * item.qty, 0);

/** Monta mensagem formatada para WhatsApp */
export const buildWhatsAppMessage = (cart: CartItem[]): string => {
  let msg = `🛒 *Pedido - ${CONFIG.STORE_NAME}*\n`;
  cart.forEach((i) => {
    msg += `• ${i.qty}x ${i.name}\n`;
  });
  return encodeURIComponent(msg);
};

/** Merge de classes Tailwind */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
