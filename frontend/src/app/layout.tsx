'use client';

import "@/styles/globals.scss";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";


export default function RootLayout({
  children,

}: {
  children: ReactNode;

}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isAboutPage = pathname === "/about";
  const beige1Class = isHomePage ? "home-beige" : isAboutPage ? "about-beige" : "default-beige";
  const pink1Class = isHomePage ? "home-pink" : isAboutPage ? "about-pink" : "default-pink";
  return (
    <html lang="en">
      <body>
        <header className={beige1Class}>
          <div className={pink1Class}>
            <div className="navigation">
              <h3>Sweetlana</h3>
              <nav className="menu">
                <ul>
                  <li>Каталог</li>
                  <li>Контакты</li>
                  <li>Конструктор торта</li>
                  <li>О нас</li>
                </ul>
              </nav>
              <div className="header-icons">
                <img src="/icons/shooping-cart.svg" alt="" />
                <img src="/icons/profile.svg" alt="" />
              </div>
            </div>
          </div>
        </header>
        <main>
          {children} {/* Контент страницы */}
        </main>
        <footer>
          <div className="footer_back">
            <h3>Sweetlana</h3>
            <div className="footer_menu">
              <div>
                <p>Конструктор торта</p>
                <p>Доставка</p>
                <p>О нас</p>
              </div>
              <div>
                <p>Торты</p>
                <p>детские</p>
                <p>бисквитные</p>
                <p>свадебные</p>
                <p>антигравитация</p>
                <p>в шаре</p>
                <p>муссовые</p>
                <p>прочее</p>
              </div>
              <div>
                <p>Десерты</p>
                <p>капкейки</p>
                <p>пирожные</p>
                <p>куличи</p>
                <p>наборы</p>
                <p>десерты</p>
              </div>
              <div>

              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
