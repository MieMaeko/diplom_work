
import "@/styles/globals.scss";
import { ReactNode } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function RootLayout({children,} :
   {children: ReactNode;}) 
  {
  return (
    <html lang="en">
      <body>
        <Header/>
        <main>
          {children} {/* Контент страницы */}
        </main>
        <Footer/>
      </body>
    </html>
  );
}
