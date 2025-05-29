'use client'

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
// import CategorTranslate from '@/app/components/СategorTranslate';
import styles from "./styles/catalog.module.scss"
import Products from '@/app/components/Products';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  img: string;
}
const typeTranslations: { [key: string]: string } = {
  cake: "Торты",
  dessert: "Десерты"
};
const categoryTranslations: { [key: string]: { [key: string]: string } } = {
  cake: {
    child: "Детские",
    biscuit: "Бисквитные",
    wedding: "Свадебные",
    gravit: "Антигравитация",
    ball: "В шаре",
    muss: "Муссовые",
    others: "Другие"
  },
  dessert: {
    cupcakes: "Капкейки",
    pies: "Пирожные",
    kuliches: "Куличи",
    sets: "Сеты",
    desserts: "Десерты",
    rulets: "Рулеты",
    breads: "Пряники"
  }
};
export default function CatalogPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const type = params.type && (Array.isArray(params.type) ? params.type[0] : params.type);
  const categoryFromQuery = searchParams.get('category') || '';

  const [sortOrder, setSortOrder] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromQuery);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const filterRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (type) {
      axios
        .get(`/api/products/type/${type}`)
        .then((response) => {
          setProducts(response.data)
        })
        .catch((error) => {
          console.log('Ошибка запроса', error)
        })
    }
    setSelectedCategory(categoryFromQuery);
    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };

  }, [type, categoryFromQuery]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      filterRef.current &&
      !filterRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsFilterOpen(false);
    }
  };

  const filters = type && categoryTranslations[type] ? categoryTranslations[type] : {};
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const filteredBySearch = filteredProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedProducts = [...filteredBySearch].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.price - b.price;
    } else if (sortOrder === 'desc') {
      return b.price - a.price;
    }
    return 0;
  });
  return (
    <div className={styles.catalog}>
      <h2>{type && typeTranslations[type] ? typeTranslations[type] : 'Тип не выбран'}</h2>
      <div className={styles['search-filters']} style={{ position: 'relative' }} >
        <input
          type="text"
          placeholder="Поиск"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Цена</option>
          <option value="asc">По возрастанию</option>
          <option value="desc">По убыванию</option>
        </select>
        <button
          type="button"
          onClick={() => setIsFilterOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={isFilterOpen}
          ref={buttonRef}
        >
          Фильтр
        </button>
        <button
          className={styles['clear-filter']}
          onClick={() => {
            setSelectedCategory('');
            setSearchTerm('');
            setSortOrder('');  
          }}
          disabled={!selectedCategory && !searchTerm && !sortOrder}
          aria-label="Сбросить все фильтры"
        >
          Сбросить фильтр
        </button>
      </div>
      <div className={styles['search-filters']}>
        {isFilterOpen && (
          <div
            ref={filterRef}
            className={styles['filter-dropdown']}
            role="listbox"
            tabIndex={-1}
          >
            {Object.entries(filters).map(([key, label]) => (
              <label key={key} style={{ display: 'block', padding: '4px 8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="category"
                  value={key}
                  checked={selectedCategory === key}
                  onChange={() => {
                    setSelectedCategory(key);
                    setIsFilterOpen(false);
                  }}
                  style={{ marginRight: 8 }}
                />
                {label}
              </label>
            ))}
          </div>
        )}
      </div>

      {type ? (
        <Products products={sortedProducts} type={type} />
      ) : (
        <p>Такого товара нет</p>
      )}
    </div>
  );
};


