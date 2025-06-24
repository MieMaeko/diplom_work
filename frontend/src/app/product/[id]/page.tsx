'use client'
// import axios from "axios";
import Select, { components, DropdownIndicatorProps, StylesConfig, OptionProps, CSSObjectWithLabel } from 'react-select';
import { useParams } from 'next/navigation';
import axios from '../../api/axiosConfig'
import { useEffect, useState } from "react";
import Image from 'next/image';
import localforage from "localforage";
import styles from "./styles/product.module.scss"
import md5 from 'md5';
import { apiUrl } from '@/app/lib/config';
import arrowSvg from '../../../../public/icons/arrow.svg';
import { useCart } from '@/app/context/CartContext'
import { AnimatedMenu } from '@/app/components/AnimatedMenu';
interface Product {
  id: number;
  name: string;
  price: number;
  img: string;
  type: string;
  amount: number;
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
  addons: { id: number; name: string }[];
  amount?: number;
}
const weightOptions = [
  { value: 0.5, label: '0.5 кг' },
  { value: 1, label: '1 кг' },
  { value: 1.5, label: '1.5 кг' },
  { value: 2, label: '2 кг' },
];
const createCustomStyles = <Option, IsMulti extends boolean = false>(): StylesConfig<Option, IsMulti> => ({
  control: (base) => ({
    ...base,
    border: '3px solid #B36750',
    borderRadius: '8px',
    backgroundColor: '#FFF6E7',
    fontSize: '24px',
    width: '540px',
    boxShadow: 'none',
    '&:hover': {
      border: '3px solid #B36750',
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#FFF6E7',
    width: '540px',
    border: '2px solid #B36750',
    borderRadius: '8px',
    zIndex: 9999,
  }),
  option: (base, state: OptionProps<Option, IsMulti>) => ({
    ...base,
    fontSize: '24px',
    backgroundColor: state.isFocused ? '#f1e4d3' : '#FFF6E7',
    color: '#B36750',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  }),
  singleValue: (base) => ({
    ...base,
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#B36750',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: '#B36750',
    padding: '0 8px',
  }),
  indicatorSeparator: () => ({ display: 'none' }),
});

const GenericDropdownIndicator = <
  Option,
  IsMulti extends boolean = false
>(
  props: DropdownIndicatorProps<Option, IsMulti>
) => {
  const { menuIsOpen } = props.selectProps;
  return (
    <components.DropdownIndicator {...props}>
      <Image
        src={arrowSvg}
        alt="Стрелка"
        width={16}
        height={16}
        style={{
          transition: 'transform 0.4s ease',
          transform: menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      />
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
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [quantity, setQuantity] = useState(1);
  const { addItem, openPopup } = useCart()
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
        src={`${apiUrl}/images/filling/cake/${option.img}`}
        alt={option.label}
        height={80}
        width={100}

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
    addons: Addon[]
  ) => {
    const addonNames = addons.map(a => a.name).sort().join(',');
    const key = `${productId}-${fillingId}-${weight}-${addonNames}`;
    return md5(key);
  };
  const addToCart = async () => {
    const selectedFillingId = selectedFilling?.value || 0
    const selectedFillingName =
      fillings.find(f => f.id === selectedFillingId)?.name || 'Неизвестная начинка'
    const uid = generateCartUID(productId, selectedFillingId, weight, selectedAddons);
    const isDessert = product!.type === 'dessert';
    const usedWeight = isDessert ? 1 : weight;

    const newItem: CartItem = {
      uid,
      productId,
      name: product!.name,
      price: isDessert
        ? product!.price * quantity
        : product!.price * weight * quantity,
      quantity,
      weight: usedWeight,
      type: product!.type,
      img: product!.img,
      fillingId: selectedFillingId,
      filling: selectedFillingName,
      addons: selectedAddons,
      amount: product!.amount,
    };
    addItem(newItem)
    openPopup()
  };
  const fillingStyles = createCustomStyles<OptionType>();
  const weightStyles = createCustomStyles<{ value: number; label: string }>();
  if (!product) return <div>Ошибка загрузки товара</div>;
  return (
    <div className={styles.product}>
      <h3>{product.name}</h3>
      <p>Собрать</p>

      <div className={styles["product-info"]}>
        <div className={styles.view}>
          <Image
            src={`${apiUrl}/images/catalog/${product.type}/${product.img}`}
            alt={product.name}
            width={575}
            height={525}
          />
        </div>
        <div className={styles['form-order']}>
          <div>
            <p>Начинка</p>
            <Select
              id="filling-select"
              options={options}
              formatOptionLabel={formatOptionLabel}
              components={{ DropdownIndicator: GenericDropdownIndicator, Menu: AnimatedMenu, }}
              styles={fillingStyles}
              value={selectedFilling}
              isSearchable={false}
              onChange={(option) => setSelectedFilling(option)}
            />
          </div>
          {product.type === 'dessert' && (
            <div>
              <p>Количество в наборе: {product.amount}</p>
            </div>
          )}
          {product.type === 'dessert' && (
            <div>
              <p>Выберите количество наборов</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  style={{
                    width: '32px',
                    height: '32px',
                    fontSize: '24px',
                    borderRadius: '6px',
                    border: '2px solid #B36750',
                    background: '#FFF6E7',
                    color: '#B36750',
                    cursor: 'pointer',
                  }}
                >–</button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(prev => prev + 1)}
                  style={{
                    width: '32px',
                    height: '32px',
                    fontSize: '24px',
                    borderRadius: '6px',
                    border: '2px solid #B36750',
                    background: '#FFF6E7',
                    color: '#B36750',
                    cursor: 'pointer',
                  }}
                >+</button>
              </div>
            </div>
          )}
          <div>
            {product.type !== 'dessert' && (
              <div>
                <p>Вес</p>
                <Select
                  options={weightOptions}
                  value={weightOptions.find(option => option.value === weight)}
                  onChange={(selected) => setWeight(selected?.value || 0.5)}
                  styles={weightStyles}
                  components={{ DropdownIndicator: GenericDropdownIndicator, Menu: AnimatedMenu }}
                  isSearchable={false}
                />
              </div>
            )}
            <div>
              <p>Топпинги</p>
              <div className={styles.addons}>
                {addons.map(addon => (
                  <label key={addon.id} className={styles.checkboxContainer}>
                    <input
                      type="checkbox"
                      checked={selectedAddons.some(a => a.id === addon.id)}
                      onChange={e => {
                        const isChecked = e.target.checked;
                        setSelectedAddons(prev =>
                          isChecked
                            ? [...prev, addon]
                            : prev.filter(a => a.id !== addon.id)
                        );
                      }}
                    />
                    <span className={styles.customCheckbox}></span>
                    {addon.name}
                  </label>
                ))}
              </div>

            </div>
          </div>
          <div>
            <button onClick={addToCart} className={styles.addCart}>Добавить в корзину</button>
            <span>
              Цена:{' '}
              {product.type === 'dessert'
                ? product.price * quantity
                : product.price * weight
              } руб
            </span>
          </div>
        </div>
      </div>
      <div className={styles.warningBlock}>
        <p>Про хранение</p>
        <ul>
          <li>Кондитерское изделие следует хранить только в холодильнике при температуре от +2 до +7℃.</li>
          <li>Хранить лучше всего в коробке, она защитит их от заветривания и поможет уберечь от посторонних запахов.</li>
          <li>Максимальный срок хранения — 72 часа. Не употребляйте оставшееся на третьи и более сутки. Мы используем только натуральные продукты без консервантов, поэтому изделия имеют ограниченный срок хранения.</li>
          <li>Для получения ярких цветов крема используются пищевые красители. Они могут оставить цвет во рту и на коже, это безопасно и как правило смывается в течение нескольких часов.</li>
          <li>В изделии могут присутствовать несъедобные элементы - крепления для фигурок и различного другого декора. В некоторых фигурках и цветочных композициях может быть использована кондитерская проволока, шпажки, палочки. Это несъедобно. Будьте аккуратны, давая декор детям.</li>
          <li>Обязательно предупредите нас, есть ли у вас или ваших гостей на празднике аллергия на какие-либо продукты, чтобы мы их не использовали.</li>
        </ul>
      </div>
    </div>
  )
}