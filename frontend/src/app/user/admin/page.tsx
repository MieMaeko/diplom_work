'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles/admin.module.scss'
import axios from 'axios';
export default function AdminPage(){
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
    
        checkAdmin();
      }, [router]);

    return(
        <div>
            <h3>Админ панель</h3>
            <table></table>
        </div>
    )
}