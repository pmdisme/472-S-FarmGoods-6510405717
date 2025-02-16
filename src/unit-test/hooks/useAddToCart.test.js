import {act, renderHook} from '@testing-library/react';
import {useAddToCart} from '@/hooks/useAddToCart';

// Mock fetch
global.fetch = jest.fn();

describe('useAddToCart', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    test('should successfully add item to cart', async () => {
        // Mock successful response
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({}),
        });

        const {result} = renderHook(() => useAddToCart());

        // Use act to wrap state updates
        const addResult = await act(async () => {
            return await result.current.addItemToCart(1, 2);
        });

        // Assertions
        expect(fetch).toHaveBeenCalledWith('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId: 1,
                quantity: 2,
            }),
        });
        expect(addResult).toBe(true);
    });

    test('should return false when fetch fails', async () => {
        // Mock failed response
        fetch.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({}),
        });

        const {result} = renderHook(() => useAddToCart());

        const addResult = await act(async () => {
            return await result.current.addItemToCart(1);
        });

        // Assertions
        expect(fetch).toHaveBeenCalledWith('/api/cart', expect.any(Object));
        expect(addResult).toBe(false);
    });

    test('should handle network errors', async () => {
        // Mock console.error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        });

        // Mock network error
        fetch.mockRejectedValueOnce(new Error('Network error'));

        const {result} = renderHook(() => useAddToCart());

        const addResult = await act(async () => {
            return await result.current.addItemToCart(1);
        });

        // Assertions
        expect(fetch).toHaveBeenCalledWith('/api/cart', expect.any(Object));
        expect(addResult).toBe(false);

        // Restore console.error
        consoleErrorSpy.mockRestore();
    });
});