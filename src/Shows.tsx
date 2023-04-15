import { FormEvent, MouseEvent, useCallback, useContext, useMemo, useState } from 'react'
import Card from './Card'
import { CartProvider, Show, cartContext } from './contexts/cart'

const ENDPOINT = 'https://app.ticketmaster.com'
const TICKETMASTER_API_KEY = 'GC1x1aepNZWBv4rXugPoN5oWj4F3TGTD'

type Quantity = {
  id: string
  value: number
}

const formatPrice = (price: number) => price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

const Shows = ({ changePage }: { changePage: (id: string) => void }) => {
  const {
    show: selectedShow,
    actions: {
      updateShow,
      updateQuantity: updateCartQuantity,
    }
  } = useContext(cartContext)
  const [selected, setSelected] = useState<string | null>(null)
  const [shows, setShows] = useState<Show[]>([])
  const [fetched, setFetched] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [quantity, setQuantity] = useState<Quantity>({
    id: '',
    value: 0,
  })

  const incrementQuantity = (id: string) => {
    if (id === selected) {
      const value = quantity.value + 1

      setQuantity({
        ...quantity,
        value,
      })
      updateCartQuantity(value)
    }
  }
  const decrementQuantity = (id: string) => {
    if (id === selected && quantity.value > 0) {
      const value = quantity.value - 1

      setQuantity({
        ...quantity,
        value,
      })
      updateCartQuantity(value)
    }
  }
  const updateQuantity = (e: FormEvent<HTMLInputElement>, id: string) => {
    const value = e.currentTarget.value

    if (value.match(/^[0-9]{1}$/)) {
      const parsedValue = parseInt(e.currentTarget.value, 10)

      setQuantity({
        ...quantity,
        value: parsedValue,
      })
      updateCartQuantity(parsedValue)
    }
  }

  const fetchShows = useCallback(async () => {
    if (!fetched) {
      setLoading(true)

      const { _embedded: { events }} = await (await fetch(`${ENDPOINT}/discovery/v2/events.json?classificationName=music&dmaId=324&apikey=${TICKETMASTER_API_KEY}`)).json()

      const showsArr = events.map((event: any) => ({
        id: event.id,
        date: event.dates.start.dateTime,
        name: event.name,
        price: parseFloat(event.priceRanges?.pop()?.max),
      }))

      setShows(showsArr)

      setLoading(false)
    }
  }, [fetched, setLoading, setShows])

  useMemo(() => {
    if (!fetched && !loading) {
      fetchShows()
      setFetched(true)
    }
  }, [fetched, fetchShows, loading, setFetched])

  const handleClick = (e: MouseEvent, id: string) => {
    const { target } = e

    // Do not trigger quantity as a select/deselect operation
    if (!(target as HTMLElement).closest('.quantity')) {
      if (id === selected) {
        setSelected(null)
        setQuantity({ id: '', value: 0 })
      } else {
        const selectedShow = shows.find((show: Show) => show.id === id)

        if (selectedShow) {
          updateShow(selectedShow)
          setSelected(id)
          setQuantity({ id, value: 1 })
          updateCartQuantity(1)
        }
      }
    }
  }

  return (
    <CartProvider>
      <Card title="Upcoming shows">
        <>
          <div className="shows">
            {!loading && shows.map((show: any) => (
              <div className={
                selected
                  ? show.id === selected ? 'show show--selected' : 'show show--disabled'
                  : 'show'
                } key={show.id} onClick={(e: MouseEvent) => handleClick(e, show.id)}>
                <h3>{show.name}</h3>
                <span className="pricing">{formatPrice(show.price)}</span>
                <span className="quantity">
                  <button
                    disabled={show.id !== selected}
                    onClick={() => decrementQuantity(show.id)}
                  >-</button>
                  <input
                    disabled={show.id !== selected}
                    onChange={(e: FormEvent<HTMLInputElement>) => updateQuantity(e, show.id)}
                    type="text"
                    value={quantity.id === show.id ? quantity.value : 0}
                  />
                  <button
                    disabled={show.id !== selected}
                    onClick={() => incrementQuantity(show.id)}
                  >+</button>
                </span>
              </div>
            ))}
          </div>
          {selected && selectedShow && (
            <div className="cart">
              <div className="row row--cart">
                <span>{selectedShow?.name}</span>
                <span>{(new Date(selectedShow?.date || '')).toLocaleString('en-US', {
                  dateStyle: 'long',
                })}</span>
              </div>
              <div className="row row--cart row--summary">
                {/* <span className="small">{(new Date(selectedShow?.date || '')).toLocaleString('en-US', {
                  dateStyle: 'long',
                })}</span> */}
                <span className="small">{quantity.value}&nbsp;&nbsp;&times;&nbsp;&nbsp;{formatPrice(selectedShow.price)}</span>
                <span>{formatPrice(selectedShow.price * quantity.value)}</span>
              </div>
              <div className="row row--cart">
                <button className="checkout" disabled={quantity.value === 0} onClick={() => changePage('checkout')}>Checkout</button>
              </div>
            </div>
          )}
        </>
      </Card>
    </CartProvider>
  )
}

export default Shows