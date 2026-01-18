'use client'

import { useState, useEffect, useCallback } from 'react'
import { type Product } from '@/lib/api'

export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
}

const CART_STORAGE_KEY = 'store-cart'

function getStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    console.error('Failed to save cart to localStorage')
  }
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setItems(getStoredCart())
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      saveCart(items)
    }
  }, [items, isLoaded])

  const addItem = useCallback((product: Product, quantity: number = 1) => {
    setItems((current) => {
      const existingIndex = current.findIndex((item) => item.product.id === product.id)
      if (existingIndex >= 0) {
        const updated = [...current]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        }
        return updated
      }
      return [...current, { product, quantity }]
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.product.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems((current) =>
      current.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }, [removeItem])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = calculateTotal(items)

  return {
    items,
    itemCount,
    total,
    isLoaded,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
}
