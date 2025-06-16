'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './styles/profile.module.scss'
import Image from 'next/image';
// import { useForm } from 'react-hook-form';
import EditableField from '@/app/components/EditableField';

interface Order {
  order_id: number;
  delivery_date: string;
  total_price: number;
  status: string;
  items: {
    productId: number;
    fillingId: number;
    quantity: number;
    weight: number;
    price: number;
    name?: string;
    img?: string;
    type?: string;
  }[];
}
interface User {
  name: string;
  email: string;
  phone: string;
  img: string;
  address: string;
  orders?: Order[];
}
export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/user/profile', { withCredentials: true });
        if (response.data?.id) {
          const { orders, ...userData } = response.data;

          const updatedOrders = await Promise.all(
            orders.map(async (order: Order) => {
              const enrichedItems = await Promise.all(order.items.map(async (item) => {
                try {
                  const productRes = await axios.get(`/api/products/product/${item.productId}`);
                  const product = productRes.data;
                  return {
                    ...item,
                    name: product.name,
                    img: product.img,
                    type: product.type
                  };
                } catch (err) {
                  if (axios.isAxiosError(err)) {
                    console.error(`Ошибка загрузки товара ID ${item.productId}:`, err.response?.status);
                  }
                  return item;
                }
              }));

              return {
                ...order,
                items: enrichedItems
              };
            })
          );

          setUser(userData);
          setOrders(updatedOrders);
        }
      } catch (error) {
        console.log('Error fetching user profile', error);
      }
    };

    fetchUserProfile();
  }, []);


  const handleLogout = async () => {
    try {
      await axios.post('/api/user/logout', {}, { withCredentials: true });
      window.location.href = '/';
    } catch (error) {
      console.error('Ошибка при выходе', error);
    }
  };
  const saveField = async (fieldName: keyof User, newValue: string) => {
    try {
      await axios.put('/api/user/profile', { [fieldName]: newValue }, { withCredentials: true });
      setUser(prev => prev ? { ...prev, [fieldName]: newValue } : prev);
    } catch (e) {
      console.error(`Ошибка при сохранении ${fieldName}`, e);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.profile}>
      <div className={styles['profile-header']}>
        <div className={styles['avatar']}>
          <div className={styles['circle-avatar']}>
            {user.img ? (
              <Image
                src={user.img}
                width={180}
                height={180}
                alt="Аватар пользователя" />
            )
              : (
                <Image
                  src="/icons/profile.svg"
                  width={100}
                  height={100}
                  alt="avatar"
                />
              )}
          </div>
          <div className={styles['circle-change']}>
            <Image
              src="/icons/change.svg"
              width={50}
              height={50}
              alt='change' />
          </div>
        </div>

        <h3>{user.name ? (
          <span>{user.name}</span>
        ) :
          (
            <span>User</span>
          )}</h3>
      </div>
      <button onClick={handleLogout} className={styles['settings-button']}>Выйти из аккаунта</button>
      <div className={styles['profile-info']}>
        <div className={styles.settings}>
          <EditableField
            label="Имя"
            value={user.name}
            onSave={(val) => saveField('name', val)}
          />
          <hr />
          <EditableField
            label="Почта"
            value={user.email}
            type="email"
            onSave={(val) => saveField('email', val)}
          />
          <hr />
          <EditableField
            label="Телефон"
            value={user.phone}
            type="tel"
            onSave={(val) => saveField('phone', val)}
          />
          <hr />
          <EditableField
            label="Адрес"
            value={user.address}
            onSave={(val) => saveField('address', val)}
          />

        </div>
        <div className={styles.orders}>
          <h4>Мои заказы:</h4>
          <div>
            {orders === null ? (
              <p>Загрузка заказов...</p>
            ) : orders.length === 0 ? (
              <p>Нет заказов</p>
            ) : (
              <div>
                {orders.map(order => (
                  <table key={order.order_id}>
                    <thead>
                      <tr>
                        <td>Заказ №</td>
                        <td>Товары</td>
                        <td>Количество</td>
                        <td>Сумма заказа</td>
                        <td>Дата доставки</td>
                        <td>Статус</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{order.order_id}</td>
                        <td>
                          {order.items.map((item, index) => (
                            <div key={index}>
                              {item.img && item.type && (
                                <Image
                                  src={`/images/catalog/${item.type}/${item.img}`}
                                  width={80}
                                  height={80}
                                  alt={item.name || 'Товар'}
                                />
                              )}
                              {item.name || `Товар ${item.productId}`} — {item.price} руб (x{item.quantity})
                            </div>
                          ))}
                        </td>
                        <td>Кол-во</td>
                        <td>{order.total_price} руб</td>
                        <td>{order.delivery_date}</td>
                        <td>{order.status}</td>
                      </tr>
                    </tbody>
                  </table>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
