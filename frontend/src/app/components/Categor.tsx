import Link from 'next/link';
import Image from 'next/image';
import { categorTranslations } from '@/app/lib/translations';
import { apiUrl } from '../lib/config';
interface CategorProps {
  category: string;
  img: string;
  type: string;
}

export default function Categor({ category, img, type }: CategorProps) {
  const imageUrl = `${apiUrl}/images/catalog/${type}/${img}`;
  return (
    <Link key={category} href={`/catalog/${type}?category=${category}`}>
      <div>
        <Image
          src={imageUrl}  
          alt={`Product ${img}`}
          height={290}
          width={320}
        />
        <p>{categorTranslations[category]}</p>
      </div>
    </Link>
  );
}
