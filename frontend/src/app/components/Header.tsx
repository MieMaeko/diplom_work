'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from "next/navigation";
import Link from 'next/link';
import BurgerMenu from "./burger-menu/BurgerMenu";
import NavLinks from "./navLinks";
import Image from 'next/image';
import AuthForm from './auth-form/AuthForm';
import { useRouter } from 'next/navigation';
import { mainLinks, mobileLinks } from '../lib/nav-links';
import axios from 'axios';
// import localforage from 'localforage';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}
export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isAboutPage = pathname === "/about";
  // const isCatalog = pathname.includes("/catalog") || pathname.includes("/product") || pathname.includes("/profile");
  const beige1Class = isHomePage ? "home-beige" : isAboutPage ? "about-beige" : "catalog-beige";
  const pink1Class = isHomePage ? "home-pink" : isAboutPage ? "about-pink" : "catalog-pink";
  const [showForm, setShowForm] = useState(false);
  const [isReg, setIsReg] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  // const [itemCount, setItemCount] = useState(0);
  const [scrollToDelivery, setScrollToDelivery] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (scrollToDelivery && pathname === "/about") {
      const timeout = setTimeout(() => {
        document.getElementById("delivery")?.scrollIntoView({ behavior: "smooth" });
        setScrollToDelivery(false);
      }, 100);
      return () => clearTimeout(timeout);
    }
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
  }, [pathname, scrollToDelivery]);

  const handleProfileClick = () => {
    if (user) {
      router.push('/user/profile');
    } else {
      setShowForm(true);
    }
  };
  const handleCartClick = () => {
    router.push('/cart')
  };
  const handleScroll = () => {
    if (pathname !== "/about") {
      setScrollToDelivery(true);
      router.push("/about");
    } else {
      document.getElementById("delivery")?.scrollIntoView({ behavior: "smooth" });
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
            <NavLinks links={mainLinks}  isBurgerMenu={false} handleScroll={handleScroll} />
          </nav>
          <div className="header-icons">
            {/* <div style={{ position: 'relative' }}> */}
            <Image
              src="/icons/shopping-cart.svg"
              alt="cart"
              height={51}
              width={51}
              onClick={handleCartClick} />
            {/* {itemCount > 0 && (
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
              )} */}
            {/* </div> */}

            <Image
              src="/icons/profile.svg"
              alt="profile"
              height={51}
              width={51}
              onClick={handleProfileClick} />
            <BurgerMenu links={mobileLinks} />

          </div>
        </div>
      </div>
      {showForm && (
        <AuthForm
          onSubmit={handleSubmit}
          isReg={isReg}
          setIsReg={setIsReg}
          setShowForm={setShowForm}
        />
      )}
    </header>
  )
}