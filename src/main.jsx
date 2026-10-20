import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { ProductsProvider } from './context/ProductsContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProductsProvider>
            <CartProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </CartProvider>
          </ProductsProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
