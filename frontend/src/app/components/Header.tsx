'use client';

import { usePathname } from "next/navigation";
import Link from 'next/link';
export default function Header(){
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isAboutPage = pathname === "/about";
  const isCatalog = pathname === '/catalog';
  const beige1Class = isHomePage ? "home-beige" : isAboutPage ? "about-beige" : isCatalog ? "catalog-beige" : "default-beige";
  const pink1Class = isHomePage ? "home-pink" : isAboutPage ? "about-pink" :  isCatalog ? "catalog-pink" : "default-pink";
  const links = [
    {
      name:'Каталог',
      href:'/catalog'
    },
    {
      name:'Контакты',
      href:'/contacts'
    },
    {
      name:'Конструктор торта',
      href:'/builder'
    },
    {
      name:'О нас',
      href:'/about'
    }
  ]
  return(
    <header className={beige1Class}>
          <div className={pink1Class}>
            <div className="navigation">
              <Link key={'home'} href={'/'}>
                <h3>Sweetlana</h3>
              </Link>
              <nav className="menu">
                <ul>
                  {links.map(link=>{
                    return (
                      <Link
                      key={link.name}
                      href={link.href}>
                        <li>{link.name}</li>
                      </Link>
                    )
                  })}
                </ul> 
              </nav>
              <div className="header-icons">
                <img src="/icons/shooping-cart.svg" alt="" />
                <img src="/icons/profile.svg" alt="" />
              </div>
            </div>
          </div>
        </header>
  )
}