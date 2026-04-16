"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { User as UserType } from "@/types";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: (user: UserType) => void;
}

type Mode = "options" | "guest";

export function LoginDialog({ open, onOpenChange, onLogin }: LoginDialogProps) {
  const [mode, setMode] = useState<Mode>("options");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogle = () => {
    setLoading(true);
    // Em produção: integre com next-auth ou @react-oauth/google
    setTimeout(() => {
      onLogin({
        name: "Usuário Google",
        email: "usuario@gmail.com",
        avatar: "G",
        provider: "google",
      });
      onOpenChange(false);
      setLoading(false);
    }, 900);
  };

  const handleGuest = () => {
    if (!name.trim()) return;
    onLogin({
      name: name.trim(),
      avatar: name.trim()[0].toUpperCase(),
      provider: "guest",
    });
    onOpenChange(false);
    setName("");
    setMode("options");
  };

  const handleOpenChange = (v: boolean) => {
    onOpenChange(v);
    if (!v) {
      setMode("options");
      setName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm rounded-2xl">
        <DialogHeader className="text-center items-center gap-1 pb-1">
          <div className="text-5xl mb-2">🍽️</div>
          <DialogTitle className="text-xl font-semibold">
            Bem-vindo!
          </DialogTitle>
          <DialogDescription>
            Faça login para salvar pedidos e acessar promoções exclusivas.
          </DialogDescription>
        </DialogHeader>

        {mode === "options" && (
          <div className="flex flex-col gap-3 pt-1">
            <Button
              variant="outline"
              className="w-full h-12 font-semibold rounded-xl gap-3 text-sm"
              onClick={handleGoogle}
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {loading ? "Conectando..." : "Entrar com Google"}
            </Button>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">ou</span>
              <Separator className="flex-1" />
            </div>

            <Button
              variant="ghost"
              className="w-full h-11 font-semibold rounded-xl border border-border/50 text-sm"
              onClick={() => setMode("guest")}
            >
              <User size={14} className="mr-2" />
              Continuar como convidado
            </Button>
          </div>
        )}

        {mode === "guest" && (
          <div className="flex flex-col gap-3 pt-1">
            <Button
              variant="ghost"
              size="sm"
              className="self-start -ml-1 text-muted-foreground"
              onClick={() => setMode("options")}
            >
              <ChevronLeft size={15} className="mr-1" />
              Voltar
            </Button>
            <div className="space-y-1.5">
              <Label htmlFor="guest-name" className="text-sm font-semibold">
                Seu nome
              </Label>
              <Input
                id="guest-name"
                placeholder="Como devemos te chamar?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGuest()}
                className="h-11 rounded-xl"
                autoFocus
              />
            </div>
            <Button
              className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl"
              onClick={handleGuest}
              disabled={!name.trim()}
            >
              Continuar
              <ChevronRight size={15} className="ml-1" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
