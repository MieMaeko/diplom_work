'use client'
import { useEffect, useState } from 'react';
import localforage from 'localforage';
import { useRouter } from 'next/navigation';
import axios from '../api/axiosConfig';
import Image from 'next/image';
import styles from './styles/cart.module.scss'
import { apiUrl } from '@/app/lib/config';
import { useForm } from 'react-hook-form';
import { typeTranslation } from '../lib/translations';
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
    addons?: { id: number; name: string }[];
    amount?: number;
}

interface UserData {
    id: number;
    name: string;
    phone: string;
    email: string;
    address?: string;
}

interface FormData {
    name: string;
    phone: string;
    email: string;
    address: string;
    deliveryDate: string;
    deliveryMethod: string;
    paymentMethod: string;
    comment: string;
}

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [userData, setUserData] = useState<UserData | null>(null);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<FormData>({ defaultValues: { paymentMethod: 'cash' } });

    const router = useRouter();

    const extractDigits = (val: string) =>
        val.replace(/\D/g, '').replace(/^8/, '7').slice(0, 11);

    const formatPhone = (digits: string) => {
        if (!digits) return '+7';
        let formatted = '+7';
        if (digits.length > 1) formatted += ' (' + digits.slice(1, 4);
        if (digits.length >= 4) formatted += ') ' + digits.slice(4, 7);
        if (digits.length >= 7) formatted += '-' + digits.slice(7, 9);
        if (digits.length >= 9) formatted += '-' + digits.slice(9, 11);
        return formatted;
    };

    useEffect(() => {
        const fetchCart = async () => {
            const storedCart = (await localforage.getItem<CartItem[]>('cart')) || [];
            setCart(storedCart);
            const total = storedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            setTotalPrice(total);
        };

        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('/user/profile', { withCredentials: true });
                if (response.data) {
                    const raw = extractDigits(response.data.phone || '');
                    setUserData(response.data);
                    setValue('name', response.data.name || '');
                    setValue('phone', formatPhone(raw));
                    setValue('email', response.data.email || '');
                }
            } catch (error) {
                console.log('Ошибка при загрузке профиля', error);
            }
        };

        fetchCart();
        fetchUserProfile();
    }, [setValue]);

    useEffect(() => {
        if (showModal) {
            const timer = setTimeout(() => {
                router.push('/user/profile');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showModal, router]);

    const handleChangeQuantity = async (uid: string, delta: number) => {
        const updated = cart.map(item =>
            item.uid === uid ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        );
        await localforage.setItem('cart', updated);
        setCart(updated);
        setTotalPrice(updated.reduce((sum, i) => sum + i.price * i.quantity, 0));
    };

    const handleRemoveItem = async (itemId: number) => {
        const updatedCart = cart.filter(item => item.productId !== itemId);
        await localforage.setItem('cart', updatedCart);
        setCart(updatedCart);
        setTotalPrice(updatedCart.reduce((sum, i) => sum + i.price * i.quantity, 0));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const digits = extractDigits(input);
        setValue('phone', formatPhone(digits));
    };

    // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = e.target;
    //     if (name === 'phone') return handlePhoneChange(e);
    //     setFormData(prev => ({ ...prev, [name]: value }));
    // };

    const onSubmit = async (data: FormData) => {
        if (!userData?.id) {
            alert('Пожалуйста, авторизуйтесь для оформления заказа.');
            return;
        }

        const digits = extractDigits(data.phone);
        const formattedPhone = formatPhone(digits);

        const orderData = {
            user_id: userData.id,
            user_name: data.name,
            user_phone: formattedPhone,
            user_email: data.email,
            address: data.address,
            delivery_date: data.deliveryDate,
            delivery_method: data.deliveryMethod,
            total_price: totalPrice,
            status: 'оформлен',
            comment: data.comment,
            items: cart.map(item => ({
                productId: item.productId,
                fillingId: item.fillingId,
                quantity: item.quantity,
                ...(item.type === 'cake' ? { weight: item.weight } : {}),
                price: item.price,
                addonIds: item.addons ? item.addons.map(a => a.id) : [],
                ...(item.amount ? { amount: item.amount } : {})
            }))
        };

        try {
            console.log(orderData)
            await axios.post('/orders', orderData);
            await localforage.removeItem('cart');
            setCart([]);
            setShowModal(true);
        } catch (error) {
            console.log('Ошибка при оформлении заказа:', error);
        }
    };

    return (
        <div className={styles['make-order']}>
            <h3>Корзина</h3>
            <section>
                {cart.length === 0 ? (
                    <p>Корзина пуста</p>
                ) : (
                    <div className={styles.products}>
                        {cart.map(item => (
                            <div className={styles.product} key={item.productId}>
                                <Image
                                    className={styles['item-img']}
                                    src={`${apiUrl}/images/catalog/${item.type}/${item.img}`}
                                    alt={item.name}
                                    width={150}
                                    height={150}
                                />
                                <div className={styles['item-info']}>
                                    <p>{typeTranslation[item.type]} &quot;{item.name}&quot;</p>
                                    <p>Начинка: {item.filling}</p>
                                    {item.addons && item.addons.length > 0 && (
                                        <p>Топпинги: {item.addons.map(a => a.name).join(', ')}</p>
                                    )}
                                    {item.type === 'cake' && (
                                        <p>Вес: {item.weight} кг</p>
                                    )}
                                    {item.type === 'dessert' && (
                                        <p>Кол-во в коробке: {item.amount}</p>
                                    )}
                                </div>
                                <div className={styles['item-price']}>
                                    <p>{item.price} руб</p>
                                    <p className={styles.quantityProduct}>
                                        <span className={styles.changeQuantity} onClick={() => handleChangeQuantity(item.uid, -1)}>{'\u2212'}</span>
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

                            </div>
                        ))}
                        <hr />
                        <h2>Итого: {totalPrice}₽</h2>
                    </div>
                )}

                <div className={styles.order}>
                    <h4>Оформление заказа</h4>
                    <form onSubmit={handleSubmit(onSubmit)} className={styles['order-block']}>

                        <div className={styles.radioGroup}>
                            <p>Способы доставки</p>

                            <label className={styles.customRadio}>
                                <input
                                    type="radio"
                                    value="pickup"
                                    className={styles.radio}
                                    {...register('deliveryMethod', { required: true })}
                                />
                                <span className={styles['radio-custom']}></span>
                                Самовывоз
                            </label>

                            <label className={styles.customRadio}>
                                <input
                                    type="radio"
                                    value="delivery"
                                    className={styles.radio}
                                    {...register('deliveryMethod', { required: true })}
                                />
                                <span className={styles['radio-custom']}></span>
                                Доставка в пределах МКАД
                            </label>

                            {errors.deliveryMethod && <p className={styles.errorText}>Выберите способ доставки</p>}
                        </div>
                        <div className={styles['order-inputs']}>

                            <input {...register('name', { required: 'Имя обязательно' })} placeholder="Имя" />
                            {errors.name && <p>{errors.name.message}</p>}

                            <input
                                {...register('phone', {
                                    required: 'Телефон обязателен',
                                    pattern: {
                                        value: /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/,
                                        message: 'Введите номер в формате +7 (XXX) XXX-XX-XX'
                                    }
                                })}
                                onChange={handlePhoneChange}
                                placeholder="+7 (___) ___-__-__"
                                value={watch('phone') || ''}
                            />
                            {errors.phone && <p>{errors.phone.message}</p>}

                            <input {...register('email', { required: 'Email обязателен' })} placeholder="Email" />
                            {errors.email && <p>{errors.email.message}</p>}

                            <input {...register('address', { required: 'Адрес обязателен' })} placeholder="Адрес доставки" />
                            {errors.address && <p>{errors.address.message}</p>}

                            <input type="date" {...register('deliveryDate', { required: 'Дата доставки обязательна' })} />
                            {errors.deliveryDate && <p>{errors.deliveryDate.message}</p>}

                            <input {...register('comment')} placeholder="Комментарий" />
                        </div>

                        <hr />
                        <div className={styles.radioGroup}>
                            <p>Способы оплаты</p>
                            <label className={styles.customRadio}>
                                <input type="radio" value="cash" className={styles.radio} {...register('paymentMethod', { required: true })} />
                                <span className={styles['radio-custom']}></span>
                                Наличные
                            </label>

                            <label className={styles.customRadio}>
                                <input className={styles.radio} type="radio" value="card" {...register('paymentMethod', { required: true })} />
                                <span className={styles['radio-custom']}></span>
                                Карта
                            </label>
                            {errors.paymentMethod && <p>Выберите способ оплаты</p>}
                        </div>
                        <button type="submit" className={styles.submitCart}>Подтвердить заказ</button>
                    </form>
                </div>
            </section>

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <p>Заказ успешно оформлен!</p>
                    </div>
                </div>
            )}
        </div>
    );
}
