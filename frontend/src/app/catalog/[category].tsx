
import { useRouter } from 'next/router';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Product from '../components/Product'; 
import styles from '@/styles/Catalog.module.scss';

interface ProductType {
  id: number;  
  name: string;
  img: string;
  price: number;
  type: string;
  category: string;
}

export default function CatalogPage() {
  const router = useRouter();
  const { type, category } = router.query;  

  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (type && category) {
      axios
        .get(`http://localhost:3000/categories/${type}/${category}`) 
        .then((response) => {
          setProducts(response.data); 
          setLoading(false);  
        })
        .catch((error) => {
          console.error('Ошибка при загрузке данных:', error);
          setLoading(false);  
        });
    }
  }, [type, category]);

  if (loading) {
    return <div>Loading...</div>;  
  }

  return (
    <div>
      <h2>{category}</h2>
      <div className={styles.products}>
        {products.map((product) => (
          <Product key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}