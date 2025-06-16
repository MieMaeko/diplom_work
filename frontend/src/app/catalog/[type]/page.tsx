'use client'

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
// import axios from 'axios';
import axios from '../../api/axiosConfig'
import { useSearchParams } from 'next/navigation';
import styles from "./styles/catalog.module.scss"
import Products from '@/app/components/Products';
import { typeTranslations, categoryTranslations } from '@/app/lib/translations';
import Image from 'next/image';
import arrowSvg from '../../../../public/icons/arrow.svg';
import { AnimatedMenu } from '@/app/components/AnimatedMenu';
import dynamic from 'next/dynamic';
import { components, DropdownIndicatorProps, StylesConfig, OptionProps, CSSObjectWithLabel } from 'react-select';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  img: string;
}

interface SortOption {
  value: string;
  label: string;
}

const sortOptions: SortOption[] = [
  { value: '', label: 'По умолчанию' },
  { value: 'asc', label: 'По возрастанию' },
  { value: 'desc', label: 'По убыванию' },
];

const SelectNoSSR = dynamic(() => import('react-select'), { ssr: false }) as unknown as React.FC<
  import('react-select').Props<SortOption, false>
>;

const DropdownIndicator = (props: DropdownIndicatorProps<SortOption, false>) => {
  const { menuIsOpen } = props.selectProps;

  return (
    <components.DropdownIndicator {...props}>
      <Image
        src={arrowSvg}
        alt="Стрелка"
        width={16}
        height={16}
        style={{
          transition: 'transform 0.3s ease',
          transform: menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      />
    </components.DropdownIndicator>
  );
};

const customStyles: StylesConfig<SortOption, false> = {
  control: (base: CSSObjectWithLabel) => ({
    ...base,
    border: '3px solid #B36750',
    borderRadius: '8px',
    backgroundColor: '#FFF6E7',
    fontSize: '24px',
    width: '240px',
    boxShadow: 'none',
    '&:hover': {
      border: '3px solid #B36750',
    },
  }),
  menu: (base: CSSObjectWithLabel) => ({
    ...base,
    backgroundColor: '#FFF6E7',
    width: '240px',
    border: '2px solid #B36750',
    borderRadius: '8px',
    zIndex: 9999,
  }),
  option: (base: CSSObjectWithLabel, state: OptionProps<SortOption, false>) => ({
    ...base,
    fontSize: '24px',
    backgroundColor: state.isFocused ? '#f1e4d3' : '#FFF6E7',
    color: '#B36750',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  }),
  singleValue: (base: CSSObjectWithLabel) => ({
    fontSize: '24px',
    ...base,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#B36750',
  }),
  dropdownIndicator: (base: CSSObjectWithLabel) => ({
    ...base,
    color: '#B36750',
    padding: '0 8px',
  }),
  indicatorSeparator: () => ({ display: 'none' }),
};

const formatOptionLabel = (option: SortOption) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    {option.label}
  </div>
);

export default function CatalogPage() {
  const router = useRouter();
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
      axios.get(`/products/type/${type}`)
        .then((response) => setProducts(response.data))
        .catch((error) => console.log('Ошибка запроса', error));
    }
    setSelectedCategory(categoryFromQuery);
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

  useEffect(() => {
    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isFilterOpen]);

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
    setSortOrder('');
    router.push(`/catalog/${type}`);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchTerm('');
    router.push(`/catalog/${type}?category=${category}`);
  };

  const handleSortChange = (selected: SortOption | null) => {
    if (selected) {
      setSortOrder(selected.value);
      router.push(`/catalog/${type}?category=${selectedCategory}&sortOrder=${selected.value}`);
    }
  };

  const filters = type && categoryTranslations[type] ? categoryTranslations[type] : {};
  const filteredProducts = selectedCategory
    ? products.filter((p: Product) => p.category === selectedCategory)
    : products;

  const filteredBySearch = filteredProducts.filter((p: Product) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredBySearch].sort((a, b) => {
    if (sortOrder === 'asc') return a.price - b.price;
    if (sortOrder === 'desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className={styles.catalog}>
      <h2>{type && typeTranslations[type] ? typeTranslations[type] : 'Тип не выбран'}</h2>

      <div className={styles['search-filters']} style={{ position: 'relative' }}>
        <div className={styles["search-container"]}>
          <input
            type="text"
            placeholder="Поиск"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles["search-input"]}
          />
          <Image src="/icons/search.svg" alt='search' width={30} height={30} className={styles["search-button"]} />
        </div>

        <SelectNoSSR
          value={sortOptions.find((option: SortOption) => option.value === sortOrder) || null}
          onChange={handleSortChange}
          options={sortOptions}
          styles={customStyles}
          components={{ DropdownIndicator, Menu: AnimatedMenu }}
          formatOptionLabel={formatOptionLabel}
          isSearchable={false}
          isMulti={false}
        />

        <div>
          <button
            type="button"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={isFilterOpen}
            ref={buttonRef}
            className={styles['filter']}
          >
            Фильтр
            <Image src="/icons/filter.svg" alt='filter' width={30} height={30} />
          </button>

          <div
            ref={filterRef}
            className={`${styles['filter-dropdown']} ${isFilterOpen ? styles.open : ''}`}
            role="listbox"
            tabIndex={-1}
          >
            {Object.entries(filters).map(([key, label]: [string, string]) => (
              <label key={key} className={styles['radio-label']}>
                <input
                  type="radio"
                  name="category"
                  value={key}
                  checked={selectedCategory === key}
                  onChange={() => handleCategoryChange(key)}
                  className={styles.radio}
                />
                <span className={styles['radio-custom']}></span>
                {label}
              </label>
            ))}
          </div>
        </div>

        <button
          className={styles['clear-filter']}
          onClick={handleClearFilters}
          disabled={!selectedCategory && !searchTerm && !sortOrder}
          aria-label="Сбросить все фильтры"
        >
          Сбросить фильтр
        </button>
      </div>

      {type ? (
        <Products products={sortedProducts} type={type} />
      ) : (
        <p>Такого товара нет</p>
      )}
    </div>
  );
}
