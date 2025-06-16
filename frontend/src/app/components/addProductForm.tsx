import { useForm } from 'react-hook-form';
// import axios from 'axios';
import axios from '../api/axiosConfig'
import styles from '../user/admin/styles/admin.module.scss';
import React from 'react';

interface ProductFormData {
    name: string;
    price: string;
    category: string;
    type: string;
    in_stock: boolean;
    image: FileList;
    amount?: number;
}
interface Product {
    id: number;
    name: string;
    price: number;
    img: string;
    type: string;
    category: string;
    in_stock: boolean;
    amount?: number;
}

interface ProductModalProps {
    showForm: boolean;
    setShowForm: (value: boolean) => void;
    setProducts: (products: Product[]) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ showForm, setShowForm, setProducts }) => {
    const { register, handleSubmit, reset, watch } = useForm<ProductFormData>();

    const typeValue = watch('type');
    const onSubmit = async (data: ProductFormData) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('price', String(Number(data.price)));
            formData.append('category', data.category);
            formData.append('type', data.type);
            formData.append('in_stock', data.in_stock ? '1' : '0');
            if (data.image?.[0]) {
                formData.append('image', data.image[0]);
            }

            await axios.post('/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setShowForm(false);
            reset();

            const updated = await axios.get('/products');
            setProducts(updated.data);
        } catch (error) {
            console.error('Ошибка при добавлении товара:', error);
        }
    };

    if (!showForm) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <span className={styles.closeButton} onClick={() => setShowForm(false)}>×</span>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.productForm}>
                    <h4>Добавить товар</h4>

                    <input type="text" placeholder="Название" required {...register('name')} />
                    <input type="number" placeholder="Цена" required {...register('price')} />
                    <input type="text" placeholder="Категория" {...register('category')} />
                    <input type="text" placeholder="Тип (папка)" {...register('type')} />

                    <label>
                        <input type="checkbox" {...register('in_stock')} />
                        В наличии
                    </label>

                    <input type="file" accept="image/*" {...register('image')} />
                    {typeValue === 'dessert' && (
                        <input
                            type="number"
                            placeholder="Количество (необязательно)"
                            {...register('amount')}
                        />
                    )}
                    <button type="submit">Сохранить товар</button>
                </form>
            </div>
        </div>
    );
}

export default ProductModal;
