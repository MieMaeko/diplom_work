
import "@/styles/globals.scss";
import { ReactNode } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

const links = [
  { name:'Каталог', href:'/catalog'},
  { name:'Контакты',href:'/contacts'},
  { name:'Конструктор торта', href:'/builder'},
  { name:'О нас', href:'/about'},
];

export default function RootLayout({children,} :
   {children: ReactNode;}) 
  {
  return (
    <html lang="en">
      <body>
        {/* <Header links={links}/> */}
        <Header/>
        <main>
          {children} {/* Контент страницы */}
        </main>
        <Footer/>
      </body>
    </html>
  );
}
