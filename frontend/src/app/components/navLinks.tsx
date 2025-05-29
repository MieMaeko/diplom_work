import Link from 'next/link';

interface LinkType {
  name: string;
  href: string;
}

interface NavLinksProps {
  links: LinkType[];
}

const NavLinks: React.FC<NavLinksProps> = ({ links }) => {
  return (
    <ul>
      {links.map((link) => (
        <li
        key={link.name}
        className={link.href === '/#' ? 'li-drop' : undefined}
      >
          <Link href={link.href}>{link.name}</Link>
          
          {link.href === '/#' && (
            <ul className="drop-menu">
              <li>
                <hr className='menu-line'/>
                <Link href={'/catalog/cake'}>Торты</Link>
              </li>
              <li>
                <hr className='menu-line'/>
               <Link href={'/catalog/dessert'}>Десерты</Link>
              </li>
            </ul>
          )}
          
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;
