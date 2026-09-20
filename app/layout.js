import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/AppProvider";
import { CartProvider } from "@/components/CartProvider";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Xadicha Cosmetics",
  description: "Kosmetika mahsulotlari — Telegram do'koni",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="uz"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="afterInteractive" />
      </head>
      <body className="min-h-full flex flex-col">
        <AppProvider>
          <CartProvider>
            <div className="mx-auto w-full max-w-lg flex-1 pb-20">{children}</div>
            <BottomNav />
          </CartProvider>
        </AppProvider>
      </body>
    </html>
  );
}
