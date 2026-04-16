export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string[];
  badge?: string;
  rating: number;
  reviews?: number;
  isNew?: boolean;
}

export interface CartItem extends Product {
  qty: number;
}

export interface User {
  name: string;
  email?: string;
  avatar: string;
  provider: "google" | "guest";
}

export interface Category {
  id: string;
  label: string;
  icon: string;
}
