import { create } from "zustand"

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}


type CartStore = {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
}



export const useCartStore = create<CartStore>((set) => ({
  cart: [],

  addToCart: (item) =>
    set((state) => {
      const existing = state.cart.find(i => i.id === item.id)

      if (existing) {
        return {
          cart: state.cart.map(i =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        }
      }

      return { cart: [...state.cart, item] }
    }),

    

    removeFromCart: (id: string) =>
  set((state) => ({
    cart: state.cart.filter((item) => item.id !== id),
  })),

updateQty: (id: string, quantity: number) =>
  set((state) => ({
    cart: state.cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    ),
  })),

  clearCart: () => set({ cart: [] })
}))