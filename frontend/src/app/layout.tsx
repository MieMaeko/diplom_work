
import "@/styles/globals.scss";
import { ReactNode } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartPopup from "./components/cart-popup/CartPopUp";
import { CartProvider } from "./context/CartContext";

export default function RootLayout({ children, }:
  { children: ReactNode; }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <CartPopup />
          <main>
            {children} {/* Контент страницы */}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
