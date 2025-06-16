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
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300);
  };
    const handleLinkClick = (event: React.MouseEvent) => {
    if (event.target instanceof HTMLElement && event.target.closest(`.${styles['menu-block']}`)) {
      handleClose(); 
    }
  };

  return (
    <div className={styles.burger}>
      <div
        className={`${styles['burger-icon']} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        aria-label="Toggle menu"
        tabIndex={0}
      >
        <div className={styles.line1}></div>
        <div className={styles.line2}></div>
        <div className={styles.line3}></div>
      </div>

      {isOpen && <div className={`${styles.overlay} ${styles.active}`}></div>}

      <div className={`${styles['menu-block']} ${isOpen ? styles.open : ''} ${isClosing ? styles.closing : ''}`}>
        <span className={styles.close} onClick={handleClose}>X</span>
        <nav className={styles.menu}>
          <NavLinks links={links} onLinkClick={handleLinkClick} isBurgerMenu={true} />
        </nav>
      </div>
    </div>
  );
};

export default BurgerMenu;