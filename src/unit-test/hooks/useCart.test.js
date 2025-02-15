import { renderHook } from '@testing-library/react';
import { useCart } from '@/hooks/useCart';
import { useAppDispatch } from '@/utils/hooks';
import { initializeCart, setLoading, setError } from '@/store/cartSlice';

// Mock dependencies
jest.mock('../../utils/hooks', () => ({
    useAppDispatch: jest.fn()
}));

jest.mock('../../store/cartSlice', () => ({
    initializeCart: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn()
}));

// Mock global fetch
global.fetch = jest.fn();

describe('useCart hook', () => {
    let mockDispatch;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Setup mock dispatch
        mockDispatch = jest.fn();
        useAppDispatch.mockReturnValue(mockDispatch);
    });

    test('should fetch and initialize cart successfully', async () => {
        // Mock successful fetch response
        const mockProducts = [
            {
                productId: 1,
                productName: 'Test Product',
                price: 10,
                quantity: 2
            }
        ];

        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ products: mockProducts })
        });

        // Render the hook
        renderHook(() => useCart());

        // Wait for promises to resolve
        await new Promise(resolve => setTimeout(resolve, 0));

        // Verify dispatch calls
        expect(mockDispatch).toHaveBeenCalledWith(setLoading(true));
        expect(mockDispatch).toHaveBeenCalledWith(
            initializeCart([{
                id: 1,
                name: 'Test Product',
                price: 10,
                quantity: 2
            }])
        );
        expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
    });

    test('should handle 404 response', async () => {
        // Mock 404 response
        fetch.mockResolvedValueOnce({
            status: 404,
            json: () => Promise.resolve({})
        });

        renderHook(() => useCart());

        // Wait for promises to resolve
        await new Promise(resolve => setTimeout(resolve, 0));

        // Verify dispatch calls
        expect(mockDispatch).toHaveBeenCalledWith(setLoading(true));
        expect(mockDispatch).toHaveBeenCalledWith(initializeCart([]));
        expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
    });

    test('should handle fetch error', async () => {
        // Mock network error
        fetch.mockRejectedValueOnce(new Error('Network error'));

        // Spy on console.error to prevent actual error logging
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        renderHook(() => useCart());

        // Wait for promises to resolve
        await new Promise(resolve => setTimeout(resolve, 0));

        // Verify dispatch calls
        expect(mockDispatch).toHaveBeenCalledWith(setLoading(true));
        expect(mockDispatch).toHaveBeenCalledWith(setError('Failed to fetch cart'));
        expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));

        // Restore console.error
        consoleErrorSpy.mockRestore();
    });

    test('should handle unexpected response format', async () => {
        // Mock response without products
        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: () => Promise.resolve({})
        });

        renderHook(() => useCart());

        // Wait for promises to resolve
        await new Promise(resolve => setTimeout(resolve, 0));

        // Verify dispatch calls
        expect(mockDispatch).toHaveBeenCalledWith(setLoading(true));
        expect(mockDispatch).toHaveBeenCalledWith(setError('Unexpected response format'));
        expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
    });
});