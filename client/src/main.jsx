import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Import your environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const CLERK_DOMAIN = import.meta.env.VITE_CLERK_DOMAIN; // <-- Import your custom domain

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Pass the domain prop to ClerkProvider */}
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      domain={CLERK_DOMAIN}
    >
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ClerkProvider>
  </React.StrictMode>,
);
