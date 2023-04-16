import { useContext } from 'react'
import Card from './Card'
import Column from './Column'
import { cartContext } from './contexts/cart'

const Total = () => {
  const { payment, show, quantity } = useContext(cartContext)
  const totalCost = show
    ? show?.price * quantity
    : 0.00
  const serviceFee = show
    ? Math.round(0.19248908296 * show?.price * 100) / 100
    : 0
  const orderProcessingFee = 2.95

  return (
    <Column>
      <Card title="Total">
        <h3>Tickets</h3>
        <p className="row">
          <span>Resale Tickets: {show?.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} x {quantity}</span>
          <span>{totalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
        </p>
        <br />
        <h3>Notes From Seller</h3>
        <p>xfr XFER Proof of at least one dose of COVID-19 vaccination for ages 5 to 11 and guests ages 12 and up will be required to show proof of two COVID-19 vaccine doses or one dose of the Johnson &amp; Johnson vaccine. Masks must be worn.</p>
        <br />
        <h3>Fees</h3>
        <p className="row">
          <span>Service Fee: ${serviceFee} x {quantity}</span>
        </p>
        <p className="row">
          <span>Order Processing Fee</span>
          <span>${orderProcessingFee}</span>
        </p>
        <br />
        <h3>Delivery</h3>
        <p className="row">
          <span>Mobile Entry</span>
          <span>Free</span>
        </p>
        <br />
        <button className="action-button action-button--light">Cancel Order</button>
        <br />
        <p>*All Sales Final - No Refunds</p>
        <br />
        <form>
          <input type="checkbox" id="terms-of-use" />
          <label className="confirmation" htmlFor="terms-of-use">I have read and agree to the current <a href="#" className="action-button">Terms of Use</a>.</label>
        </form>
        <button className="place-order" disabled={!payment}>Place Order</button>
        <small>*Exceptions may apply, see our Terms of Use.</small>
      </Card>
    </Column>
  )
}

export default Total