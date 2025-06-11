'use client';

import { useForm } from 'react-hook-form';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './auth-form.module.scss';
import { useEffect, useState } from 'react';

interface AuthFormProps {
  onSubmit: (data: any) => void;
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
      const endpoint = isReg ? '/api/user/register' : '/api/user/login';
      const payload = isReg
        ? { name: data.name, email: data.email, password: data.password }
        : { email: data.email, password: data.password };

      const response = await axios.post(endpoint, payload, { withCredentials: true });

      onSubmit(response.data);

      if (response.data.role === 'admin') {
        router.push('/user/admin');
      } else {
        router.push('/user/profile');
      }

      setShowForm(false);
    } catch (err: any) {
      setError('email', { message: 'Неверные данные или пользователь уже существует' });
    }
  };

  const validateEmailUniqueness = async (email: string) => {
    if (!isReg) return true;
    setCheckingEmail(true);
    try {
      const res = await axios.post('/api/user/check-email', { email });
      return res.data?.unique ?? true;
    } catch {
      return false;
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

          {isReg && (
            <input
              type="text"
              placeholder="Имя"
              {...register('name', { required: 'Введите имя' })}
              className={styles.pinkInput}
            />
          )}
          {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}

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
          {checkingEmail && <p>Проверка email...</p>}
          {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}

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
          {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}

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
          {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword.message}</p>}

          <button type="submit">{isReg ? 'Зарегистрироваться' : 'Войти'}</button>
          <p className={styles.law}>
            Нажимая отправить, вы соглашаетесь с нашими условиями использования
          </p>
        </form>

        <p className={styles.law} onClick={() => setIsReg(!isReg)}>
          {isReg ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}
        </p>
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
