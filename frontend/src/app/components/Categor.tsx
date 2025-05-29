import Link from 'next/link';
import CategorTranslate from './СategorTranslate';
import Image from 'next/image';

interface CategorProps {
  category: string;
  img: string;
  type: string;
}

  export default function Categor({ category, img, type}: CategorProps) {
    return (
      <Link key={category} href={`/catalog/${type}?category=${category}`}>
      <div>
        <Image 
        src={`/images/catalog/${type}/${img}`} 
        alt={category}
        height={290}
        width={320}/>
        <p><CategorTranslate translation={category}/></p>
      </div>
    </Link>
   
    );
  }