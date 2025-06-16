'use client'
// import axios from "axios";
import Select, { components, StylesConfig, DropdownIndicatorProps } from 'react-select';
import { useParams } from 'next/navigation';
import axios from '../../api/axiosConfig'
import { useEffect, useState } from "react";
import Image from 'next/image';
import localforage from "localforage";
import styles from "./styles/product.module.scss"
import md5 from 'md5';

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
interface Addon {
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
  uid: string;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  weight: number;
  type: string;
  img: string;
  fillingId: number;
  filling: string;
  addons: string[];
}

const customStyles: StylesConfig<OptionType, false> = {
  option: (provided, state) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: state.isSelected ? '#f0f0f0' : 'white',
  }),
  singleValue: (provided) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center',
  }),
  control: (provided) => ({
    ...provided,
    minWidth: 250,
  }),
};
const customArrowStyles = (isOpen: boolean) => ({
  transition: 'transform 0.3s ease',
  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
});

const CustomArrow = (props: DropdownIndicatorProps<OptionType, false>) => {
  const { selectProps, innerProps, isFocused } = props;
  const isOpen = selectProps.menuIsOpen;

  return (
    <components.DropdownIndicator {...props}>
      <span
        style={{
          ...customArrowStyles(isOpen),
          color: isFocused ? 'blue' : 'black', 
        }}
        {...innerProps} 
      >
        ▼
      </span>
    </components.DropdownIndicator>
  );
};
export default function ProductPage() {
  const { id } = useParams();
  const productId = Number(id);
  const [product, setProduct] = useState<Product | null>(null);
  const [weight, setWeight] = useState(0.5);
  const [fillings, setFillings] = useState<Filling[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [selectedFilling, setSelectedFilling] = useState<OptionType | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const options: OptionType[] = fillings.map((filling) => ({
    value: filling.id,
    label: filling.name,
    img: filling.img,
  }));

  useEffect(() => {
    if (options.length > 0 && !selectedFilling) {
      setSelectedFilling(options[0]);
    }
  }, [options, selectedFilling]);


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
    if (!productId) return;
    axios
      .get(`/products/product/${productId}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.log('Ошибка', error);
      });

    const loadFillings = async () => {
      const cached = await localforage.getItem<Filling[]>('fillings');
      if (cached) {
        setFillings(cached);
      } else {
        const res = await axios.get('/fillings');
        setFillings(res.data);
        localforage.setItem('fillings', res.data);
      }
    };

    const loadAddons = async () => {
      const cached = await localforage.getItem<Addon[]>('addons');
      if (cached) {
        setAddons(cached);
      } else {
        const res = await axios.get('/addons');
        setAddons(res.data);
        localforage.setItem('addons', res.data);
      }
    };

    loadFillings();
    loadAddons();

  }, [productId]);
  const generateCartUID = (
    productId: number,
    fillingId: number,
    weight: number,
    addons: string[]
  ) => {
    const key = `${productId}-${fillingId}-${weight}-${addons.sort().join(',')}`;
    return md5(key);
  };
  const addToCart = async () => {
    const selectedFillingId = selectedFilling?.value || 0;
    const selectedFillingName = fillings.find(f => f.id === selectedFillingId)?.name || 'Неизвестная начинка';
    const uid = generateCartUID(productId, selectedFillingId, weight, selectedAddons);
    const cart = (await localforage.getItem<CartItem[]>('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.uid === uid);

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += 1;
    } else {
      cart.push({
        uid,
        productId,
        name: product!.name,
        price: product!.price * weight,
        quantity: 1,
        weight,
        type: product!.type,
        img: product!.img,
        fillingId: selectedFillingId,
        filling: selectedFillingName,
        addons: selectedAddons,
      });
    }

    await localforage.setItem('cart', cart);
    console.log('Добавлено в корзину!');
  };
  if (!product) return <div>Ошибка загрузки товара</div>;
  return (
    <div className={styles.product}>
      <h3>{product.name}</h3>
      <p>Собрать</p>
      <p>Выбирайте начинку и вес торта. В комментариях уточните, если хотите изменить: цвет крема, параметры декора и тд. Фантазируйте, а мы реализуем!</p>
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
            <div>
              <p>Допы</p>
              {addons.map(addon => (
                <label key={addon.id}>
                  <input
                    type="checkbox"
                    value={addon.name}
                    checked={selectedAddons.includes(addon.name)}
                    onChange={e => {
                      const isChecked = e.target.checked;
                      setSelectedAddons(prev =>
                        isChecked ? [...prev, addon.name] : prev.filter(a => a !== addon.name)
                      );
                    }}
                  />
                  {addon.name}
                </label>
              ))}
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