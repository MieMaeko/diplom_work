'use client'
import { useEffect, useState } from 'react';
import localforage from 'localforage';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import styles from './styles/cart.module.scss'


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
export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [userData, setUserData] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        deliveryDate: '',
        deliveryMethod: '',
        paymentMethod: 'cash',
        comment: ''
    });
    const router = useRouter();


    useEffect(() => {
        const fetchCart = async () => {
            const storedCart = (await localforage.getItem<CartItem[]>('cart')) || [];
            setCart(storedCart);
            const total = storedCart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
            setTotalPrice(total);
        };

        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('/api/user/profile', { withCredentials: true })
                if (response.data) {
                    setUserData(response.data);
                    console.log('User profile data:', response.data);
                    setFormData((prevData) => ({
                        ...prevData,
                        name: response.data.name || '',
                        phone: response.data.phone || '',
                        email: response.data.email || '',

                    }));
                } else {
                    console.log('User not authenticated');
                }
            } catch (error) {
                console.log('Error fetching user profile', error);
            }
        };

        if (showModal) {
            const timer = setTimeout(() => {
                router.push('/user/profile');
            }, 2000);
            return () => clearTimeout(timer);
        }
        fetchCart();
        fetchUserProfile();
    }, [showModal]);

    const handleChangeQuantity = async (uid: string, delta: number) => {
        const updated = cart.map(item =>
            item.uid === uid ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        );
        await localforage.setItem('cart', updated);
        setCart(updated);
        setTotalPrice(updated.reduce((sum, i) => sum + i.price * i.quantity, 0));
    };
    const handleRemoveItem = async (itemId: number) => {
        const updatedCart = cart.filter((item) => item.productId !== itemId);
        await localforage.setItem('cart', updatedCart);
        setCart(updatedCart);
        const total = updatedCart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
        setTotalPrice(total);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const isAuthenticated = userData && userData.id;
        if (isAuthenticated) {
            const orderData = {
                user_id: userData.id,
                user_name: userData.name || formData.name,
                user_phone: userData.phone || formData.phone,
                user_email: formData.email,
                address: formData.address,
                delivery_date: formData.deliveryDate,
                delivery_method: formData.deliveryMethod,
                total_price: totalPrice,
                status: 'оформлен',
                comment: formData.comment,
                items: cart.map(item => ({
                    productId: item.productId,
                    fillingId: item.fillingId,
                    addons: item.addons,
                    quantity: item.quantity,
                    weight: item.weight,
                    price: item.price,
                }))
            };

            console.log(orderData)
            try {
                await axios.post('/api/orders', orderData);
                await localforage.removeItem('cart');
                setCart([]);
                setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    address: '',
                    deliveryDate: '',
                    deliveryMethod: '',
                    paymentMethod: 'cash',
                    comment: ''
                });
                setShowModal(true);

            } catch (error) {
                console.log('Ошибка при оформлении заказа:', error);
            }
        } else {
            alert('Пожалуйста, авторизуйтесь для оформления заказа.');
            // router.push('/login'); // Перенаправление на страницу логина
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className={styles['make-order']}>
            <h3>Корзина</h3>
            <section>
                {cart.length === 0 ? <p>Корзина пуста</p> : (
                    <div className={styles.products}>
                        {cart.map((item) => (
                            <div className={styles.product} key={item.productId}>
                                <Image
                                    className={styles['item-img']}
                                    src={`/images/catalog/${item.type}/${item.img}`}
                                    width={150}
                                    height={150}
                                    alt={item.name}
                                />
                                <div>
                                    <p>Торт "{item.name}"</p>
                                    <p>Начинка: {item.filling}</p>
                                    <p>Кол-во в коробке:</p>
                                </div>
                                <div>
                                    <p>{item.price} руб</p>
                                    <p className={styles.quantityProduct}>
                                        <span className={styles.changeQuantity} onClick={() => handleChangeQuantity(item.uid, -1)}>–</span>
                                        <span>{item.quantity}</span>
                                        <span className={styles.changeQuantity} onClick={() => handleChangeQuantity(item.uid, +1)}>+</span>
                                    </p>
                                    <p>{item.price * item.quantity} руб</p>

                                    <Image
                                        className={styles.trash}
                                        src={'/icons/trash1.svg'}
                                        alt='trash'
                                        width={30}
                                        height={30}
                                        onClick={() => handleRemoveItem(item.productId)}
                                    />
                                </div>
                                {/* <hr /> */}
                            </div>
                        ))}
                        <h2>Итого: {totalPrice} руб</h2>

                    </div>
                )}
                <div className={styles.order}>
                    <h4>Оформление заказа</h4>
                    <form onSubmit={handleSubmit} className={styles['order-block']}>
                        <div>
                            <p>Способы доставки</p>
                            <label>
                                <input
                                    type="radio"
                                    name="deliveryMethod"
                                    value="pickup"
                                    checked={formData.deliveryMethod === 'pickup'}
                                    onChange={handleInputChange}
                                />
                                Самовывоз
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="deliveryMethod"
                                    value="delivery"
                                    checked={formData.deliveryMethod === 'delivery'}
                                    onChange={handleInputChange}
                                />
                                Доставка в пределах МКАД
                            </label>
                        </div>
                        <div className={styles['order-inputs']}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Имя"
                                value={formData.name || ''}
                                onChange={handleInputChange}
                            />
                            <input
                                type="number"
                                name="phone"
                                placeholder="Телефон"
                                value={formData.phone || ''}
                                onChange={handleInputChange}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="E-mail"
                                value={formData.email || ''}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="address"
                                placeholder="Адрес доставки"
                                value={formData.address || ''}
                                onChange={handleInputChange}
                            />
                            <input
                                type="date"
                                name="deliveryDate"
                                value={formData.deliveryDate || ''}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="comment"
                                placeholder="Комментарий"
                                value={formData.comment}
                                onChange={handleInputChange}
                            />
                        </div>
                        <hr />
                        <div>
                            <p>Способы оплаты</p>
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cash"
                                    checked={formData.paymentMethod === 'cash'}
                                    onChange={handleInputChange}
                                />
                                Наличные
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="card"
                                    checked={formData.paymentMethod === 'card'}
                                    onChange={handleInputChange}
                                />
                                Карта
                            </label>
                        </div>

                        <hr />
                        <div>
                            <p>Заказ позиций {totalPrice} рублей</p>
                            <p>Итого: {totalPrice}</p>
                        </div>
                        <button type="submit" className={styles.submitCart}>Подтвердить заказ</button>
                    </form>
                </div>
            </section>
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <p>🎉 Заказ успешно оформлен!</p>
                    </div>
                </div>
            )}
        </div>
    );
}
