import Link from 'next/link';
import Image from 'next/image';
import { categorTranslations } from '@/app/lib/translations';
interface CategorProps {
  category: string;
  img: string;
  type: string;
}

export default function Categor({ category, img, type }: CategorProps) {
  return (
    <Link key={category} href={`/catalog/${type}?category=${category}`}>
      <div>
        <Image
          src={`/images/catalog/${type}/${img}`}
          alt={category}
          height={290}
          width={320} />
        <p>{categorTranslations[category]}</p>
      </div>
    </Link>

  );
}