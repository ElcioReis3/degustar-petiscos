"use client";

// CLIENT COMPONENT — mostra avatar do usuário logado ou botão de login.

import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { User } from "@/types";

interface AuthButtonProps {
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

export function AuthButton({ user, onLoginClick, onLogout }: AuthButtonProps) {
  if (user) {
    return (
      <button
        className="flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1 hover:bg-muted transition-colors"
        onClick={onLogout}
        title="Clique para sair"
        aria-label={`Sair da conta de ${user.name}`}
      >
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-orange-500 text-white text-xs font-semibold">
            {user.avatar}
          </AvatarFallback>
        </Avatar>
        <span className="hidden sm:block text-sm font-medium">
          {user.name.split(" ")[0]}
        </span>
        <LogOut size={14} className="text-muted-foreground hidden sm:block" aria-hidden />
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-xl font-medium border-border/50 hidden sm:flex"
      onClick={onLoginClick}
    >
      <LogIn size={14} className="mr-1.5" aria-hidden />
      Entrar
    </Button>
  );
}
