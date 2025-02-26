import cartReducer, {
    initializeCart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCard,
    setLoading,
    setError
} from '@/store/cartSlice';

describe('cart reducer', () => {
    const initialState = {
        cart: [],
        error: null
    };

    // Test initial state
    it('should return the initial state', () => {
        expect(cartReducer(undefined, { type: undefined })).toEqual(initialState);
    });

    // Test initializeCart
    it('should handle initializeCart', () => {
        const mockItems = [
            { id: '1', name: 'Product 1', price: 100, quantity: 2 },
            { id: '2', name: 'Product 2', price: 200, quantity: 1 }
        ];

        const newState = cartReducer(initialState, initializeCart(mockItems));
        expect(newState.cart).toEqual(mockItems);
    });

    // Test addToCart
    it('should handle addToCart', () => {
        const mockItem = { id: '1', name: 'Product 1', price: 100, quantity: 1 };
        const newState = cartReducer(initialState, addToCart(mockItem));
        expect(newState.cart).toHaveLength(1);
        expect(newState.cart[0]).toEqual(mockItem);
    });

    // Test multiple items in cart
    it('should handle adding multiple items to cart', () => {
        let state = cartReducer(initialState, addToCart({ id: '1', name: 'Product 1', price: 100, quantity: 1 }));
        state = cartReducer(state, addToCart({ id: '2', name: 'Product 2', price: 200, quantity: 1 }));

        expect(state.cart).toHaveLength(2);
        expect(state.cart[0].id).toBe('1');
        expect(state.cart[1].id).toBe('2');
    });

    // Test removeFromCart
    it('should handle removeFromCart', () => {
        const mockState = {
            ...initialState,
            cart: [
                { id: '1', name: 'Product 1', price: 100, quantity: 1 },
                { id: '2', name: 'Product 2', price: 200, quantity: 1 }
            ]
        };

        const newState = cartReducer(mockState, removeFromCart('1'));
        expect(newState.cart).toHaveLength(1);
        expect(newState.cart[0].id).toBe('2');
    });

    // Test increaseQuantity
    it('should handle increaseQuantity', () => {
        const mockState = {
            ...initialState,
            cart: [
                { id: '1', name: 'Product 1', price: 100, quantity: 1 }
            ]
        };

        const newState = cartReducer(mockState, increaseQuantity(0));
        expect(newState.cart[0].quantity).toBe(2);
    });

    // Test decreaseQuantity (quantity > 1)
    it('should handle decreaseQuantity when quantity > 1', () => {
        const mockState = {
            ...initialState,
            cart: [
                { id: '1', name: 'Product 1', price: 100, quantity: 2 }
            ]
        };

        const newState = cartReducer(mockState, decreaseQuantity(0));
        expect(newState.cart[0].quantity).toBe(1);
    });

    // Test decreaseQuantity (quantity = 1)
    it('should remove item when decreaseQuantity and quantity = 1', () => {
        const mockState = {
            ...initialState,
            cart: [
                { id: '1', name: 'Product 1', price: 100, quantity: 1 }
            ]
        };

        const newState = cartReducer(mockState, decreaseQuantity(0));
        expect(newState.cart).toHaveLength(0);
    });

    // Test decreaseQuantity with multiple items
    it('should remove correct item when decreaseQuantity with multiple items', () => {
        const mockState = {
            ...initialState,
            cart: [
                { id: '1', name: 'Product 1', price: 100, quantity: 2 },
                { id: '2', name: 'Product 2', price: 200, quantity: 1 },
                { id: '3', name: 'Product 3', price: 300, quantity: 3 }
            ]
        };

        // Decrease quantity of second item (index 1) that has quantity of 1
        const newState = cartReducer(mockState, decreaseQuantity(1));
        expect(newState.cart).toHaveLength(2);
        expect(newState.cart[0].id).toBe('1');
        expect(newState.cart[1].id).toBe('3');
    });

    // Test clearCard
    it('should handle clearCard', () => {
        const mockState = {
            ...initialState,
            cart: [
                { id: '1', name: 'Product 1', price: 100, quantity: 1 },
                { id: '2', name: 'Product 2', price: 200, quantity: 2 }
            ]
        };

        const newState = cartReducer(mockState, clearCard());
        expect(newState.cart).toHaveLength(0);
    });

    // Test setError
    it('should handle setError', () => {
        const errorMessage = 'Something went wrong';
        const newState = cartReducer(initialState, setError(errorMessage));
        expect(newState.error).toBe(errorMessage);
    });

    // Test setLoading
    it('should handle setLoading', () => {
        const newState = cartReducer(initialState, setLoading(true));
        expect(newState.isLoading).toBe(true);
    });
});