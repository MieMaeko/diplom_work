'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './cart-popup.module.scss'
import { useCart, CartItem } from '@/app/context/CartContext'
import { apiUrl } from '@/app/lib/config'

interface RemovedItem {
  item: CartItem
  timeoutId: NodeJS.Timeout
}

export default function CartPopup() {
  const pathname = usePathname()
  const { cart, removeItem, restoreItem, isOpen, openPopup, closePopup, clearCart } = useCart()
  const [removed, setRemoved] = useState<RemovedItem | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (isOpen && ref.current && !ref.current.contains(e.target as Node)) {
        closePopup()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen, closePopup])

  const handleRemove = (uid: string) => {
    const item = cart.find(i => i.uid === uid)
    if (!item) return
    removeItem(uid)
    const timeoutId = setTimeout(() => setRemoved(null), 4000)
    setRemoved({ item, timeoutId })
  }

  const undoRemove = () => {
    if (!removed) return
    clearTimeout(removed.timeoutId)
    restoreItem(removed.item)
    setRemoved(null)
  }


  if (pathname === '/cart' || cart.length === 0) return null

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={closePopup} />}

      <div className={styles.cartContainer} ref={ref}>
        <div className={styles.cartIcon} onClick={openPopup}>
          <Image src="/icons/bag.svg" alt="bag" width={50} height={50} />
          <div className={styles.quantityCircle}>
            <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </div>
        </div>

        <div className={`${styles.popup} ${isOpen ? styles.show : ''}`}>
          <h4>Корзина</h4>

          <div className={styles.items}>
            {cart.map(item => {
              const imageUrl = `${apiUrl}/images/catalog/${item.type}/${item.img}`
              return (
                <div key={item.uid} className={styles.item}>
                  <Image src={imageUrl} alt={item.name} width={80} height={80} />
                  <div className={styles.details}>
                    <p>{item.name}</p>
                    {item.type === 'dessert' ? (
                      <>
                        <p>Количество в наборе: {item.amount}</p>
                        <p>Наборов: {item.quantity}</p>
                      </>
                    ) : (
                      <>
                        <p>{item.weight} кг, {item.filling}</p>
                        <p>{item.quantity} шт.</p>
                      </>
                    )}
                    <span>{item.price * item.quantity} ₽</span>
                  </div>
                  <button
                    onClick={() => handleRemove(item.uid)}
                    className={styles.removeButton}
                    aria-label="Удалить"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>

          {removed && (
            <div className={styles.undo}>
              <div className={styles.undoText}>
                Вы удалили <strong>{removed.item.name}</strong>
              </div>
              <div className={styles.undoActions}>
                <div className={styles.timerBar} />
                <button onClick={undoRemove}>Отменить</button>
              </div>
            </div>
          )}

          <div className={styles.footer}>
            <div className={styles.total}>
              <span>Сумма:</span>
              <span>{total} ₽</span>
            </div>
            <div className={styles.actions}>
              <button className={styles.buttons} onClick={closePopup}>Продолжить</button>
              <Link href="/cart" className={styles.buttons}>Оформление</Link>
              <button className={styles.buttons} onClick={clearCart}>Очистить</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
