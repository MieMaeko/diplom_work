'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles/admin.module.scss';
// import { OrderStatus } from '@shared/enums/order-status.enum';
import axios from 'axios';
interface Order {
  orders_id: number;
  user_name: string;
  user_phone: string;
  user_email: string;
  address: string;
  delivery_date: string;
  status: string;
  // можно добавить items, total_price и т.д.
}
export enum OrderStatus {
  ОФОРМЛЕН = 'оформлен',
  ГОТОВИТСЯ = 'готовится',
  В_ДОСТАВКЕ = 'в доставке',
  ДОСТАВЛЕН = 'доставлен',
}
export default function AdminPage() {

  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'planned'>('all');
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get('/api/user/profile', { withCredentials: true });
        if (res.data.role !== 'admin') {
          router.push('/user/profile');
        }
      } catch (error) {
        router.push('/logout');
      }
    };
     const fetchOrders = async () => {
      try {
        const res = await axios.get(`/api/orders?filter=${filter}`);
        setOrders(res.data);
      } catch (err) {
        console.error('Ошибка при получении заказов:', err);
      }
    };
    fetchOrders();
    checkAdmin();
  }, [router, filter]);

   const handleStatusChange = async (orderId: number, status: string) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => (o.orders_id === orderId ? { ...o, status } : o))
      );
    } catch (err) {
      console.error('Ошибка при обновлении статуса:', err);
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
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Заказы</h1>

        <div className="mb-4">
          <label>
            <input
              type="radio"
              value="all"
              checked={filter === 'all'}
              onChange={() => setFilter('all')}
              className="mr-1"
            />
            Все
          </label>
          <label className="ml-4">
            <input
              type="radio"
              value="planned"
              checked={filter === 'planned'}
              onChange={() => setFilter('planned')}
              className="mr-1"
            />
            Запланированные
          </label>
        </div>

        <table className="w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Пользователь</th>
              <th className="border px-2 py-1">Телефон</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Адрес</th>
              <th className="border px-2 py-1">Дата доставки</th>
              <th className="border px-2 py-1">Статус</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order.orders_id} className="text-center">
                <td className="border px-2 py-1">{order.orders_id}</td>
                <td className="border px-2 py-1">{order.user_name}</td>
                <td className="border px-2 py-1">{order.user_phone}</td>
                <td className="border px-2 py-1">{order.user_email}</td>
                <td className="border px-2 py-1">{order.address}</td>
                <td className="border px-2 py-1">{order.delivery_date}</td>
                <td className="border px-2 py-1">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.orders_id, e.target.value)}
                    className="border p-1"
                  >
                    {Object.values(OrderStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        Пользователи
        <table id='users'>
          <thead>
            <tr><th>Данные пользователей</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Имя</td>
              <td>Информация</td>
              <td>История заказов</td>
            </tr>
            <tr></tr>
          </tbody>
        </table>
        <button>Сохранить</button>
      </div>
      <div>
        Товары
        <table id='goods'>
          <thead>
            <tr><th>Товары</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Название</td>
              <td>Цена за 1 кг</td>
              <td></td>
              <td>Категория</td>
              <td>Тип</td>
              <td>Статус</td>
            </tr>
            <tr></tr>
          </tbody>
        </table>
        <button>Добавить новый товар</button>
        <button>Сохранить</button>
      </div>
      <form action=""></form>
    </div>
  )
}