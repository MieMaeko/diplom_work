'use client';

import React, { useEffect, useState } from "react";
import Categor from "./Categor";
import axios from "axios";
import styles from "@/styles/page.module.scss";

interface CategoriesProps {
  type: string;
}

interface Category {
  category: string;
  img: string;
  type: string;
}

export default function Categories({ type }: CategoriesProps) {
  const [goods, setGoods] = useState<Category[]>([]);   
  
  useEffect(() => {
    axios
      .get(`http://localhost:3000/categories/${type}`)
      .then((response) => setGoods(response.data))
      .catch((error) => console.error("Ошибка при получении данных:", error));
  }, [type]);

  return (
    <div className={styles.categories}>
      {goods.map((good) => (
        <Categor key={good.category} category={good.category} img={good.img} type={type} />
      ))}
    </div>
  );
}