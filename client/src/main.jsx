import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
