import Link from 'next/link';

interface LinkType {
  name: string;
  href: string;
}

interface NavLinksProps {
  links: LinkType[];
  handleScroll?: () => void;
  isBurgerMenu?: boolean;
  onLinkClick?: (event: React.MouseEvent) => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ links, handleScroll, isBurgerMenu, onLinkClick }) => {
  return (
    <ul>
      {links.map((link) => {
        const isAnchorToDelivery = link.href === '/about#delivery';

        return (
          <li
            key={link.name}
            className={link.href === '/#' ? 'li-drop' : undefined}
          >
            <Link
              href={link.href}
              onClick={(
                isAnchorToDelivery
                  ? (e) => {
                    e.preventDefault();
                    handleScroll?.();
                  }
                  : (e) => {
                    if (isBurgerMenu && onLinkClick) {
                      onLinkClick(e); 
                    }
                  }
              )}
            >
              {link.name}
            </Link>

            {link.href === '/#' && (
              <ul className="drop-menu">
                <li>
                  <hr className="menu-line" />
                  <Link href="/catalog/cake">Торты</Link>
                </li>
                <li>
                  <hr className="menu-line" />
                  <Link href="/catalog/dessert">Десерты</Link>
                </li>
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default NavLinks;
