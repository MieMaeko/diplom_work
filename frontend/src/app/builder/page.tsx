'use client'

import styles from './styles/builder.module.scss'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import axios from '../api/axiosConfig'
import localforage from 'localforage'
type Filling = {
    id: number
    name: string
}

type Addon = {
    id: number
    name: string
}
type CustomOrderForm = {
    shape: string
    decor: string
    filling: string
    weight: string
    wishes: string
    file: FileList
}

export default function BuilderPage() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<CustomOrderForm>()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [fillings, setFillings] = useState<Filling[]>([])
    const [addons, setAddons] = useState<Addon[]>([])

    useEffect(() => {
        const loadFillings = async () => {
            const cached = await localforage.getItem<Filling[]>('fillings')
            if (cached) {
                setFillings(cached)
            } else {
                const res = await axios.get('/fillings')
                setFillings(res.data)
                localforage.setItem('fillings', res.data)
            }
        }

        const loadAddons = async () => {
            const cached = await localforage.getItem<Addon[]>('addons')
            if (cached) {
                setAddons(cached)
            } else {
                const res = await axios.get('/addons')
                setAddons(res.data)
                localforage.setItem('addons', res.data)
            }
        }

        loadFillings()
        loadAddons()
    }, [])

    const onSubmit = async (data: CustomOrderForm) => {
        setIsSubmitting(true)

        const file = data.file?.[0]
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
            if (!allowedTypes.includes(file.type)) {
                alert('Разрешены только изображения .jpg, .jpeg, .png')
                setIsSubmitting(false)
                return
            }

            if (file.size > 5 * 1024 * 1024) {
                alert('Файл слишком большой. Максимальный размер — 5MB.')
                setIsSubmitting(false)
                return
            }
        }

        const formData = new FormData()
        formData.append('shape', data.shape)
        formData.append('decor', data.decor)
        formData.append('filling', data.filling)
        formData.append('weight', data.weight)
        formData.append('wishes', data.wishes)
        if (file) formData.append('file', file)

        try {
            const res = await fetch('/custom-order', {
                method: 'POST',
                body: formData,
            })

            const result = await res.json()

            if (!res.ok) {
                throw new Error(result.message || 'Ошибка при отправке формы')
            }

            alert('Заявка отправлена успешно!')
            reset()
        } catch (err: any) {
            alert(`Ошибка: ${err.message}`)
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={styles.builder}>
            <h3>Конструктор <br /> тортов</h3>
            <section>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.formInfo}>
                        <div>
                            <label>
                                <p>Форма:</p>
                                <select {...register('shape', { required: true })}>
                                    <option value="Круг">Круг</option>
                                    <option value="Квадрат">Квадрат</option>
                                </select>
                            </label>
                        </div>

                        <div>
                            <label>
                                <p>Декор:</p>
                                <select {...register('decor', { required: true })}>
                                    {addons.map(addon => (
                                        <option key={addon.id} value={addon.name}>{addon.name}</option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div>
                            <label>
                                <p>Начинка:</p>
                                <select {...register('filling', { required: true })}>
                                    {fillings.map(filling => (
                                        <option key={filling.id} value={filling.name}>{filling.name}</option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div>
                            <label>
                                <p>Вес:</p>
                                <select {...register('weight', { required: true })}>
                                    <option value="1кг">1 кг</option>
                                    <option value="2кг">2 кг</option>
                                </select>
                            </label>

                        </div>
                        <div>
                            <label>
                                <p>Пожелания и дополнения:</p>
                                <input
                                    type="text"
                                    placeholder="Ваши пожелания"
                                    {...register('wishes')}
                                />
                            </label>

                        </div>
                        <div>
                            <label>
                                <p>Изображение</p>
                                <input
                                    type="file"
                                    {...register('file')}
                                    accept="image/jpeg,image/jpg,image/png"
                                />
                            </label>
                        </div>

                    </div>
                    <div>
                        <p><strong>Расчётная сумма:</strong> от 1000 ₽</p>

                        <button className={styles['button-send']} type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Отправка...' : 'Отправить на расчёт'}
                        </button>


                    </div>

                </form>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    Это предварительная стоимость. Менеджер свяжется с вами для уточнения деталей.
                </p>
            </section>
        </div>
    )
}