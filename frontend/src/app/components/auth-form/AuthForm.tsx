'use client';

import { useForm } from 'react-hook-form';
// import axios from 'axios';
import axios from '../../api/axiosConfig'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './auth-form.module.scss';
import { useState } from 'react';

interface AuthFormProps {
  onSubmit: (data: FormData) => void;
  isReg: boolean;
  setIsReg: (isReg: boolean) => void;
  setShowForm: (showForm: boolean) => void;
}

interface FormData {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}
const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, isReg, setIsReg, setShowForm }) => {
  const { register, handleSubmit, watch, setError, formState: { errors }, trigger } = useForm<FormData>();
  const [checkingEmail, setCheckingEmail] = useState(false);
  const router = useRouter();

  const onSubmitForm = async (data: FormData) => {
    try {
      const endpoint = isReg ? '/user/register' : '/user/login';
      const payload = isReg
        ? { name: data.name, email: data.email, password: data.password }
        : { email: data.email, password: data.password };

      const response = await axios.post(endpoint, payload, { withCredentials: true });

      if (!isReg && response.data?.error) {
        console.log(response.data.error)
        if (response.data.error === 'User not found') {
          setError('email', { message: 'Пользователь с такой почтой не найден' });
        } else if (response.data.error === 'Invalid password') {
          setError('password', { message: 'Неверный пароль' });
        } else {
          setError('email', { message: 'Ошибка входа' });
        }
        return;
      }

      onSubmit(response.data);

      if (response.data.role === 'admin') {
        router.push('/user/admin');
      } else {
        router.push('/user/profile');
      }

      setShowForm(false);
    } catch {
      setError('email', { message: 'Ошибка сервера' });
    }
  };

  const validateEmailUniqueness = async (email: string) => {
    if (!isReg) return true;
    setCheckingEmail(true);
    try {
      const res = await axios.post('/user/check-email', { email });
      if (!res.data?.unique) {
        return 'Почта уже занята';
      }
      return true;
    } catch {
      return 'Ошибка проверки почты';
    } finally {
      setCheckingEmail(false);
    }
  };


  return (
    <div className={styles.modal}>
      <div className={styles['modal-content']}>
        <span className={styles["close-form"]} onClick={() => setShowForm(false)}>X</span>
        <p className={styles.modalH}>{isReg ? 'Регистрация' : 'Авторизация'}</p>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          {errors.name && <p style={{ color: '#EB6363' }}>{errors.name.message}</p>}

          {isReg && (
            <input
              type="text"
              placeholder="Имя"
              {...register('name', { required: 'Введите имя' })}
              className={styles.pinkInput}
            />
          )}
          {checkingEmail && <p>Проверка email...</p>}
          {errors.email && <p style={{ color: '#EB6363' }}>{errors.email.message}</p>}

          <input
            type="email"
            placeholder="Почта"
            {...register('email', {
              required: 'Введите email',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Неверный формат email',
              },
              validate: validateEmailUniqueness
            })}
            onBlur={() => trigger('email')}
            className={styles.pinkInput}
          />
          {errors.password && <p style={{ color: '#EB6363' }}>{errors.password.message}</p>}

          <input
            type="password"
            placeholder="Пароль"
            {...register('password', {
              required: 'Введите пароль',
              minLength: {
                value: 6,
                message: 'Минимум 6 символов',
              },
            })}
            className={styles.pinkInput}
          />

          {errors.confirmPassword && <p style={{ color: '#EB6363' }}>{errors.confirmPassword.message}</p>}

          {isReg && (
            <input
              type="password"
              placeholder="Подтверждение пароля"
              {...register('confirmPassword', {
                required: 'Подтвердите пароль',
                validate: value =>
                  value === watch('password') || 'Пароли не совпадают',
              })}
              className={styles.pinkInput}
            />
          )}
          <p className={styles.law} onClick={() => setIsReg(!isReg)}>
            {isReg ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}
          </p>
          <button type="submit">{isReg ? 'Зарегистрироваться' : 'Войти'}</button>
          <p className={styles.law1}>
            {isReg ? 'Нажимая зарегистрироваться, вы соглашаетесь с нашими условиями использования' : ''}

          </p>
        </form>


      </div>
      <div className={styles['image-container']}>
        <Image
          src="/images/vectors/form.svg"
          alt="form"
          layout="responsive"
          height={165}
          width={782}
        />
      </div>
    </div>
  );
};

export default AuthForm;
