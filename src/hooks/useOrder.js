import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/utils/hooks';
import { setOrderId } from '@/store/orderSlice';


export const useOrder = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const cartItems = useAppSelector((state) => state.cart.cart)
    const orderId = useAppSelector((state) => state.order.orderId)

    const dispatch = useAppDispatch();

    const addOrder = async (paymentMethods) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ paymentMethods, cartItems }),
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


    

    return { addOrder, isLoading, error };
};