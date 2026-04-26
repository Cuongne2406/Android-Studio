import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const loadCart = async () => {
            try {
                const storedCart = await AsyncStorage.getItem('userCart');
                if (storedCart) {
                    setCart(JSON.parse(storedCart));
                }
            } catch (e) {
                console.error("Failed to load cart", e);
            }
        };
        loadCart();
    }, []);

    const saveCart = async (newCart) => {
        setCart(newCart);
        try {
            await AsyncStorage.setItem('userCart', JSON.stringify(newCart));
        } catch (e) {
            console.error("Failed to save cart", e);
        }
    };

    const addToCart = (plant) => {
        const newCart = [...cart];
        const index = newCart.findIndex(item => item.plantId === plant._id);
        
        if (index >= 0) {
            newCart[index].qty += 1;
        } else {
            newCart.push({
                plantId: plant._id,
                name: plant.name,
                price: plant.price,
                imageUrl: plant.imageUrl,
                qty: 1
            });
        }
        saveCart(newCart);
    };

    const removeFromCart = (plantId) => {
        const newCart = cart.filter(item => item.plantId !== plantId);
        saveCart(newCart);
    };

    const clearCart = () => {
        saveCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
