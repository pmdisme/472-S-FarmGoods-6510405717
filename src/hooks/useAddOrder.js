import { useState } from 'react';
import { useAppSelector } from '@/utils/hooks';


export const useAddOrder = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const cartItems = useAppSelector((state) => state.cart.cart)

    const addOrder = async (paymentMethod) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ paymentMethod, cartItems }),
            });

            if (!response.ok) {
                throw new Error('Failed to complete order');
            }
            
            return await response.json();
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { addOrder , isLoading, error };
};