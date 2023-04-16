import { useState } from 'react'
import './App.sass'
import Column from './Column'
import Delivery from './Delivery'
import Payment from './Payment'
import Shows from './Shows'
import Total from './Total'
import { CartProvider } from './contexts/cart'
import Cart from './Shows/Cart'

function App() {
  const [page, setPage] = useState<string>('shows')
  const changePage = (id: string) => setPage(id)

  if (page === 'shows') {
    return (
      <div className="main main--shows">
        <CartProvider>
          <Shows changePage={changePage} />
        </CartProvider>
      </div>
    )
  }

  return (
    <div className="main">
      <CartProvider>
        <Column>
          <Delivery />
          <Payment />
        </Column>
        <Total />
      </CartProvider>
    </div>
  )
}

export default App
