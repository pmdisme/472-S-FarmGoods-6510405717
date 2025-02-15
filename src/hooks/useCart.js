import { useEffect } from 'react';
import { useAppDispatch } from '@/utils/hooks';
import { initializeCart, setLoading, setError } from '@/store/cartSlice';

export const useCart = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchCartData = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch('/api/cart');
        const data = await response.json();
        
        if (response.status === 404) {
          dispatch(initializeCart([]));
          return;
        }

        if (response.ok && data && data.products) {
          const cartProducts = data.products.map(product => ({
            id: product.productId,
            name: product.productName,
            price: product.price,
            quantity: product.quantity
          }));
          dispatch(initializeCart(cartProducts));
        } else {
          dispatch(setError('Unexpected response format'));
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        dispatch(setError('Failed to fetch cart'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCartData();
  }, [dispatch]);
};