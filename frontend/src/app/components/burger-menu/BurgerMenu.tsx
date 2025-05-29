'use client';

import { useState } from 'react';
import styles from './burger-menu.module.scss';
import NavLinks from '../navLinks';


interface LinkType {
    name: string;
    href: string;
  }
interface BurgerMenuProps {
    links: LinkType[];  
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ links }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.burger}>
      <div className={styles["burger-icon"]} onClick={()=>setIsOpen(!isOpen)}>
        <div className={isOpen ? styles.cross : ''}></div>
        <div className={isOpen ? styles.cross : ''}></div>
        <div className={isOpen ? styles.cross : ''}></div>
      </div>
      {isOpen && <div className={styles.overlay} ></div>}
      <div className={`${styles["menu-block"]} ${isOpen ? styles.open : ''}`}>
        <span className={styles.close} onClick={() => setIsOpen(false)}>X</span>
        <nav className={styles.menu}>
          <NavLinks links={links}/>
        </nav>
      </div>
    </div>
  );
};

export default BurgerMenu;