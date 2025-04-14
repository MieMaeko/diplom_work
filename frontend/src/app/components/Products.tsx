'use client';

import { useEffect, useState } from "react";
import Product from "./Product"
import axios from "axios";

interface ProductsProps {
    category: string;  // Пропс для типа категории
  }
  export default function Products({ category }: ProductsProps) {
    const [products, setProducts] = useState<any[]>([]); // Локальное состояние для товаров

  useEffect(() => {
    // Получение данных о товарах с бэкенда
    axios
      .get(`http://localhost:3000/products?category=${category}`)
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Ошибка при получении товаров:", error));
  }, [category]); 
    return (
      <div>
        {products
          .filter((product) => product.category === category) // Фильтрация по категории
          .map((product) => (
            <Product
              key={product.id}
              id={product.id}
              name={product.name}
              img={product.img}
              type={product.type}
              price={product.price}
            />
          ))}
      </div>
    );
  }
  