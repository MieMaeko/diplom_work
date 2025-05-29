'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from "next/navigation";
import Link from 'next/link';
import BurgerMenu from "./burger-menu/BurgerMenu";
import NavLinks from "./navLinks";
import Image from 'next/image';
import AuthForm from './auth-form/AuthForm';
import { useRouter } from 'next/navigation';
import axios from 'axios';
export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isAboutPage = pathname === "/about";
  // const isCatalog = pathname.includes("/catalog") || pathname.includes("/product") || pathname.includes("/profile");
  const beige1Class = isHomePage ? "home-beige" : isAboutPage ? "about-beige" : "catalog-beige";
  const pink1Class = isHomePage ? "home-pink" : isAboutPage ? "about-pink" : "catalog-pink";
  const links = [
    {
      name: 'Каталог',
      href: '/#'
    },
    {
      name: 'Контакты',
      href: '/contacts'
    },
    {
      name: 'Конструктор торта',
      href: '/builder'
    },
    {
      name: 'О нас',
      href: '/about'
    }
  ]
  const links2 = [
    {
      name: 'Конструктор торта',
      href: '/builder'
    },
    {
      name: 'Доставка',
      href: '/delivery'
    },
    {
      name: 'О нас',
      href: '/about'
    },
    {
      name: 'Торты',
      href: '/cake'
    },
    {
      name: 'Десерты',
      href: '/cake'
    }
  ]
  const [showForm, setShowForm] = useState(false);
  const [isReg, setIsReg] = useState(true);
  const [user, setUser] = useState<any>(null); 
  const [itemCount, setItemCount] = useState(0);
  const router = useRouter();  

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/user/profile', { withCredentials: true }); 
        if (response.data?.id) {
          setUser(response.data);  
        } else {
          setUser(null);  
        }
      } catch (error) {
        console.log('Error fetching user profile', error);
        setUser(null);  
      }
    };
    fetchUserProfile();  
  }, []);

  const handleProfileClick = () => {
    if (user) {
      router.push('/user/profile');
    } else {
      setShowForm(true);
    }
  };

  const handleSubmit = () => {
    setShowForm(false); 
  };
  return (
    <header className={beige1Class}>
      <div className={pink1Class}>
        <div className="navigation">
          <Link key={'home'} href={'/'}>
            <h3>Sweetlana</h3>
          </Link>
          <nav className="menu">
            <NavLinks links={links} />
          </nav>
          <div className="header-icons">
            <div style={{ position: 'relative' }}>
              <Link key={'cart'} href={'/cart'}>
                <Image
                  src="/icons/shooping-cart.svg"
                  alt="cart"
                  height={51}
                  width={51} />
              </Link>
              {itemCount > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: 'red',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '5px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {itemCount}
                </div>
              )}
            </div>
            <Image
              src="/icons/profile.svg"
              alt="profile"
              height={51}
              width={51}
              onClick={handleProfileClick} />
            <BurgerMenu links={links2} />
            {showForm && (
              <AuthForm
                onSubmit={handleSubmit}
                isReg={isReg}
                setIsReg={setIsReg}
                setShowForm={setShowForm}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  )
}