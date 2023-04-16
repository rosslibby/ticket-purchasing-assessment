import { FormEvent } from 'react'
import cardStyles from '../styles/card.module.sass'
import layoutStyles from '../styles/layout.module.sass'
import paymentStyles from '../styles/payment.module.sass'

type CreditCard = {
  id: string
  logo?: string
  type?: string
  number?: number
  name?: string
  exp?: string
  editing?: boolean
  selected?: boolean
  zip?: string
}

type LineItemProps = {
  card: CreditCard
  edit: (id: string) => void
  remove: (id: string) => void
  select: (id: string) => void
  setSecurityCode: (e: FormEvent<HTMLInputElement>) => void
}

const LineItem = ({ card, edit, remove, select, setSecurityCode }: LineItemProps) => {
  const editCard = () => edit(card.id)
  const removeCard = () => remove(card.id)
  const selectCard = () => select(card.id)

  return (
    <div className={paymentStyles['credit-card']} key={card.id}>
      <input
        type="radio"
        value={card.id}
        onClick={selectCard}
        name="card"
        defaultChecked={card.selected}
      />
      <div className={paymentStyles['credit-card__line-item']}>
        <div className={paymentStyles['credit-card__info']}>
          <img src={card.logo} alt="Credit card logo" />
          <div className={paymentStyles['credit-card__details']}>
            {!card.editing && (
              <>
                <h3>{card.type} &minus; {card.number}</h3>
                <p className={layoutStyles.light}>{card.name}&nbsp;&nbsp;|&nbsp;&nbsp;exp. {card.exp}</p>
              </>
            )}
            {card.editing && (
              <div className={paymentStyles['edit-credit-card']}>
                {/* <input type="text" placeholder="4242 4242 4242 4242" /> */}
                <div className={layoutStyles.row}>
                  <input type="text" placeholder="Full Name" defaultValue={card.name} />
                  <input type="text" placeholder="MM/YY" defaultValue={card.exp} />
                </div>
              </div>
            )}
            <div className={`${paymentStyles['credit-card__actions']} ${paymentStyles['credit-card__actions--spacing-top']}`}>
              <button
                className={cardStyles['action-button']}
                onClick={editCard}
              >Edit</button>
              <span className={layoutStyles.light}>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
              <button
                className={cardStyles['action-button']}
                onClick={removeCard}
              >Delete</button>
            </div>
          </div>
        </div>
        {card.selected && (
          <div className={paymentStyles['credit-card__security-code']}>
            <label>Security Code</label>
            <div className={paymentStyles.form}>
              <input type="password" placeholder="000" onChange={setSecurityCode} />
              <label className={`${layoutStyles.small} ${layoutStyles.light}`}>
                <svg width="45" height="37" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="#727272"><path d="M64 48C37.5 48 16 69.5 16 96v32H560V96c0-26.5-21.5-48-48-48H64zM16 144v96H560V144H16zm0 112V416c0 26.5 21.5 48 48 48H512c26.5 0 48-21.5 48-48V256H16zM0 96C0 60.7 28.7 32 64 32H512c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM96 360c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8s-3.6 8-8 8H104c-4.4 0-8-3.6-8-8zm128 0c0-4.4 3.6-8 8-8H376c4.4 0 8 3.6 8 8s-3.6 8-8 8H232c-4.4 0-8-3.6-8-8z"/></svg>
                <span>3-digits on back of card</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LineItem