import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/utils/hooks';
import { setOrderId } from '@/store/orderSlice';


export const useOrder = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const cartItems = useAppSelector((state) => state.cart.cart)
    const orderId = useAppSelector((state) => state.order.orderId)

    const dispatch = useAppDispatch();

    const addOrder = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cartItems }),
            });

            if (!response.ok) {
                throw new Error('Failed to complete order');
            }
            const order = await response.json(); 
            dispatch(setOrderId(order.orderId));

            return order

        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };


    const updateStatusOrder = async (paymentMethod) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId, paymentMethod }),
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

    return { addOrder , updateStatusOrder, isLoading, error };
};