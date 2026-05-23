import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  productId: string
  vendorId: string
  name: string
  price_centimes: number
  quantity: number
  image?: string
}

interface CartState {
  items: CartItem[]
  vendorId: string | null
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  clear: () => void
  total: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      vendorId: null,

      addItem: (item) => {
        const { items, vendorId } = get()
        if (vendorId && vendorId !== item.vendorId) {
          // Panier d'un autre vendeur → on réinitialise
          set({ items: [item], vendorId: item.vendorId })
          return
        }
        const existing = items.find((i) => i.productId === item.productId)
        if (existing) {
          set({ items: items.map((i) => i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i) })
        } else {
          set({ items: [...items, item], vendorId: item.vendorId })
        }
      },

      removeItem: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),

      updateQty: (productId, qty) =>
        set((s) => ({
          items: qty <= 0
            ? s.items.filter((i) => i.productId !== productId)
            : s.items.map((i) => i.productId === productId ? { ...i, quantity: qty } : i),
        })),

      clear: () => set({ items: [], vendorId: null }),

      total: () => get().items.reduce((acc, i) => acc + i.price_centimes * i.quantity, 0),
    }),
    { name: 'korba-cart' }
  )
)
