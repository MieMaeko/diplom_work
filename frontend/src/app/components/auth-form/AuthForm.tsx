'use client'
import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import styles from './auth-form.module.scss'
import { useRouter } from 'next/navigation';
interface AuthFormProps {
  onSubmit: (data: any) => void;
  isReg: boolean;
  setIsReg: (isReg: boolean) => void;
  setShowForm: (showForm: boolean) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, isReg, setIsReg, setShowForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const endpoint = isReg ? '/api/user/register' : '/api/user/login'; 
      const response = await axios.post(endpoint, { email, password }, {
        withCredentials: true,  
      });

      onSubmit(response.data); 
      if (response.data.role === 'admin') {
        router.push('/user/admin');
      } else {
        router.push('/user/profile');
      }
      
      setShowForm(false); 

    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles['modal-content']}>
        <span className={styles["close-form"]} onClick={() => setShowForm(false)}>
          X
        </span>
        <p className={styles.modalH}>{isReg ? 'Регистрация' : 'Авторизация'}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Почта"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button type="submit">{isReg ? 'Зарегистрироваться' : 'Войти'}</button>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <p className={styles.law}>Нажимая отправить, вы соглашаетесь с нашими условиями использования</p>
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
