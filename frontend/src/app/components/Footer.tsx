import Link from "next/link"
import { footerLinks } from "../lib/footer-links"
import Image from "next/image";

export default function Footer() {
  return (
    <footer>
      <div className="footer-back">
        <div className="footer-content">
          <h3>Sweetlana</h3>

          <div className="footer-menu">
            {footerLinks.map((section, index) => (
              <div key={index}>
                {section.links ? (
                  <>
                    {section.links.map((link, i) => (
                      <p key={i}>
                        <Link key={i} href={link.href}>
                          {link.name}
                        </Link>
                      </p>
                    ))}
                  </>
                ) : (
                  <>
                    <p>
                      <Link href={`/catalog/${section.type}`}>
                        {section.title}
                      </Link>
                    </p>
                    {section.categories.map(({ key, label }) => (
                      <p key={key} className="footer-categories">
                        <Link key={key} href={`/catalog/${section.type}?category=${key}`}>
                          {label}
                        </Link>
                      </p>
                    ))}
                  </>
                )}
              </div>
            ))}

            <div>
              <p>Контакты</p>
              <p>+7 (905) 736 66 61</p>
              <div className="icons">
                <Image
                  src={'/icons/telegram.svg'}
                  alt={'tg'}
                  height={35}
                  width={35} />
                <Image
                  src={'/icons/whatsapp.svg'}
                  alt={'whatsapp'}
                  height={35}
                  width={35} />
              </div>
            </div>
          </div>
          <p className="rights">© Sweetlana. 2023-2025. Все права защищены</p>
        </div>
      </div>
    </footer>
  );
}