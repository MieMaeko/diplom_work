'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Select, { components } from 'react-select';
import Image from 'next/image';
import styles from './styles/admin.module.scss';
import arrowSvg from '../../../../public/icons/arrow.svg';
import axios from 'axios';
import { typeTranslations, categorTranslations } from '@/app/lib/translations';

interface Item {
  id: number;
  quantity: number;
  price: number;
  weight: number;
  product: {
    name: string;
    img: string;
    type: string;
  };
  filling: {
    name: string;
  };
}

interface Order {
  order_id: number;
  user_name: string;
  user_phone: string;
  user_email: string;
  address: string;
  delivery_date: string;
  status: string;
  items: Item[];
}
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  orders: Order[];
}
export enum OrderStatus {
  ОФОРМЛЕН = 'оформлен',
  ГОТОВИТСЯ = 'готовится',
  В_ДОСТАВКЕ = 'в доставке',
  ДОСТАВЛЕН = 'доставлен',
}

const statusOptions = [
  { value: 'оформлен', label: 'оформлен', color: '#D9D9D9' },
  { value: 'готовится', label: 'готовится', color: '#2C3BA9' },
  { value: 'готов к доставке', label: 'готов к доставке', color: '#EE3686' },
  { value: 'доставлен', label: 'доставлен', color: '#5EC4BA' },
];

const inStockOptions = [
  { value: true, label: 'в наличии', color: '#88DEA5' },
  { value: false, label: 'нет в наличии', color: '#EB6363' },
];

const orderId = 'order';

const DropdownIndicator = (props: any) => {
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

const customStyles = {
  control: (base: any) => ({
    ...base,
    border: '2px solid #B36750',
    borderRadius: '8px',
    backgroundColor: '#FFF6E7',
    fontSize: '24px',
    width: '240px',
    boxShadow: 'none',
    '&:hover': {
      border: '2px solid #B36750',
    },
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: '#FFF6E7',
    width: '240px',
    zIndex: 9999,
  }),
  option: (base: any, state: any) => ({
    ...base,
    fontSize: '24px',
    backgroundColor: state.isFocused ? '#f1e4d3' : '#FFF6E7',
    color: '#B36750',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  }),
  singleValue: (base: any) => ({
    fontSize: '24px',
    ...base,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#B36750',
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    color: '#B36750',
    padding: '0 8px',
  }),
  indicatorSeparator: () => ({ display: 'none' }),
};


const formatOptionLabel = ({ label, color }: any) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <span style={{
      width: 20,
      height: 20,
      borderRadius: '50%',
      backgroundColor: color,
      display: 'inline-block',
    }} />
    {label}
  </div>
);

