import Link from 'next/link';

interface CategorProps {
  category: string;
  img: string;
  type: string;
  link: string
}

  export default function Categor({ category, img, type,link }: CategorProps) {
    return (
      <Link key={link} href={`/catalog/${type}/${link}`}>
      <div>
        <img src={`images/catalog/${type}/${img}`} alt={category} />
        <p>{category}</p>
      </div>
    </Link>
   
    );
  }