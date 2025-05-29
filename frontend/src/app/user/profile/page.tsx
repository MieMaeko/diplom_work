'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './styles/profile.module.scss'
import Image from 'next/image';
import { Span } from 'next/dist/trace';
import EditableField from '@/app/components/EditableField';

interface Order {
  orders_id: number;
  delivery_date: string;
  total_price: number;
  status: string;
  items: { id: number; name: string; price: number; quantity: number, img: string }[];
}
interface User {
  name: string;
  email: string;
  phone: string;
  login: string;
  img: string;
  address: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [input, setInput] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/user/profile', { withCredentials: true });
        if (response.data?.id) {
          setUser(response.data);
          fetchUserOrders();
        }
      } catch (error) {
        console.log('Error fetching user profile', error);
      }
    };

    const fetchUserOrders = async () => {
      try {
        const response = await axios.get('/api/orders/my', { withCredentials: true });
        setOrders(response.data);
      } catch (error) {
        console.log('Error fetching orders', error);
      }
    };

    fetchUserProfile();
    fetchUserOrders();
  }, []);


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
                alt={user.img} />
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
          <button className={styles['settings-button']}>Сохранить изменения</button>
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
                  <table key={order.orders_id}>
                    <tbody>
                      <tr>
                        <td>Заказ №</td>
                        <td>Товары</td>
                        <td>Количество</td>
                        <td>Сумма заказа</td>
                        <td>Дата доставки</td>
                        <td>Статус</td>
                      </tr>
                      <tr>
                        <td>{order.orders_id}</td>
                        <td>
                          {order.items.map((item) => (
                            <div key={item.id}>
                              <Image
                                src={`/images/catalog/cake/${item.img}`}
                                width={80}
                                height={80}
                                alt={item.name}
                              />
                              {item.name} — {item.price} руб (x{item.quantity})
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
