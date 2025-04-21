'use client';

import React, { useEffect, useState } from 'react';
import Categor from './Categor';
import styles from "@/styles/page.module.scss";
import axios from 'axios';

// interface Category {
//   
// }
interface CategoriesProps {
  type: string;
}

interface Product {
  id: number;
  name: string;
  img: string;
  type: string;
  category: string;
}
const categoryTranslations: { [key: string]: string } = {
  child: "Детские",
  biscuit: "Бисквитные",
  wedding: "Свадебные",
  gravit: "Антигравитация",
  ball: "В шаре",
  muss: "Муссовые",
  others: "Другие",
  cupcakes:"Капкейки",
  pies:"Пирожные",
  kuliches:"Куличи",
  sets:"Сеты",
  desserts:"Десерты",
  rulets:"Рулеты",
  breads:"Пряники"
};
const Categories: React.FC<CategoriesProps> = ({type}) =>{
  const [categories, setCategories] = useState<Product[]>([]);

  useEffect(()=>{
    axios
    .get(`/api/products/${type}`)
    .then((response)=>{
      setCategories(response.data);
    })
    .catch((error)=>{
      console.log('Error', error);
    });
  },[type]);

  return (
    <div className={styles.categories}>
      {categories.map((category) => (
          <Categor key={category.id} category={categoryTranslations[category.category]} img={category.img} type={type} />
      ))}
    </div>
  );
};

export default Categories;



