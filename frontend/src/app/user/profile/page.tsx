'use client'
import { useEffect, useState } from 'react';
// import axios from 'axios';
import axios from '../../api/axiosConfig'
import styles from './styles/profile.module.scss'
import Image from 'next/image';
// import { useForm } from 'react-hook-form';
import { apiUrl } from '@/app/lib/config';
import EditableField from '@/app/components/EditableField';
import { statusColors } from '../../../../types/order-status';
import { OrderStatus } from '../../../../types/order-status';
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
    amount?: number;
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
  role?: string;
}
export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/user/profile', { withCredentials: true });
        if (response.data?.id) {
          const { orders, ...userData } = response.data;

          const updatedOrders = await Promise.all(
            orders.map(async (order: Order) => {
              const enrichedItems = await Promise.all(order.items.map(async (item) => {
                try {
                  const productRes = await axios.get(`/products/product/${item.productId}`);
                  const product = productRes.data;
                  return {
                    ...item,
                    name: product.name,
                    img: product.img,
                    type: product.type
                  };
                } catch {
                  // if (err) {
                  //   console.error(`Ошибка загрузки товара ID ${item.productId}:`, err.status);
                  // }
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
      await axios.post('/user/logout', {}, { withCredentials: true });
      window.location.href = '/';
    } catch (error) {
      console.error('Ошибка при выходе', error);
    }
  };
  const saveField = async (fieldName: keyof User, newValue: string) => {
    try {
      await axios.put('/user/profile', { [fieldName]: newValue }, { withCredentials: true });
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
          {/* <div className={styles['circle-change']}>
            <Image
              src="/icons/change.svg"
              width={50}
              height={50}
              alt='change' />
          </div> */}
        </div>

        <h3>{user.name ? (
          <span>{user.name}</span>
        ) :
          (
            <span>User</span>
          )}</h3>
      </div>
      <div className={styles['profile-buttons']}>
        <button onClick={handleLogout} className={styles['settings-button']}>Выйти из аккаунта</button>
        {user.role === 'admin' && (
          <button className={styles['admin-button']} onClick={() => window.location.href = '/user/admin'}>
            Админ-панель
          </button>
        )}
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
                <div className={styles.desktopOnly}>
                  {orders.map(order => (
                    <table key={order.order_id}>
                      <thead>
                        <tr>
                          <td>Заказ №</td>
                          <td>Товары</td>
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
                                    src={`${apiUrl}/images/catalog/${item.type}/${item.img}`}
                                    width={80}
                                    height={80}
                                    alt={item.name || 'Товар'}
                                  />
                                )}
                                <p>{item.name || `Товар ${item.productId}`} — {item.price} руб (x{item.quantity})</p>
                                {item.type === 'dessert' && item.amount !== undefined && (
                                  <p>В наборе {item.amount} штук</p>
                                )}

                                {item.type === 'cake' && item.weight !== undefined && (
                                  <p>Вес: {item.weight} кг</p>
                                )}
                              </div>
                            ))}
                          </td>
                          <td>{order.total_price} руб</td>
                          <td>{order.delivery_date}</td>
                          <td>
                            <span
                              style={{
                                display: 'inline-block',
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: statusColors[order.status as OrderStatus],
                                marginRight: '8px',
                              }}
                            ></span>
                            {order.status}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                  ))}
                </div>
                <div className={styles.mobileOnly}>
                  {orders.map(order => (
                    <div key={order.order_id} className={styles.orderCard}>
                      <p><strong>Заказ №:</strong> {order.order_id}</p>
                      <p><strong>Дата:</strong> {order.delivery_date}</p>
                      <p><strong>Сумма:</strong> {order.total_price} руб</p>
                      <p><strong>Статус:</strong> <span style={{
                        display: 'inline-block',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: statusColors[order.status as OrderStatus],
                        marginRight: '8px',
                      }}></span>{order.status}</p>

                      <div className={styles.cardItems}>
                        {order.items.map((item, index) => (
                          <div key={index} className={styles.cardItem}>
                            {item.img && item.type && (
                              <Image
                                src={`${apiUrl}/images/catalog/${item.type}/${item.img}`}
                                width={60}
                                height={60}
                                alt={item.name || 'Товар'}
                              />
                            )}
                            <div>
                              <p>{item.name || `Товар ${item.productId}`} — {item.price} руб (x{item.quantity})</p>
                              {item.type === 'dessert' && item.amount !== undefined && (
                                <p>В наборе {item.amount} штук</p>
                              )}
                              {item.type === 'cake' && item.weight !== undefined && (
                                <p>Вес: {item.weight} кг</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
