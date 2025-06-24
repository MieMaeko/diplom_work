import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import axios from '../api/axiosConfig'
import styles from '../user/admin/styles/admin.module.scss';
import React from 'react';
import { typeTranslations, categorTranslations } from '../lib/translations';
import { components, DropdownIndicatorProps, StylesConfig, OptionProps, CSSObjectWithLabel } from 'react-select';
import arrowSvg from '../../../public/icons/arrow.svg';
import Image from 'next/image';
import { AnimatedMenu } from '@/app/components/AnimatedMenu';
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

interface typeOption {
    value: string;
    label: string;
}

interface ProductModalProps {
    showForm: boolean;
    setShowForm: (value: boolean) => void;
    setProducts: (products: Product[]) => void;
}

const DropdownIndicator = (props: DropdownIndicatorProps<typeOption, false>) => {
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

const customStyles: StylesConfig<typeOption, false> = {
    control: (base: CSSObjectWithLabel) => ({
        ...base,
        border: '3px solid #B36750',
        borderRadius: '8px',
        backgroundColor: '#FFF6E7',
        fontSize: '24px',
        width: '240px',
        boxShadow: 'none',
        '&:hover': {
            border: '3px solid #B36750',
        },
    }),
    menu: (base: CSSObjectWithLabel) => ({
        ...base,
        backgroundColor: '#FFF6E7',
        width: '240px',
        border: '2px solid #B36750',
        borderRadius: '8px',
        zIndex: 9999,
    }),
    option: (base: CSSObjectWithLabel, state: OptionProps<typeOption, false>) => ({
        ...base,
        fontSize: '24px',
        backgroundColor: state.isFocused ? '#f1e4d3' : '#FFF6E7',
        color: '#B36750',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
    }),
    singleValue: (base: CSSObjectWithLabel) => ({
        fontSize: '24px',
        ...base,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#B36750',
    }),
    dropdownIndicator: (base: CSSObjectWithLabel) => ({
        ...base,
        color: '#B36750',
        padding: '0 8px',
    }),
    indicatorSeparator: () => ({ display: 'none' }),
};

const formatOptionLabel = (option: typeOption) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {option.label}
    </div>
);
const ProductModal: React.FC<ProductModalProps> = ({ showForm, setShowForm, setProducts }) => {
    const { register, handleSubmit, reset, watch, control } = useForm<ProductFormData>();
    const typeOptions: typeOption[] = Object.entries(typeTranslations).map(([key, label]) => ({
        value: key,
        label: label,
    }));
    const typeValue = watch('type');
    const onSubmit = async (data: ProductFormData) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('price', String(Number(data.price)));
            formData.append('category', data.category);
            formData.append('type', data.type);
            formData.append('in_stock', data.in_stock ? '1' : '0');
            if (data.image && data.image[0]) {
                formData.append('image', data.image[0]);
            } else {
                console.error('Изображение не выбрано');
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
                <span className={styles.closeButton} onClick={() => setShowForm(false)}>X</span>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.productForm}>
                    <h4>Добавить товар</h4>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Название:</label>
                        <input type="text" placeholder="Название" required {...register('name')} />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor='number'>Цена: </label>
                        <input type="number" placeholder="Цена" required {...register('price')} />

                    </div>
                    <div className={styles.formGroup}>
                        <label>Тип:</label>
                        <Controller
                            name="type"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={typeOptions}
                                    styles={customStyles}
                                    components={{ DropdownIndicator, Menu: AnimatedMenu }}
                                    formatOptionLabel={formatOptionLabel}
                                    isSearchable={false}
                                    isMulti={false}
                                    value={typeOptions.find(option => option.value === field.value) || null}
                                    onChange={(selected: typeOption | null) => field.onChange(selected?.value)}
                                />
                            )}
                        />

                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="category">Категория:</label>
                        <select id="category" {...register('category')} className={styles.input} required>
                            <option value="">Выберите категорию</option>
                            {Object.entries(categorTranslations).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>
                    {typeValue === 'desserts' && (
                        <div className={styles.formGroup}>
                            <label htmlFor="amount">Количество</label>
                            <input id="amount" type="number" {...register('amount')} className={styles.input} />
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor="check"> В наличии</label>

                        <input type="checkbox" {...register('in_stock')} />


                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="image">Изображение</label>
                        <input id="image" type="file" accept="image/*" {...register('image')} className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <button className={styles.buttonForm} type="submit">Сохранить товар</button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default ProductModal;
