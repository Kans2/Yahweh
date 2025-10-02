import { useState } from 'react'
import './App.css'
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import {Toaster} from 'react-hot-toast';
function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route element={<ProductList/>} path='/'/>
           <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route
        path="*"
        element={
          <div style={{ textAlign: "center", padding: 40 }}>
            <h2>404 - Not found</h2>
            <a href="/">Go Home</a>
          </div>
        }
      />
        </Routes>
      </Router>
    </>
  )
}

export default App
