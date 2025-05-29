'use client'
import axios from "axios";
import Select, { components, SingleValue } from 'react-select';
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Image from 'next/image';
import localforage from "localforage";
import styles from "./styles/product.module.scss"

interface Product {
  id: number;
  name: string;
  price: number;
  img: string;
  type: string;
}
interface Filling {
  id: number;
  name: string;
  img: string;
}

interface OptionType {
  value: number;
  label: string;
  img: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  type: string;
  quantity: number;
  weight: number;
  filling: string;
  img: string;
}

const customArrowStyles = (isOpen: boolean) => ({
  transition: 'transform 0.3s ease',
  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
});

const CustomArrow = (props: any) => {
  const { selectProps } = props;
  const isOpen = selectProps.menuIsOpen;

  return (
    <components.DropdownIndicator {...props}>
      <span style={{ ...customArrowStyles(isOpen) }}>▼</span>
    </components.DropdownIndicator>
  );
};

export default function ProductPage() {
  const { id } = useParams();
  const productId = Number(id);
  const [product, setProduct] = useState<Product | null>(null);
  const [weight, setWeight] = useState(0.5);
  const [fillings, setFillings] = useState<Filling[]>([]);
  const [selectedFilling, setSelectedFilling] = useState<OptionType | null>(null);

  const options: OptionType[] = fillings.map((filling) => ({
    value: filling.id,
    label: filling.name,
    img: filling.img,
  }));
  useEffect(() => {
    if (options.length > 0 && !selectedFilling) {
      setSelectedFilling(options[0]);
    }
  }, [options]);
  const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      backgroundColor: state.isSelected ? '#f0f0f0' : 'white',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
    }),
    control: (provided: any) => ({
      ...provided,
      minWidth: 250,
    }),
  };
  const formatOptionLabel = (option: OptionType) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Image
        src={`/images/filling/cake/${option.img}`}
        alt={option.label}
        height={80}
        width={100}
        layout="responsive"
        objectFit="cover"
      />
      <span>{option.label}</span>
    </div>
  );

  useEffect(() => {
    if (productId) {
      axios
        .get(`/api/products/product/${productId}`)
        .then((response) => {
          setProduct(response.data);
        })
        .catch((error) => {
          console.log('Ошибка', error);
        });
      axios
        .get('/api/filling')
        .then((response) => {
          setFillings(response.data);
        })
        .catch((error) => {
          console.log('Ошибка при получении начинок', error);
        });
    }
  }, [productId]);

  if (!product) return <div>Ошибка</div>;

  const addToCart = async () => {
    const cart = (await localforage.getItem<CartItem[]>('cart')) || [];
    const existingProductIndex = cart.findIndex((item) => item.id === productId);
    const selectedFillingName = selectedFilling
    && fillings.find(f => f.id === selectedFilling.value)?.name || 'Неизвестная начинка';
    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += 1;
    } else {
      cart.push({
        id: productId,
        name: product.name,
        type: product.type,
        price: product.price,
        quantity: 1,
        img: product.img,
        filling: selectedFillingName,
        weight,
      });
    }

    await localforage.setItem('cart', cart);
    console.log('Товар добавлен в корзину!');
    console.log(cart)
  };
  return (
    <div className={styles.product}>
      <h3>{product.name}</h3>
      <p>Собрать</p>
      <div className={styles["product-info"]}>
        <div>
          <Image
            src={`/images/catalog/${product.type}/${product.img}`}
            alt={product.name}
            width={575}
            height={525}
          // layout="responsive"
          />
        </div>
        <div className={styles['form-order']}>
          <div>

            <label htmlFor="filling-select">Выберите начинку:</label>
            <Select
              id="filling-select"
              options={options}
              formatOptionLabel={formatOptionLabel}
              components={{ DropdownIndicator: CustomArrow }}
              styles={customStyles}
              value={selectedFilling}
              isSearchable={false}
              onChange={(option) => setSelectedFilling(option)}
            />

            {/* <p>Начинка</p> */}

            {/* <Select
              options={options}
              components={{ DropdownIndicator: CustomArrow }}
              classNamePrefix="custom-select"
              isSearchable={false}
              value={selectedFilling}
              onChange={(option: SingleValue<OptionType>) => setSelectedFilling(option)}
            /> */}
          </div>
          <div>
            <div>
              <p>Вес</p>
              <select value={weight} onChange={(e) => setWeight(Number(e.target.value))}>
                <option value="0.5">0.5кг</option>
                <option value="1">1 кг</option>
                <option value="1.5">1.5 кг</option>
                <option value="2">2 кг</option>
              </select>
            </div>
            <p>Допы</p>
            <select>
              <option value="">adad</option>
              <option value="">avv</option>
            </select>
            <div>
              <p>Комментарий к заказу</p>
              <input type="text" />
            </div>
          </div>
          <div>
            <button onClick={addToCart} className={styles.addCart}>Добавить в корзину</button>
            <span>Цена: {product.price * weight} руб</span>
          </div>
        </div>
      </div>

    </div>
  )
}