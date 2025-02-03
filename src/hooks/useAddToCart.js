export const useAddToCart = () => {

  const addItemToCart = async (productId, quantity = 1) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      if (response.ok) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  return { addItemToCart };
};