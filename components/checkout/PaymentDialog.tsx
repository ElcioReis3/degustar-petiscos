"use client";

// CLIENT COMPONENT — modal de pagamento com Stripe (cartão) e Pix.

import { useState, type ChangeEvent } from "react";
import { ChevronLeft, CreditCard, QrCode, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { fmt, cartTotal } from "@/lib/utils";
import type { CartItem } from "@/types";

// ─── tipos locais ────────────────────────────────────────────
type Step      = "method" | "card" | "pix" | "processing" | "done";
type PayMethod = "card" | "pix";

interface CardForm {
  number: string;
  name:   string;
  expiry: string;
  cvc:    string;
}

interface AddressForm {
  street: string;
  number: string;
  zip:    string;
  city:   string;
}

interface PaymentDialogProps {
  open:           boolean;
  onOpenChange:   (open: boolean) => void;
  cart:           CartItem[];
  onSuccess:      () => void;
}

// ─── helpers ────────────────────────────────────────────────
const fmtCardNumber = (v: string) =>
  v.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);

const fmtExpiry = (v: string) =>
  v.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2").slice(0, 5);

// ─── componente ─────────────────────────────────────────────
export function PaymentDialog({
  open,
  onOpenChange,
  cart,
  onSuccess,
}: PaymentDialogProps) {
  const [step,   setStep]   = useState<Step>("method");
  const [method, setMethod] = useState<PayMethod>("card");
  const [card,   setCard]   = useState<CardForm>({ number: "", name: "", expiry: "", cvc: "" });
  const [addr,   setAddr]   = useState<AddressForm>({ street: "", number: "", zip: "", city: "" });

  const total = cartTotal(cart);

  const handleCardField =
    (field: keyof CardForm) => (e: ChangeEvent<HTMLInputElement>) => {
      let v = e.target.value;
      if (field === "number") v = fmtCardNumber(v);
      if (field === "expiry") v = fmtExpiry(v);
      if (field === "cvc")    v = v.replace(/\D/g, "").slice(0, 4);
      setCard((prev) => ({ ...prev, [field]: v }));
    };

  const handleAddrField =
    (field: keyof AddressForm) => (e: ChangeEvent<HTMLInputElement>) =>
      setAddr((prev) => ({ ...prev, [field]: e.target.value }));

  const handlePay = () => {
    setStep("processing");
    // TODO produção: await stripe.confirmCardPayment(clientSecret, { payment_method: { card } })
    setTimeout(() => setStep("done"), 2200);
  };

  const resetState = () => {
    setStep("method");
    setCard({ number: "", name: "", expiry: "", cvc: "" });
    setAddr({ street: "", number: "", zip: "", city: "" });
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) {
      if (step === "done") onSuccess();
      onOpenChange(false);
      setTimeout(resetState, 300);
    }
  };

  const isCardValid =
    card.number.replace(/\s/g, "").length >= 16 &&
    card.name.length > 1 &&
    card.expiry.length === 5 &&
    card.cvc.length >= 3;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl max-h-[92vh] overflow-y-auto">

        {/* ── MÉTODO ── */}
        {step === "method" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Como deseja pagar?
              </DialogTitle>
              <DialogDescription>
                Total: <strong className="text-orange-500">{fmt(total)}</strong>
              </DialogDescription>
            </DialogHeader>

            <RadioGroup
              value={method}
              onValueChange={(v) => setMethod(v as PayMethod)}
              className="gap-3 pt-2"
            >
              {([
                { value: "card", icon: <CreditCard size={20} className="text-orange-500" />, title: "Cartão de Crédito / Débito", sub: "Pagamento seguro via Stripe" },
                { value: "pix",  icon: <QrCode     size={20} className="text-emerald-500" />, title: "Pix",                        sub: "Instantâneo e sem taxas" },
              ] as const).map((opt) => (
                <Label
                  key={opt.value}
                  htmlFor={opt.value}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    method === opt.value
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30"
                      : "border-border/40 hover:border-border"
                  }`}
                >
                  <RadioGroupItem value={opt.value} id={opt.value} className="sr-only" />
                  {opt.icon}
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">{opt.title}</p>
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

        {/* ── CARTÃO ── */}
        {step === "card" && (
          <>
            <DialogHeader>
              <Button
                variant="ghost" size="sm"
                className="self-start -ml-2 mb-1 w-fit text-muted-foreground"
                onClick={() => setStep("method")}
              >
                <ChevronLeft size={15} className="mr-1" /> Voltar
              </Button>
              <DialogTitle className="text-xl font-semibold">Dados do cartão</DialogTitle>
              <DialogDescription>
                Total: <strong className="text-orange-500">{fmt(total)}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-1">
              <FieldGroup label="Número do cartão" htmlFor="cc-number">
                <Input id="cc-number" placeholder="0000 0000 0000 0000"
                  value={card.number} onChange={handleCardField("number")}
                  maxLength={19} className="h-11 rounded-xl font-mono" />
              </FieldGroup>

              <FieldGroup label="Nome no cartão" htmlFor="cc-name">
                <Input id="cc-name" placeholder="Como impresso no cartão"
                  value={card.name} onChange={handleCardField("name")}
                  className="h-11 rounded-xl" />
              </FieldGroup>

              <div className="grid grid-cols-2 gap-3">
                <FieldGroup label="Validade" htmlFor="cc-expiry">
                  <Input id="cc-expiry" placeholder="MM/AA"
                    value={card.expiry} onChange={handleCardField("expiry")}
                    maxLength={5} className="h-11 rounded-xl" />
                </FieldGroup>
                <FieldGroup label="CVV" htmlFor="cc-cvc">
                  <Input id="cc-cvc" placeholder="123"
                    value={card.cvc} onChange={handleCardField("cvc")}
                    maxLength={4} className="h-11 rounded-xl" />
                </FieldGroup>
              </div>

              <Separator />
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                Endereço de entrega
              </p>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <FieldGroup label="Rua / Av." htmlFor="addr-street">
                    <Input id="addr-street" placeholder="Ex: Rua das Flores"
                      value={addr.street} onChange={handleAddrField("street")}
                      className="h-11 rounded-xl" />
                  </FieldGroup>
                </div>
                <FieldGroup label="Número" htmlFor="addr-number">
                  <Input id="addr-number" placeholder="123"
                    value={addr.number} onChange={handleAddrField("number")}
                    className="h-11 rounded-xl" />
                </FieldGroup>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FieldGroup label="CEP" htmlFor="addr-zip">
                  <Input id="addr-zip" placeholder="00000-000"
                    value={addr.zip} onChange={handleAddrField("zip")}
                    className="h-11 rounded-xl" />
                </FieldGroup>
                <FieldGroup label="Cidade" htmlFor="addr-city">
                  <Input id="addr-city" placeholder="Sua cidade"
                    value={addr.city} onChange={handleAddrField("city")}
                    className="h-11 rounded-xl" />
                </FieldGroup>
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
                variant="ghost" size="sm"
                className="self-start -ml-2 mb-1 w-fit text-muted-foreground"
                onClick={() => setStep("method")}
              >
                <ChevronLeft size={15} className="mr-1" /> Voltar
              </Button>
              <DialogTitle className="text-xl font-semibold">Pagar com Pix</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col items-center gap-4 py-2">
              <div className="w-44 h-44 rounded-2xl bg-white flex flex-col items-center justify-center border-4 border-orange-500 gap-2">
                <QrCode size={72} className="text-gray-700" aria-hidden />
                <span className="text-xs text-gray-500">QR Code Pix</span>
              </div>
              <p className="text-muted-foreground text-sm">Escaneie com o app do seu banco</p>
              <p className="text-orange-500 font-bold text-2xl">{fmt(total)}</p>
              <div className="w-full bg-muted rounded-xl p-3 text-xs text-muted-foreground font-mono break-all leading-relaxed">
                00020126580014br.gov.bcb.pix0136...chave-pix-exemplo@email.com
              </div>
            </div>

            <Button
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl"
              onClick={() => { onSuccess(); onOpenChange(false); }}
            >
              <CheckCircle2 size={16} className="mr-2" /> Já paguei
            </Button>
          </>
        )}

        {/* ── PROCESSANDO ── */}
        {step === "processing" && (
          <div className="flex flex-col items-center gap-4 py-14">
            <span className="text-6xl animate-spin" aria-hidden>⏳</span>
            <p className="font-semibold text-lg">Processando pagamento...</p>
            <p className="text-muted-foreground text-sm text-center">
              Aguarde, estamos confirmando com o Stripe
            </p>
          </div>
        )}

        {/* ── CONCLUÍDO ── */}
        {step === "done" && (
          <div className="flex flex-col items-center gap-4 py-10">
            <CheckCircle2 size={68} className="text-emerald-500" aria-hidden />
            <p className="font-bold text-2xl text-emerald-500">Pedido confirmado!</p>
            <p className="text-muted-foreground text-sm text-center">
              Você receberá uma confirmação em breve. Obrigado!
            </p>
            <Button
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl mt-2"
              onClick={() => handleOpenChange(false)}
            >
              Perfeito! ✓
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── sub-componente auxiliar ─────────────────────────────────
function FieldGroup({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-xs text-muted-foreground uppercase tracking-wide">
        {label}
      </Label>
      {children}
    </div>
  );
}
