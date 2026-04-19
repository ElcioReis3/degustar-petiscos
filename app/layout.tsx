import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Degustar Petiscos — Delivery & Catálogo",
  description: "O melhor petisco da cidade. Faça sua reserva agora mesmo.",
  metadataBase: new URL("https://degustar-petiscos-cx.netlify.app/"),
  openGraph: {
    title: "Degustar Petiscos 🍢",
    description: "Confira nosso cardápio e peça agora!",
    url: "https://degustar-petiscos-cx.netlify.app/",
    siteName: "Degustar Petiscos",
    images: [
      {
        url: "/image/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Degustar Petiscos",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${jakarta.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
