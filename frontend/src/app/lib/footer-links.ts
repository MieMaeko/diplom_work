// /src/lib/footer-links.ts
import { categoryTranslations } from './translations'; // твой объект с переводами

export const footerLinks = [
  {
    title: 'Конструктор',
    links: [
      { name: 'Конструктор торта', href: '/builder' },
      { name: 'Доставка', href: '/about#delivery' },
      { name: 'О нас', href: '/about' },
    ],
  },
  {
    title: 'Торты',
    type: 'cakes',
    categories: Object.entries(categoryTranslations.cake).map(([key, label]) => ({
      key,
      label,
    })),
  },
  {
    title: 'Десерты',
    type: 'desserts',
    categories: Object.entries(categoryTranslations.dessert).map(([key, label]) => ({
      key,
      label,
    })),
  },
];