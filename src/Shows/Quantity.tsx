import { FormEvent } from 'react'
import { Show } from '../contexts/cart'

type QuantityProps = {
  id: string
  quantity: number
  show: Show | null
  updateQuantity: (value: number) => void
}

const Quantity = ({ id, quantity, show, updateQuantity }: QuantityProps) => {
  const selected = show?.id

  const increment = () => {
    if (id === selected) {
      const value = quantity + 1

      updateQuantity(value)
    }
  }

  const decrement = () => {
    if (id === selected && quantity > 0) {
      const value = quantity - 1

      updateQuantity(value)
    }
  }

  const update = (e: FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value

    if (value.match(/^[0-9]{1}$/)) {
      const parsedValue = parseInt(e.currentTarget.value, 10)

      updateQuantity(parsedValue)
    }
  }

  return (
    <span className="quantity">
      <button
        disabled={id !== selected}
        onClick={decrement}
      >-</button>
      <input
        readOnly
        disabled={id !== selected}
        onChange={update}
        type="text"
        value={id === selected ? quantity : 0}
      />
      <button
        disabled={id !== selected}
        onClick={increment}
      >+</button>
    </span>
  )
}

export default Quantity