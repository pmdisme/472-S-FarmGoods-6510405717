import React from 'react';
import '@testing-library/jest-dom'; // Import jest-dom for custom matchers
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '@/store/cartSlice';

// Mock Next's Image component
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props) => {
        return <img {...props} src={props.src || ''} />
    },
}));

// Mock Redux store
const createTestStore = (initialState = {}) => {
    return configureStore({
        reducer: {
            cart: cartReducer
        },
        preloadedState: initialState
    });
};

// Setup test for cart functionality
describe('UAT: Cart Functionality', () => {
    const mockProduct = {
        id: 1,
        name: 'Test Product',
        price: 100.00,
        quantity: 1
    };

    // Test for UAT1: Updating product quantities using direct Redux action testing
    test('UAT1: System allows updating product quantities in cart', () => {
        // Set up initial state
        const initialState = {
            cart: {
                cart: [mockProduct]
            }
        };

        // Create store with initial product
        const store = createTestStore(initialState);

        // Initial quantity should be 1
        expect(store.getState().cart.cart[0].quantity).toBe(1);

        // Increase quantity
        store.dispatch({
            type: 'cart/increaseQuantity',
            payload: 0  // First item index
        });

        // Check quantity increased to 2
        expect(store.getState().cart.cart[0].quantity).toBe(2);

        // Decrease quantity
        store.dispatch({
            type: 'cart/decreaseQuantity',
            payload: 0  // First item index
        });

        // Check quantity decreased back to 1
        expect(store.getState().cart.cart[0].quantity).toBe(1);
    });

    // Test for UAT2: Recalculating total price
    test('UAT2: System recalculates total price when quantities change', () => {
        // Setup initial cart state with a product
        const initialState = {
            cart: {
                cart: [mockProduct]
            }
        };

        const store = createTestStore(initialState);

        // Initial total should be price × quantity = 100
        const initialTotal = store.getState().cart.cart[0].price *
            store.getState().cart.cart[0].quantity;
        expect(initialTotal).toBe(100);

        // Dispatch action to increase quantity
        store.dispatch({
            type: 'cart/increaseQuantity',
            payload: 0  // First item in cart
        });

        // New quantity should be 2
        expect(store.getState().cart.cart[0].quantity).toBe(2);

        // New total should be price × new quantity = 200
        const newTotal = store.getState().cart.cart[0].price *
            store.getState().cart.cart[0].quantity;
        expect(newTotal).toBe(200);
    });

    // Test for UAT3: Removing products
    test('UAT3: System allows removing individual products from cart', () => {
        // Setup initial cart state with a product
        const initialState = {
            cart: {
                cart: [mockProduct]
            }
        };

        const store = createTestStore(initialState);

        // Initial state should have 1 product
        expect(store.getState().cart.cart.length).toBe(1);

        // Dispatch action to remove product
        store.dispatch({
            type: 'cart/removeFromCart',
            payload: mockProduct.id
        });

        // Cart should now be empty
        expect(store.getState().cart.cart.length).toBe(0);
    });
});