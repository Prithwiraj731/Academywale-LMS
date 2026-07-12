import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (err) {
        console.error('Error parsing cart from localStorage:', err);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  const addToCart = (course, selectedMode, selectedAttempt, price) => {
    const courseId = course.id || course._id;
    const uniqueId = `${courseId}-${selectedMode}-${selectedAttempt}`;

    const cartItem = {
      id: courseId,
      uniqueId,
      subject: course.subject || course.title,
      title: course.title || course.subject,
      posterUrl: course.poster_url || course.posterUrl || '',
      facultyName: course.faculty_name || course.facultyName || 'Expert Faculty',
      mode: selectedMode,
      attempt: selectedAttempt,
      price: price,
      courseType: course.courseType || 'general'
    };

    let added = false;
    setCartItems(prev => {
      const exists = prev.some(item => item.uniqueId === uniqueId);
      if (exists) {
        return prev;
      }
      const newCart = [...prev, cartItem];
      localStorage.setItem('cart', JSON.stringify(newCart));
      added = true;
      return newCart;
    });
    return added;
  };

  const removeFromCart = (uniqueId) => {
    setCartItems(prev => {
      const newCart = prev.filter(item => item.uniqueId !== uniqueId);
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const isInCart = (courseId, selectedMode, selectedAttempt) => {
    const uniqueId = `${courseId}-${selectedMode}-${selectedAttempt}`;
    return cartItems.some(item => item.uniqueId === uniqueId);
  };

  const cartTotal = cartItems.reduce((total, item) => total + Number(item.price || 0), 0);
  const cartCount = cartItems.length;

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      isInCart,
      cartCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
