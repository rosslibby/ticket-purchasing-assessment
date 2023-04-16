import { Show } from '../contexts/cart'
import { formatPrice } from '../utils'

type CartProps = {
  changePage: (id: string) => void
  quantity: number
  show: Show | null
}

const Cart = ({ changePage, quantity, show }: CartProps) => {

  if (!show) return null

  return (
    <div className="cart">
      <div className="row row--cart">
        <span>{show?.name}</span>
        <span>{(new Date(show?.date || '')).toLocaleString('en-US', {
          dateStyle: 'long',
        })}</span>
      </div>
      <div className="row row--cart row--summary">
        <span className="small">{quantity}&nbsp;&nbsp;&times;&nbsp;&nbsp;{show && formatPrice(show?.price)}</span>
        <span>{show && formatPrice(show?.price * quantity)}</span>
      </div>
      <div className="row row--cart">
        <button className="checkout" disabled={quantity === 0} onClick={() => changePage('checkout')}>Checkout</button>
      </div>
    </div>
  )
}

export default Cart