import Link from "next/link";

interface CategorProps {
    category: string;  // Название категории
    img: string;  // Путь к изображению
    type: string;  // Тип товара (например, 'cake', 'dessert')
  }
  
  export default function Categor({ category, img, type }: CategorProps) {
    return (
      <Link key={category} href={`/catalog/${type}/${category}`}>
         <div>
          <img src={`images/catalog/${type}/${img}`} alt={category} />
          <p>{category}</p>
        </div>
      </Link>
   
    );
  }