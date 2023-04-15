import { FormEvent, createContext, useContext, useState } from 'react'

export type Show = {
  id: string
  name: string
  date: string
  price: number
}

type Cart = {
  show: Show | null
  quantity: number
}

type Actions = {
  updatePayment: (state: boolean) => void
  updateShow: (show: Show) => void
  updateQuantity: (quantity: number) => void
}

type CartContext = {
  payment: boolean
  show: Show | null
  quantity: number
  cart: Cart
  actions: Actions
}

type CartProviderProps = {
  children: string | JSX.Element | JSX.Element[]
}

export const cartContext = createContext<CartContext>({
  payment: false,
  quantity: 0,
  show: null,
  cart: {
    show: null,
    quantity: 0,
  },
  actions: {
    updatePayment: (state: boolean) => null,
    updateShow: (show: Show) => null,
    updateQuantity: (quantity: number) => null,
  }
})

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartContext>(useContext(cartContext))
  const [show, setShow] = useState<Show | null>(null)
  const [quantity, setQuantity] = useState<number>(0)

  const updatePayment = (state: boolean) => {
    console.log('update payment', state)
    setCart({
      ...cart,
      payment: state,
    })
  }
  const updateQuantity = (quantity: number) => {
    console.log('update quantity to', quantity)
    setQuantity(quantity)
  }

  const updateShow = (show: Show) => {
    console.log('updating show', show)
    setShow(show)
    setCart({
      ...cart,
      show,
      cart: { ...cart.cart, show }
    })
  }

  return (
    <cartContext.Provider value={{
      ...cart,
      show,
      quantity,
      actions: {
        updatePayment,
        updateShow,
        updateQuantity,
      }
    }}>
      {children}
    </cartContext.Provider>
  )
}