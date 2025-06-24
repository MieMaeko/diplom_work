'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import localforage from 'localforage'

export interface CartItem {
    uid: string
    productId: number
    name: string
    price: number
    quantity: number
    weight: number
    type: string
    img: string
    fillingId: number
    filling: string
    amount?: number
    addons: { id: number; name: string }[]

}

interface CartContextType {
    cart: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (uid: string) => void
    restoreItem: (item: CartItem) => void
    clearCart: () => void
    isOpen: boolean
    openPopup: () => void
    closePopup: () => void
}


const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) throw new Error('useCart must be used within CartProvider')
    return context
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([])
    const [isOpen, setIsOpen] = useState(false)
    useEffect(() => {
        const loadCart = async () => {
            const stored = (await localforage.getItem<CartItem[]>('cart')) || []
            setCart(stored)
        }
        loadCart()
    }, [])

    const save = async (updatedCart: CartItem[]) => {
        setCart(updatedCart)
        await localforage.setItem('cart', updatedCart)
    }

    const addItem = (item: CartItem) => {
        const existing = cart.find(i => i.uid === item.uid)
        let updatedCart: CartItem[]
        if (existing) {
            updatedCart = cart.map(i =>
                i.uid === item.uid ? { ...i, quantity: i.quantity + item.quantity } : i
            )
        } else {
            updatedCart = [...cart, item]
        }
        save(updatedCart)
    }

    const removeItem = (uid: string) => {
        const updated = cart.filter(item => item.uid !== uid)
        save(updated)
    }

    const restoreItem = (item: CartItem) => {
        addItem(item)
    }

    const clearCart = () => {
        save([])
    }
    const openPopup = () => setIsOpen(true)
    const closePopup = () => setIsOpen(false)
    return (
        <CartContext.Provider
            value={{
                cart,
                addItem,
                removeItem,
                restoreItem,
                clearCart,
                isOpen,
                openPopup,
                closePopup,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}
