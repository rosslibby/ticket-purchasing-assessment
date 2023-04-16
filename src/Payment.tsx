import { FormEvent, useContext, useState } from 'react'
import Card from './Card'
import { cartContext } from './contexts/cart'
import cardStyles from './styles/card.module.sass'
import layoutStyles from './styles/layout.module.sass'
import paymentStyles from './styles/payment.module.sass'
import { CARD_LOGOS } from './data'
import LineItem from './Payment/LineItem'

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

const Payment = () => {
  const cart = useContext(cartContext)
  const [addCard, setAddCard] = useState<boolean>(false)
  const [newCard, setNewCard] = useState<CreditCard>({ id: '0' })
  const [securityCode, setSecurityCode] = useState<string>('')
  const [newCardSteps, setNewCardSteps] = useState<{
    number: boolean
    exp: boolean
    zip: boolean
    name: boolean
  }>({
    number: false,
    exp: false,
    zip: false,
    name: false,
  })
  const [cards, setCards] = useState<CreditCard[]>([
    {
      id: '0',
      logo: CARD_LOGOS.Visa,
      type: 'Visa',
      number: 9999,
      name: 'John Doe',
      exp: '00/11',
      editing: false,
      selected: true,
    }
  ])

  const toggleAddCard = () => {
    if (!addCard) {
      setNewCard({ id: cards.length.toString() })
    }

    setAddCard(!addCard)
  }

  const updateSecurityCode = (e: FormEvent<HTMLInputElement>) => {
    const code = e.currentTarget.value

    cart.actions.updatePayment(code.match(/^[0-9]{3}$/) !== null)

    setSecurityCode(code)
  }

  const updateCardNumber = (e: FormEvent<HTMLInputElement>) => {
    const cardNumberStr = e.currentTarget.value
      ?.replaceAll(' ', '')
      .replaceAll('-', '')
    const cardNumber = parseInt(cardNumberStr, 10)
    let cardType: string = ''

    if (cardNumberStr.length > 16) return

    switch(cardNumberStr[0]) {
      case '3':
        cardType = 'AMEX'
        break
      case '4':
        cardType = 'Visa'
        break
      case '5':
        cardType = 'Mastercard'
        break
      case '6':
        cardType = 'Discover'
        break
      default:
        break
    }

    if (cardType === 'AMEX' && cardNumberStr.length < 15) {
      setNewCardSteps({ ...newCardSteps, number: false })
    }
    else if (cardNumberStr.length < 16) {
      setNewCardSteps({ ...newCardSteps, number: false })
    } else {
      setNewCardSteps({ ...newCardSteps, number: true })
    }

    setNewCard({
      ...newCard,
      number: cardNumber,
      type: cardType,
      logo: CARD_LOGOS[cardType],
    })
  }

  const updateCardDate = (e: FormEvent<HTMLInputElement>) => {
    const date = e.currentTarget.value

    // Check date format MM/YY
    if (!date.match(/^[0-1][0-9]\/[2-9][0-9]$/)) {
      setNewCardSteps({ ...newCardSteps, exp: false })
    } else {
      setNewCardSteps({ ...newCardSteps, exp: true })
    }

    setNewCard({ ...newCard, exp: date })
  }

  const updateCardName = (e: FormEvent<HTMLInputElement>) => {
    const name = e.currentTarget.value

    // Check first and last name exist
    if (!name.match(/^[a-zA-Z]{1,25}\s[a-zA-Z]{1,25}$/)) {
      setNewCardSteps({ ...newCardSteps, name: false })
    } else {
      setNewCardSteps({ ...newCardSteps, name: true })
    }

    setNewCard({ ...newCard, name })
  }

  const updateCardZip = (e: FormEvent<HTMLInputElement>) => {
    const zip = e.currentTarget.value

    // Check first and last name exist
    if (!zip.match(/^[0-9]{5}$/)) {
      setNewCardSteps({ ...newCardSteps, zip: false })
    } else {
      setNewCardSteps({ ...newCardSteps, zip: true })
    }

    setNewCard({ ...newCard, zip })
  }

  const saveCard = async () => {
    await setCards((prevState: CreditCard[]) => [
      ...prevState.map(card => ({
        ...card,
        selected: false,
      })),
      {
        ...newCard,
        number: newCard.number && parseInt(newCard.number.toString().substring(newCard.number.toString().length - 4, newCard.number.toString().length), 10),
        selected: true
      }
    ])
    setNewCard({ id: cards.length.toString() })
    setNewCardSteps({
      number: false,
      exp: false,
      zip: false,
      name: false,
    })
    setAddCard(false)
  }

  const deleteCard = (id: string) => setCards(
    (prevState: CreditCard[]) => prevState.filter(
      (card: CreditCard) => card.id !== id
    )
  )

  const editCard = (id: string) => setCards(
    (prevState: CreditCard[]) => prevState.map(
      (card: CreditCard) => ({
        ...card,
        editing: card.id === id,
      })
    )
  )

  const selectCard = (id: string) => setCards(
    (prevState: CreditCard[]) => prevState.map(
      (card: CreditCard) => ({
        ...card,
        selected: card.id === id,
      })
    )
  )

  const saveCardDisabled = newCardSteps.exp === false
    || newCardSteps.zip === false
    || newCardSteps.name === false
    || newCardSteps.number === false

  return (
    <Card title="Payment">
      <h3>Use Credit / Debit Card</h3>
      <div className={paymentStyles['payment-form']}>
        {cards.map((card: CreditCard) => (
          <LineItem
            card={card}
            edit={editCard}
            key={card.id}
            remove={deleteCard}
            select={selectCard}
            setSecurityCode={updateSecurityCode}
          />
        ))}
        {!addCard && (
          <div className={paymentStyles['add-credit-card']}>
            <button className={`${cardStyles['action-button']} ${cardStyles['action-button__icon']}`} onClick={toggleAddCard}>+</button>
            <svg width="45" height="37" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M64 48C37.5 48 16 69.5 16 96V416c0 26.5 21.5 48 48 48H512c26.5 0 48-21.5 48-48V96c0-26.5-21.5-48-48-48H64zM0 96C0 60.7 28.7 32 64 32H512c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM96 360c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8s-3.6 8-8 8H104c-4.4 0-8-3.6-8-8zm128 0c0-4.4 3.6-8 8-8H376c4.4 0 8 3.6 8 8s-3.6 8-8 8H232c-4.4 0-8-3.6-8-8z"/></svg>
            <span className={paymentStyles['credit-card__actions']}><button onClick={toggleAddCard}>Add New Card</button></span>
          </div>
        )}

        {addCard && (
          <div className={paymentStyles['add-credit-card-form']}>
            <div className={`${paymentStyles['credit-card']} ${paymentStyles['credit-card--full']}`}>
              <h3>Add New Card</h3>
              <form className={`${paymentStyles.form} ${paymentStyles['form--edit-card']}`}>
                <div className={paymentStyles.number}>
                  <label htmlFor="credit-card-number">Card number</label>
                  <div className={paymentStyles.number__form}>
                    <input
                      defaultValue={newCard?.number}
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      id="credit-card-number"
                      onChange={updateCardNumber}
                    />
                    <label className={`${layoutStyles.small} ${layoutStyles.light}`}>
                      <svg width="45" height="37" fill="#727272" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M64 48C37.5 48 16 69.5 16 96V416c0 26.5 21.5 48 48 48H512c26.5 0 48-21.5 48-48V96c0-26.5-21.5-48-48-48H64zM0 96C0 60.7 28.7 32 64 32H512c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM96 360c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8s-3.6 8-8 8H104c-4.4 0-8-3.6-8-8zm128 0c0-4.4 3.6-8 8-8H376c4.4 0 8 3.6 8 8s-3.6 8-8 8H232c-4.4 0-8-3.6-8-8z"/></svg>
                      <span>16-digits on front of card</span>
                    </label>
                  </div>
                </div>
                <div className={paymentStyles.details}>
                  <div className={paymentStyles.details__form}>
                    <label htmlFor="cc-full-name">Full Name</label>
                    <input
                      defaultValue={newCard?.name}
                      type="text"
                      placeholder="John Doe"
                      id="cc-full-name"
                      onChange={updateCardName}
                    />
                  </div>
                  <div className={paymentStyles.details__form}>
                    <label htmlFor="cc-exp">Exp. date</label>
                    <input
                      defaultValue={newCard?.exp}
                      type="text"
                      placeholder="MM/YY"
                      id="cc-exp"
                      onChange={updateCardDate}
                    />
                  </div>
                  <div className={paymentStyles.details__form}>
                    <label htmlFor="cc-zip">Zip</label>
                    <input
                      defaultValue={newCard?.zip}
                      type="text"
                      placeholder="92127"
                      id="cc-zip"
                      onChange={updateCardZip}
                    />
                  </div>
                </div>
              </form>
              <br />
              <span className={layoutStyles.light}>
                <button
                  className={cardStyles['action-button']}
                  disabled={saveCardDisabled}
                  onClick={saveCard}
                >Save card</button>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <button className={`${cardStyles['action-button']} ${cardStyles['action-button--secondary']}`} onClick={toggleAddCard}>Cancel</button>
              </span>
            </div>
          </div>
        )}
        <div className={`${paymentStyles['add-credit-card']} ${paymentStyles['add-credit-card--alternate-payment']}`}>
          <h3>Or Pay With</h3>
          <p>By using a digital wallet and continuing past this page, you have read and are accepting the <a href="#">Terms of Use</a>.</p>
        </div>
      </div>
    </Card>
  )
}

export default Payment