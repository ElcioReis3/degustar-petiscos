"use client";

import { useState, useCallback, useMemo } from "react";

import { SiteHeader } from "@/components/layout/SiteHeader";
import { HeroSection } from "@/components/layout/HeroSection";
import { CategoryBar } from "@/components/catalog/CategoryBar";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { ProductCard } from "@/components/catalog/ProductCard";
import { SearchBar } from "@/components/catalog/SearchBar";
import { CartButton } from "@/components/cart/CartButton";
import { CartSheet } from "@/components/cart/CartSheet";
import { AuthButton } from "@/components/auth/AuthButton";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { PaymentDialog } from "@/components/checkout/PaymentDialog";

import { useCart } from "@/lib/hooks/useCart";
import { useUser } from "@/lib/hooks/useUser";
import { useNotify } from "@/lib/hooks/useNotify";
import { cartCount } from "@/lib/utils";
import { CATEGORIES, PRODUCTS } from "@/lib/data";
import type { Product } from "@/types";
import { Footer } from "@/components/layout/Footer";

export function CatalogShell() {
  const { cart, addItem, updateQty, clearCart } = useCart();
  const { user, login, logout } = useUser();
  const { success } = useNotify();

  const [category, setCategory] = useState("todos");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);

  // ── handlers ──────────────────────────────────────────────
  const handleAdd = useCallback(
    (product: Product) => {
      addItem(product);
      success("Adicionado ao carrinho!", product.name);
    },
    [addItem, success],
  );

  const handleCheckout = useCallback(() => {
    if (!user) {
      setCartOpen(false);
      setLoginOpen(true);
      return;
    }
    setCartOpen(false);
    setPayOpen(true);
  }, [user]);

  const handlePaySuccess = useCallback(() => {
    clearCart();
    success("🎉 Pedido realizado!", "Obrigado pela preferência!");
  }, [clearCart, success]);

  const handleLogin = useCallback(
    (u: Parameters<typeof login>[0]) => {
      login(u);
      success(
        `Bem-vindo, ${u.name.split(" ")[0]}!`,
        "Login realizado com sucesso.",
      );
    },
    [login, success],
  );

  const handleLogout = useCallback(() => {
    if (window.confirm("Deseja sair?")) {
      logout();
      clearCart();
    }
  }, [logout, clearCart]);

  // ── filtragem (memo para não recalcular no re-render) ─────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return PRODUCTS.filter((p) => {
      const matchCat =
        category === "todos" ||
        p.category === category ||
        (category === "lancamentos" && p.isNew);
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [category, search]);

  const count = cartCount(cart);

  // ── render ─────────────────────────────────────────────────
  return (
    <>
      {/* Header: shell estático (server) + slots client */}
      <SiteHeader
        searchSlot={<SearchBar value={search} onChange={setSearch} />}
        authSlot={
          <AuthButton
            user={user}
            onLoginClick={() => setLoginOpen(true)}
            onLogout={handleLogout}
          />
        }
        cartSlot={
          <CartButton count={count} onClick={() => setCartOpen(true)} />
        }
      />

      {/* Hero: zero JS — renderizado no servidor */}
      <HeroSection />

      {/* Barra de categorias */}
      <CategoryBar
        categories={CATEGORIES}
        active={category}
        onChange={setCategory}
      />

      {/* Grid de produtos */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <ProductGrid
          products={filtered}
          searchQuery={search}
          renderCard={(product) => (
            <ProductCard key={product.id} product={product} onAdd={handleAdd} />
          )}
        />
        <div className="h-16" />
        <Footer />
      </main>

      {/* Modais e drawer */}
      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        cart={cart}
        onUpdate={updateQty}
        onCheckout={handleCheckout}
      />

      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onLogin={handleLogin}
      />

      <PaymentDialog
        open={payOpen}
        onOpenChange={setPayOpen}
        cart={cart}
        onSuccess={handlePaySuccess}
      />
    </>
  );
}
