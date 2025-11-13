// import React, { createContext, useCallback, useContext, useEffect, useReducer, useState } from "react";

// const CartContext = createContext();


// // reducer handling cartv actions like dd, remove, update quantity and itesm
// const cartReducer = (state, action) => {
//   switch (action.type) {
//     case 'ADD_ITEM': {
//       const { item, quantity } = action.payload;
//       const existingItem = state.find(i => i.id === item.id);
//       if (existingItem) {
//         return state.map(i =>
//           i.id === item.id ? { ...i, quantity } : i
//         );
//       }
//       return [...state, { ...item, quantity }];
//     }
//     case 'REMOVE_ITEM': {
//       return state.filter(i => i.id !== action.payload.itemId);
//     }
//     case 'UPDATE_QUANTITY': {
//       const { itemId, newQuantity } = action.payload;
//       return state.map(i =>
//         i.id === itemId ? { ...i, quantity: Math.max(1, newQuantity) } : i
//       );
//     }
//     default: return state;
//   }
// }

// // cart from local storage
// const initializer = () => {
//   if (typeof window !== 'undefined') {
//     const localCart = localStorage.getItem('cart');
//     return localCart ? JSON.parse(localCart) : [];
//   }
//   return [];
// }


// export const CartProvider = ({ children }) => {
//   const [cartItems, dispatch] = useReducer(cartReducer, [], initializer);
//   // Persist cart state to localstorage
//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(cartItems));
//   }, [cartItems]);

//   // calculate total cost and total items count
//   const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
//   const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

//   // format total items in power form 
//   const formatTotalItems = (num) => {
//     if (num >= 1000) {
//       return (num / 1000).toFixed(1) + 'k';
//     }
//     return num;
//   }

//   // dispacter wrapper with useCallback for performance
//   const addToCart = useCallback((item, quantity) => {
//     dispatch({ type: 'ADD_ITEM', payload: { item, quantity } })
//   }, []);

//   const removeFromCart = useCallback((itemId) => {
//     dispatch({ type: 'REMOVE_ITEM', payload: { itemId } })
//   }, []);

//   const updateQuantity = useCallback((itemId, newQuantity) => {
//     dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, newQuantity } })
//   }, []);

//   return (
//     <CartContext.Provider value={{
//       cartItems,
//       addToCart,
//       removeFromCart,
//       updateQuantity,
//       cartTotal,
//       totalItems: formatTotalItems(totalItemsCount),
//     }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const CartContext = createContext();

// reducer handling cart actions
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { item, quantity } = action.payload;
      const existingItem = state.find((i) => i.id === item.id);

      if (existingItem) {
        return state.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + quantity } // ✅ increment instead of overwrite
            : i
        );
      }

      return [...state, { ...item, quantity }];
    }

    case "REMOVE_ITEM": {
      return state.filter((i) => i.id !== action.payload.itemId);
    }

    case "UPDATE_QUANTITY": {
      const { itemId, newQuantity } = action.payload;
      return state.map((i) =>
        i.id === itemId ? { ...i, quantity: Math.max(1, newQuantity) } : i
      );
    }

    default:
      return state;
  }
};

// cart from local storage
const initializer = () => {
  if (typeof window !== "undefined") {
    const localCart = localStorage.getItem("cart");
    return localCart ? JSON.parse(localCart) : [];
  }
  return [];
};

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, [], initializer);

  // Persist cart state
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ normalize numbers before calculating total
  const cartTotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );
  const totalItemsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // utility
  const formatTotalItems = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num;
  };

  // ✅ normalize item structure here
  const addToCart = useCallback((item, quantity = 1) => {
    const normalizedItem = {
      id: item.id,
      name: item.name || item.title || "Unnamed",
      price:
        typeof item.price === "string"
          ? Number(item.price.replace(/[^\d.-]/g, "")) // remove ₹, $, etc.
          : item.price,
      image: item.image || "/images/placeholder.png",
    };

    dispatch({ type: "ADD_ITEM", payload: { item: normalizedItem, quantity } });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    dispatch({ type: "REMOVE_ITEM", payload: { itemId } });
  }, []);

  const updateQuantity = useCallback((itemId, newQuantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { itemId, newQuantity } });
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        totalItems: formatTotalItems(totalItemsCount),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
