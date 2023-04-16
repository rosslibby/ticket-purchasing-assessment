import {
  MouseEvent,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react'
import { CartProvider, Show, cartContext } from './contexts/cart'
import Card from './Card'
import Cart from './Shows/Cart'
import Quantity from './Shows/Quantity'

const ENDPOINT = 'https://app.ticketmaster.com'
const TICKETMASTER_API_KEY = 'GC1x1aepNZWBv4rXugPoN5oWj4F3TGTD'

const formatPrice = (price: number) => price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

const Shows = ({ changePage }: { changePage: (id: string) => void }) => {
  const {
    show: selectedShow,
    quantity: cartQuantity,
    actions: {
      updateShow,
      updateQuantity: updateCartQuantity,
    }
  } = useContext(cartContext)
  const [selected, setSelected] = useState<string | null>(null)
  const [shows, setShows] = useState<Show[]>([])
  const [fetched, setFetched] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

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
      } else {
        const selectedShow = shows.find((show: Show) => show.id === id)

        if (selectedShow) {
          updateShow(selectedShow)
          setSelected(id)
          updateCartQuantity(1)
        }
      }
    }
  }

  const showClassname = (id: string) => {
    if (selected) {
      if (id === selected) return 'show show--selected'
      return 'show show--disabled'
    }

    return 'show'
  }

  return (
    <CartProvider>
      <Card title="Upcoming shows">
        <>
          <div className="shows">
            {!loading && shows.map((show: any) => (
              <div
                className={showClassname(show.id)}
                key={show.id}
                onClick={(e: MouseEvent) => handleClick(e, show.id)}
              >
                <h3>{show.name}</h3>
                <span className="pricing">{formatPrice(show.price)}</span>
                <Quantity
                  id={show.id}
                  show={selectedShow}
                  key={`quantity-${show.id}`}
                  quantity={cartQuantity}
                  updateQuantity={updateCartQuantity}
                />
              </div>
            ))}
          </div>
          <Cart changePage={changePage} show={selectedShow} quantity={cartQuantity} />
        </>
      </Card>
    </CartProvider>
  )
}

export default Shows