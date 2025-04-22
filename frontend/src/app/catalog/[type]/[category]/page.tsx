'use client'

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  price: number;
  img: string;
}

const CatalogPage = () => {
  const router = useRouter();
  const { type, category } = router.query;
  const [products, setProducts] = useState<Product[]>([]);
  console.log('hello')
  console.log(router.query)
  useEffect(() => {
    if (type && category) {
        const url = `api/products/${type}/${category}`;  // Формируем URL
        console.log('Запрос на URL:', url);  // Выводим URL в консоль
        axios
        .get(`api/products/${type}/${category}`)
        .then((response)=>{
            setProducts(response.data)
            console.log(response.data)
        })
        .catch((error)=>{
            console.log('Ошибка запроса', error)
        })
    }
  }, [type, category]);

  return (
    <div>
      <h4>Товары в категории: {category}</h4>
      {/* <div className={styles.products}> */}
      <div>
        {products.map(({id,name,price,img}) => (
          <div key={id}>
            <img src={`images/catalog/${type}/${img}`} alt={name} />
            <p>{name}</p>
            <p>{price} руб.</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogPage;
