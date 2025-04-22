'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import styles from "@/styles/catalog.module.scss";

interface Product {
  id: number;
  name: string;
  price: number;
  img: string;
}

export default function CatalogPage () {
    const { type, category } = useParams();
    const [products, setProducts] = useState<Product[]>([]);
    useEffect(() => {
        if (type && category) {
            axios
            .get(`/api/products/${type}/${category}`)
            .then((response)=>{
                setProducts(response.data)
            })
            .catch((error)=>{
                console.log('Ошибка запроса', error)
            })
        }
    } , [type, category]);

    return (
    <div>
      <h4>Товары в категории: {category}</h4>
      <div className={styles.products}>
        {products.map(({id,name,price,img}) => (
          <div key={id}>
            <img src={`/images/catalog/${type}/${img}`} alt={name} /> 
            <div>
                <p>{name}</p>
                <p>{price} руб.</p>
            </div>
            <button>Оформить</button>
          </div>
        ))}
      </div>
    </div>
    );
};


