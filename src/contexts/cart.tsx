import { createContext, useContext, useState } from 'react'

export type Show = {
  id: string
  name: string
  date: string
  price: number
}

type Actions = {
  updatePayment: (state: boolean) => void
  updateShow: (show: Show | null) => void
  updateQuantity: (quantity: number) => void
}

export type CartContext = {
  payment: boolean
  show: Show | null
  quantity: number
  actions: Actions
}

type CartProviderProps = {
  children: string | JSX.Element | JSX.Element[]
}

export const cartContext = createContext<CartContext>({
  payment: false,
  quantity: 0,
  show: null,
  actions: {
    updatePayment: (state: boolean) => null,
    updateShow: (show: Show | null) => null,
    updateQuantity: (quantity: number) => null,
  }
})

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartContext>(useContext(cartContext))
  const [show, setShow] = useState<Show | null>(null)
  const [quantity, setQuantity] = useState<number>(0)

  const updatePayment = (state: boolean) => {
    setCart({
      ...cart,
      payment: state,
    })
  }
  const updateQuantity = (quantity: number) => {
    setQuantity(quantity)
  }

  const updateShow = (show: Show | null) => {
    setShow(show)
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