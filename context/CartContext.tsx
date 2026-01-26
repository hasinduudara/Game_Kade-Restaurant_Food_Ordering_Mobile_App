import React, { createContext, useContext, useState, ReactNode } from 'react';

// 1. Define the shape of a Cart Item
export type CartItem = {
    id: number | string;
    name: string;
    price: string; // Keep as string to match your data (e.g., "Rs. 1500.00")
    image: any;
    quantity: number;
};

// 2. Define the Context Type (Functions & Data available to the app)
type CartContextType = {
    items: CartItem[];
    addToCart: (item: any) => void;
    removeFromCart: (id: number | string) => void;
    updateQuantity: (id: number | string, action: 'increase' | 'decrease') => void;
    getTotalPrice: () => number;
    cartCount: number;
};

// Create Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// 3. Provider Component
export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    // Function: Add item to cart
    const addToCart = (product: any) => {
        setItems((prevItems) => {
            // Check if item already exists
            const existingItem = prevItems.find((item) => item.id === product.id);

            if (existingItem) {
                // If exists, increase quantity
                return prevItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // If new, add to array with quantity 1
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    };

    // Function: Remove item completely
    const removeFromCart = (id: number | string) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    // Function: Increase or Decrease quantity
    const updateQuantity = (id: number | string, action: 'increase' | 'decrease') => {
        setItems((prevItems) => {
            return prevItems.map((item) => {
                if (item.id === id) {
                    if (action === 'increase') return { ...item, quantity: item.quantity + 1 };
                    if (action === 'decrease') return { ...item, quantity: Math.max(1, item.quantity - 1) };
                }
                return item;
            });
        });
    };

    // Function: Calculate Total Price
    const getTotalPrice = () => {
        return items.reduce((total, item) => {
            // Clean price string (remove "Rs.", "," and spaces) -> "Rs. 1,500.00" to 1500.00
            const priceNumber = parseFloat(item.price.replace(/[^0-9.]/g, ''));
            return total + (priceNumber * item.quantity);
        }, 0);
    };

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            getTotalPrice,
            cartCount: items.length
        }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom Hook to use the Cart Context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};