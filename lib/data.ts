import type { Category, Product } from "@/types";

export const CONFIG = {
  STORE_NAME: "Degustar Petiscos",
  WHATSAPP_NUMBER: "5599981456350",
  STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_KEY ?? "",
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
  CURRENCY_SYMBOL: "R$",
} as const;

export const CATEGORIES: Category[] = [
  { id: "todos", label: "Todos", icon: "🍽️" },
  { id: "petiscos", label: "Petiscos", icon: "🍢" },
  { id: "bebidas", label: "Bebidas", icon: "🥤" },
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Petisqueira Degustar",
    category: "petiscos",
    price: 0.01,
    originalPrice: 0.02,
    description:
      "Cada repartição preenchida com azeitonas, queijo coalho temperado, salame, ovo de codorna temperado e patê de calabresa acebolado.",
    image: [
      "/image/produtos/petisqueira_degustar.jpg",
      "/image/produtos/petisqueira_degustar_2.jpg",
    ],
    badge: "Mais Pedido",
    rating: 5.0,
  },
  {
    id: 2,
    name: "Petisqueira Degustar G",
    category: "petiscos",
    price: 0.01,
    originalPrice: 0.02,
    description:
      "Cada repartição preenchida com azeitonas, amendoim, queijo coalho temperado, camarão, salame e ovo de codorna temperado.",
    image: [
      "/image/produtos/petisqueira_degustar_g1.jpg",
      "/image/produtos/petisqueira_degustar_g2.jpg",
    ],
    badge: "Mais Completo",
    rating: 5.0,
  },
];
