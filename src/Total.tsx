import { FormEvent, useCallback, useContext, useState } from 'react'
import Card from './Card'
import Column from './Column'
import { cartContext } from './contexts/cart'
import cardStyles from './styles/card.module.sass'
import layoutStyles from './styles/layout.module.sass'
import paymentStyles from './styles/payment.module.sass'
import Loading from './Loading'

const Total = () => {
  const { payment, show, quantity } = useContext(cartContext)
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false)
  const [terms, setTerms] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [termsError, setTermsError] = useState<boolean>(false)
  const totalCost = show
    ? show?.price * quantity
    : 0.00
  const serviceFee = show
    ? Math.round(0.19248908296 * show?.price * 100) / 100
    : 0
  const orderProcessingFee = 2.95
  const updateTerms = (e: FormEvent<HTMLInputElement>) => {
    setTerms(e.currentTarget.checked)
  }
  const mockOrder = useCallback(async () => setTimeout(() => {
    setLoading(false)
    setOrderPlaced(true)
  }, 1500), [setLoading, setOrderPlaced])
  const submitOrder = (e: FormEvent<HTMLButtonElement>) => {
    if (!terms) {
      setTermsError(true)
    } else {
      setTermsError(false)
      setLoading(true)
      mockOrder()
    }
  }

  const termsClassname = () => {
    const classnames = [paymentStyles['terms-form']]
    if (termsError) classnames.push(paymentStyles['terms-form--incomplete'])

    return classnames.join(' ')
  }

  return (
    <Column>
      <Card title="Total">
        <h3>Tickets</h3>
        <p className={layoutStyles.row}>
          <span>Resale Tickets: {show?.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} x {quantity}</span>
          <span>{totalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
        </p>
        <br />
        <h3>Notes From Seller</h3>
        <p>xfr XFER Proof of at least one dose of COVID-19 vaccination for ages 5 to 11 and guests ages 12 and up will be required to show proof of two COVID-19 vaccine doses or one dose of the Johnson &amp; Johnson vaccine. Masks must be worn.</p>
        <br />
        <h3>Fees</h3>
        <p className={layoutStyles.row}>
          <span>Service Fee: ${serviceFee} x {quantity}</span>
        </p>
        <p className={layoutStyles.row}>
          <span>Order Processing Fee</span>
          <span>${orderProcessingFee}</span>
        </p>
        <br />
        <h3>Delivery</h3>
        <p className={layoutStyles.row}>
          <span>Mobile Entry</span>
          <span>Free</span>
        </p>
        <br />
        <button className={`${cardStyles['action-button']} ${cardStyles['action-button--light']}`}>Cancel Order</button>
        <br />
        <p>*All Sales Final - No Refunds</p>
        <br />
        <form className={termsClassname()}>
          <input type="checkbox" id="terms-of-use" onChange={updateTerms} />
          <label className="confirmation" htmlFor="terms-of-use">I have read and agree to the current <a href="#" className={cardStyles['action-button']}>Terms of Use</a>.</label>
        </form>
        <button
          className={paymentStyles['place-order']}
          disabled={!payment || loading || orderPlaced}
          onClick={submitOrder}
        >
          {orderPlaced ? 'Order confirmed' : 'Place Order'}
          {loading && <Loading />}
        </button>
        {termsError ? (
          <small className={paymentStyles.error}>Please agree to Terms of Use</small>
        ) : (<span />)}
        <small>*Exceptions may apply, see our Terms of Use.</small>
      </Card>
    </Column>
  )
}

export default Total