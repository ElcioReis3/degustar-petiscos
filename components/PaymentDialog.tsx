"use client";

import { useState, ChangeEvent, KeyboardEvent } from "react";
import { ChevronLeft, CreditCard, QrCode, CheckCircle2 } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { fmt, cartTotal } from "@/lib/utils";
import type { CartItem } from "@/types";

type Step = "method" | "card" | "pix" | "processing" | "done";
type PayMethod = "card" | "pix";

interface CardForm {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
}

interface AddressForm {
  street: string;
  number: string;
  zip: string;
  city: string;
}

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  onSuccess: () => void;
}

export function PaymentDialog({
  open,
  onOpenChange,
  cart,
  onSuccess,
}: PaymentDialogProps) {
  const [step, setStep] = useState<Step>("method");
  const [method, setMethod] = useState<PayMethod>("card");
  const [card, setCard] = useState<CardForm>({ number: "", name: "", expiry: "", cvc: "" });
  const [addr, setAddr] = useState<AddressForm>({ street: "", number: "", zip: "", city: "" });

  const total = cartTotal(cart);

  const fmtCardNumber = (v: string) =>
    v.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);

  const fmtExpiry = (v: string) =>
    v.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2").slice(0, 5);

  const handleCardInput =
    (field: keyof CardForm) => (e: ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (field === "number") value = fmtCardNumber(value);
      if (field === "expiry") value = fmtExpiry(value);
      if (field === "cvc") value = value.replace(/\D/g, "").slice(0, 4);
      setCard((prev) => ({ ...prev, [field]: value }));
    };

  const handleAddrInput =
    (field: keyof AddressForm) => (e: ChangeEvent<HTMLInputElement>) => {
      setAddr((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handlePay = () => {
    setStep("processing");
    // Em produção: use stripe.confirmCardPayment() aqui
    setTimeout(() => setStep("done"), 2200);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      if (step === "done") onSuccess();
      onOpenChange(false);
      setTimeout(() => {
        setStep("method");
        setCard({ number: "", name: "", expiry: "", cvc: "" });
        setAddr({ street: "", number: "", zip: "", city: "" });
      }, 300);
    }
  };

  const isCardValid =
    card.number.replace(/\s/g, "").length >= 16 &&
    card.name.length > 1 &&
    card.expiry.length === 5 &&
    card.cvc.length >= 3;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl max-h-[92vh] overflow-y-auto">

        {/* ── METHOD ── */}
        {step === "method" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Como deseja pagar?
              </DialogTitle>
              <DialogDescription>
                Total:{" "}
                <strong className="text-orange-500">{fmt(total)}</strong>
              </DialogDescription>
            </DialogHeader>

            <RadioGroup
              value={method}
              onValueChange={(v) => setMethod(v as PayMethod)}
              className="gap-3 pt-2"
            >
              {[
                {
                  value: "card" as const,
                  icon: <CreditCard size={20} className="text-orange-500" />,
                  title: "Cartão de Crédito / Débito",
                  sub: "Pagamento seguro via Stripe",
                },
                {
                  value: "pix" as const,
                  icon: <QrCode size={20} className="text-emerald-500" />,
                  title: "Pix",
                  sub: "Instantâneo e sem taxas",
                },
              ].map((opt) => (
                <Label
                  key={opt.value}
                  htmlFor={opt.value}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    method === opt.value
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30"
                      : "border-border/40 hover:border-border"
                  }`}
                >
                  <RadioGroupItem
                    value={opt.value}
                    id={opt.value}
                    className="sr-only"
                  />
                  {opt.icon}
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">
                      {opt.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{opt.sub}</p>
                  </div>
                  {method === opt.value && (
                    <CheckCircle2 size={18} className="text-orange-500 shrink-0" />
                  )}
                </Label>
              ))}
            </RadioGroup>

            <Button
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl mt-1"
              onClick={() => setStep(method)}
            >
              Continuar →
            </Button>
          </>
        )}

        {/* ── CARD ── */}
        {step === "card" && (
          <>
            <DialogHeader>
              <Button
                variant="ghost"
                size="sm"
                className="self-start -ml-2 text-muted-foreground mb-1 w-fit"
                onClick={() => setStep("method")}
              >
                <ChevronLeft size={15} className="mr-1" /> Voltar
              </Button>
              <DialogTitle className="text-xl font-semibold">
                Dados do cartão
              </DialogTitle>
              <DialogDescription>
                Total:{" "}
                <strong className="text-orange-500">{fmt(total)}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-1">
              <div className="space-y-1.5">
                <Label htmlFor="cc-number" className="text-xs text-muted-foreground uppercase tracking-wide">
                  Número
                </Label>
                <Input
                  id="cc-number"
                  placeholder="0000 0000 0000 0000"
                  value={card.number}
                  onChange={handleCardInput("number")}
                  maxLength={19}
                  className="h-11 rounded-xl font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cc-name" className="text-xs text-muted-foreground uppercase tracking-wide">
                  Nome no cartão
                </Label>
                <Input
                  id="cc-name"
                  placeholder="Como impresso no cartão"
                  value={card.name}
                  onChange={handleCardInput("name")}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="cc-expiry" className="text-xs text-muted-foreground uppercase tracking-wide">
                    Validade
                  </Label>
                  <Input
                    id="cc-expiry"
                    placeholder="MM/AA"
                    value={card.expiry}
                    onChange={handleCardInput("expiry")}
                    maxLength={5}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cc-cvc" className="text-xs text-muted-foreground uppercase tracking-wide">
                    CVV
                  </Label>
                  <Input
                    id="cc-cvc"
                    placeholder="123"
                    value={card.cvc}
                    onChange={handleCardInput("cvc")}
                    maxLength={4}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              <Separator />

              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                Endereço de entrega
              </p>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="addr-street" className="text-xs text-muted-foreground">
                    Rua / Av.
                  </Label>
                  <Input
                    id="addr-street"
                    placeholder="Ex: Rua das Flores"
                    value={addr.street}
                    onChange={handleAddrInput("street")}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="addr-number" className="text-xs text-muted-foreground">
                    Número
                  </Label>
                  <Input
                    id="addr-number"
                    placeholder="123"
                    value={addr.number}
                    onChange={handleAddrInput("number")}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="addr-zip" className="text-xs text-muted-foreground">
                    CEP
                  </Label>
                  <Input
                    id="addr-zip"
                    placeholder="00000-000"
                    value={addr.zip}
                    onChange={handleAddrInput("zip")}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="addr-city" className="text-xs text-muted-foreground">
                    Cidade
                  </Label>
                  <Input
                    id="addr-city"
                    placeholder="Sua cidade"
                    value={addr.city}
                    onChange={handleAddrInput("city")}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              <Button
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl"
                onClick={handlePay}
                disabled={!isCardValid}
              >
                🔒 Pagar {fmt(total)}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Pagamento criptografado via Stripe
              </p>
            </div>
          </>
        )}

        {/* ── PIX ── */}
        {step === "pix" && (
          <>
            <DialogHeader>
              <Button
                variant="ghost"
                size="sm"
                className="self-start -ml-2 text-muted-foreground mb-1 w-fit"
                onClick={() => setStep("method")}
              >
                <ChevronLeft size={15} className="mr-1" /> Voltar
              </Button>
              <DialogTitle className="text-xl font-semibold">
                Pagar com Pix
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col items-center gap-4 py-2">
              <div className="w-44 h-44 rounded-2xl bg-white flex flex-col items-center justify-center border-4 border-orange-500 gap-2">
                <QrCode size={72} className="text-gray-700" />
                <span className="text-xs text-gray-500">QR Code Pix</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Escaneie com o app do seu banco
              </p>
              <p className="text-orange-500 font-bold text-2xl">{fmt(total)}</p>
              <div className="w-full bg-muted rounded-xl p-3 text-xs text-muted-foreground font-mono break-all leading-relaxed">
                00020126580014br.gov.bcb.pix0136...chave-pix-exemplo@email.com
              </div>
            </div>

            <Button
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl"
              onClick={() => {
                onSuccess();
                onOpenChange(false);
              }}
            >
              <CheckCircle2 size={16} className="mr-2" />
              Já paguei
            </Button>
          </>
        )}

        {/* ── PROCESSING ── */}
        {step === "processing" && (
          <div className="flex flex-col items-center gap-4 py-14">
            <div className="text-6xl animate-spin">⏳</div>
            <p className="font-semibold text-lg">Processando pagamento...</p>
            <p className="text-muted-foreground text-sm text-center">
              Aguarde, estamos confirmando com o Stripe
            </p>
          </div>
        )}

        {/* ── DONE ── */}
        {step === "done" && (
          <div className="flex flex-col items-center gap-4 py-10">
            <CheckCircle2 size={68} className="text-emerald-500" />
            <p className="font-bold text-2xl text-emerald-500">
              Pedido confirmado!
            </p>
            <p className="text-muted-foreground text-sm text-center">
              Você receberá uma confirmação em breve. Obrigado!
            </p>
            <Button
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl mt-2"
              onClick={() => handleClose(false)}
            >
              Perfeito! ✓
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