export default function AdminPage() {

  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<'all' | 'planned' | 'done'>('all');
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    type: '',
    in_stock: true,
    image: null as File | null,
  });


  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await axios.get('/api/user/profile', { withCredentials: true });
        if (response.data.role !== 'admin') {
          router.push('/user/profile');
        }
      } catch (error) {
        router.push('/logout');
      }
    };
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/api/orders?filter=${filter}`);
        setOrders(response.data);
      } catch (err) {
        console.error('Ошибка при получении заказов:', err);
      }
    };
    async function fetchUsers() {
      try {
        const response = await axios.get('/api/user/admin/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке пользователей:', error);
      }
    };
    async function fetchProducts() {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Ошибка при получении товаров:', error);
      }
    }
    fetchProducts();
    fetchOrders();
    fetchUsers();
    checkAdmin();
  }, [router, filter]);

  const handleStatusChange = async (orderId: number, status: string) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => (o.order_id === orderId ? { ...o, status } : o))
      );
    } catch (err) {
      console.error('Ошибка при обновлении статуса:', err);
    }
  };

  const handleInStockChange = async (productId: number, inStock: boolean) => {
    try {
      await axios.patch(`/api/products/${productId}`, { in_stock: inStock });
      setProducts((prev) =>
        prev.map((prod) =>
          prod.id === productId ? { ...prod, in_stock: inStock } : prod
        )
      );
    } catch (err) {
      console.error('Ошибка при обновлении in_stock:', err);
    }
  };

  return (
    <div className={styles['admin-work']}>
      <h3>Админ панель</h3>
      <div className={styles.helper}>
        <button onClick={() => document.getElementById('orders')?.scrollIntoView({ behavior: 'smooth' })}>
          Заказы
        </button>
        <button onClick={() => document.getElementById('users')?.scrollIntoView({ behavior: 'smooth' })}>
          Пользователи
        </button>
        <button onClick={() => document.getElementById('goods')?.scrollIntoView({ behavior: 'smooth' })}>
          Товары
        </button>
      </div>
      <div >
        <h4 id="orders">Заказы</h4>
        <div className={styles['order-filters']}>
          <label>
            <input
              type="radio"
              value="all"
              checked={filter === 'all'}
              onChange={() => setFilter('all')}
            />
            Все
          </label>
          <label>
            <input
              type="radio"
              value="planned"
              checked={filter === 'planned'}
              onChange={() => setFilter('planned')}
            />
            Запланированные
          </label>
          <label>
            <input
              type="radio"
              value="done"
              checked={filter === 'done'}
              onChange={() => setFilter('done')}
              className="mr-1"
            />
            Готовые
          </label>
        </div>

        <table id='users' className={styles['user-table']}>
          <thead>
            <tr>
              <th>№</th>
              <th>Данные</th>
              <th>Адрес</th>
              <th>Товары</th>
              <th>Дата доставки</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order.order_id}>
                <td id={orderId + order.order_id}>{order.order_id}</td>
                <td>
                  <p>{order.user_name}</p>
                  <p>{order.user_phone}</p>
                  <p>
                    {order.user_email}</p>


                </td>
                <td>{order.address}</td>
                <td>
                  {order.items.map((item: any) => (
                    <div key={item.id} className={styles['order-item']}>
                      <Image
                        src={`/images/catalog/${item.product.type}/${item.product.img}`}
                        width={50}
                        height={50}
                        alt={item.product.name}
                      />
                      <span>{item.product.name}</span>
                      <span> x {item.quantity}</span>
                      <span> — {item.price * item.quantity} руб</span>
                      <span>Начинка: {item.filling.name}</span>
                    </div>
                  ))}
                </td>
                <td>{order.delivery_date}</td>
                <td>
                  <Select
                    isSearchable={false}
                    value={statusOptions.find(opt => opt.value === order.status)}
                    options={statusOptions}
                    styles={customStyles}
                    components={{ DropdownIndicator }}
                    formatOptionLabel={formatOptionLabel}
                    onChange={(selected) => {
                      if (selected) {
                        handleStatusChange(order.order_id, selected.value);
                      }
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h4 id="users">Пользователи</h4>
        <table>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Информация</th>
              <th>История заказов</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>
                  <p>Email: {user.email}</p>
                  <p>Тел.: {user.phone}</p>
                  <p>Адрес: {user.address}</p>
                </td>
                <td>
                  {user.orders && user.orders.length > 0 ? (
                    user.orders.map((order) => (
                      <p key={order.order_id} onClick={() => document.getElementById(`${orderId + order.order_id}`)?.scrollIntoView({ behavior: 'smooth' })}>
                        Заказ №{order.order_id}
                      </p>
                    ))
                  ) : (
                    <span>Нет заказов</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h4 id="goods">Товары</h4>
        <input type="text" placeholder='Поиск' />
        <button className={styles['create-product-button']} onClick={() => setShowForm(true)}>Добавить новый товар</button>
        <table>
          <thead>
            <tr>
              <th>Название</th>
              <th>Цена за 1 кг</th>
              <th>Категория</th>
              <th>Тип</th>
              <th>Статус</th>
              <th>Изображение</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr key={index}>
                <td>{p.name}</td>
                <td>{p.price} руб</td>
                <td>{categorTranslations[p.category]}</td>
                <td>{typeTranslations[p.type]}</td>
                <td>
                  <Select
                    isSearchable={false}
                    value={inStockOptions.find(opt => opt.value === p.in_stock)}
                    options={inStockOptions}
                    styles={customStyles}
                    components={{ DropdownIndicator }}
                    formatOptionLabel={formatOptionLabel}
                    onChange={(selected) => {
                      if (selected) {
                        handleInStockChange(p.id, selected.value);
                      }
                    }}
                  />
                </td>
                <td>
                  <Image
                    src={`/images/catalog/${p.type}/${p.img}`}
                    width={60}
                    height={60}
                    alt={p.name}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>



        {showForm && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <span className={styles.closeButton} onClick={() => setShowForm(false)}>×</span>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const formData = new FormData();
                    formData.append('name', newProduct.name);
                    formData.append('price', newProduct.price);
                    formData.append('category', newProduct.category);
                    formData.append('type', newProduct.type);
                    formData.append('in_stock', newProduct.in_stock ? '1' : '0');
                    if (newProduct.image) formData.append('image', newProduct.image);

                    await axios.post('/api/products', formData, {
                      headers: { 'Content-Type': 'multipart/form-data' },
                    });

                    setShowForm(false);
                    setNewProduct({
                      name: '',
                      price: '',
                      category: '',
                      type: '',
                      in_stock: true,
                      image: null,
                    });
                    const updated = await axios.get('/api/products');
                    setProducts(updated.data);
                  } catch (error) {
                    console.error('Ошибка при добавлении товара:', error);
                  }
                }}
                className={styles['product-form']}
              >
                <h4>Добавить товар</h4>
                <input type="text" placeholder="Название" required value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                <input type="number" placeholder="Цена" required value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                <input type="text" placeholder="Категория" value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />
                <input type="text" placeholder="Тип (папка)" value={newProduct.type}
                  onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })} />
                <label>
                  <input
                    type="checkbox"
                    checked={newProduct.in_stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, in_stock: e.target.checked })
                    }
                  />
                  В наличии
                </label>
                <input type="file" accept="image/*"
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files?.[0] || null })} />

                <button type="submit">Сохранить товар</button>
              </form>
            </div>
          </div>
        )}

      </div>

    </div>
  )
}