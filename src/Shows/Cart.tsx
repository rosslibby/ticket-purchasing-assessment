import { Show } from '../contexts/cart'
import { formatPrice } from '../utils'
import layoutStyles from '../styles/layout.module.sass'
import styles from '../styles/cart.module.sass'

type CartProps = {
  changePage: (id: string) => void
  quantity: number
  show: Show | null
}

const Cart = ({ changePage, quantity, show }: CartProps) => {

  if (!show) return null

  return (
    <div className={styles.cart}>
      <div className={`${layoutStyles.row} ${layoutStyles['row--cart']}`}>
        <span>{show?.name}</span>
        <span>{(new Date(show?.date || '')).toLocaleString('en-US', {
          dateStyle: 'long',
        })}</span>
      </div>
      <div className={`${layoutStyles.row} ${layoutStyles['row--cart']} ${layoutStyles['row--summary']}`}>
        <span className="small">{quantity}&nbsp;&nbsp;&times;&nbsp;&nbsp;{show && formatPrice(show?.price)}</span>
        <span>{show && formatPrice(show?.price * quantity)}</span>
      </div>
      <div className={`${layoutStyles.row} ${layoutStyles['row--cart']}`}>
        <button className={styles.checkout} disabled={quantity === 0} onClick={() => changePage('checkout')}>Checkout</button>
      </div>
    </div>
  )
}

export default Cart