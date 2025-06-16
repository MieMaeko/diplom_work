'use client'
import React, { useEffect, useState } from 'react';
import Categor from './Categor';
import styles from "@/styles/page.module.scss";
// import axios from 'axios';
import axios from '../api/axiosConfig'
interface CategoriesProps {
  type: string;
}

interface Categories {
  id: number;
  name: string;
  img: string;
  type: string;
  category: string;
}

const Categories: React.FC<CategoriesProps> = ({ type }) => {
  const [categories, setCategories] = useState<Categories[]>([]);

  useEffect(() => {
    axios
      .get(`/products/type/${type}`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.log('Error', error);
      });
  }, [type]);

  return (
    <div className={styles.categories}>
      {categories
        .filter((value, index, self) =>
          index === self.findIndex((t) => t.category === value.category)
        )
        .map(({ id, category, img }) => (
          <Categor key={id} category={category} img={img} type={type} />
        ))}
    </div>
  );
};

export default Categories;



