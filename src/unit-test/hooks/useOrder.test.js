import { renderHook, act } from '@testing-library/react';
import { useOrder } from '@/hooks/useOrder'
import { useAppSelector, useAppDispatch } from '../../utils/hooks';
import { setOrderId } from '../../store/orderSlice';

// Mock dependencies
jest.mock('../../utils/hooks', () => ({
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn()
}));


jest.mock('../../store/orderSlice', () => ({
    setOrderId: jest.fn()
}));


global.fetch = jest.fn();

describe('useOrder', () => {
    let mockDispatch;

    beforeEach(() => {
        jest.clearAllMocks();
        
        // Mock cart items from Redux store
        useAppSelector.mockReturnValue([
            { id: 1, quantity: 2, price: 100 }
        ]);

        // Mock dispatch
        mockDispatch = jest.fn();
        useAppDispatch.mockReturnValue(mockDispatch);

        // Reset fetch mock
        global.fetch.mockReset();
    });

    describe('addOrder', () => {
        it('should successfully create order and update store', async () => {
            const mockOrder = { orderId: 1 };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockOrder)
            });

            const { result } = renderHook(() => useOrder());

            await act(async () => {
                const order = await result.current.addOrder('CREDIT_CARD');
                expect(order).toEqual(mockOrder);
            });

            // Check loading state
            expect(result.current.isLoading).toBe(false);
            expect(result.current.error).toBeNull();

            // Verify fetch call
            expect(global.fetch).toHaveBeenCalledWith('/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentMethods: 'CREDIT_CARD',
                    cartItems: [{ id: 1, quantity: 2, price: 100 }]
                }),
            });

            // Verify Redux action
            expect(setOrderId).toHaveBeenCalledWith(1);
            expect(mockDispatch).toHaveBeenCalledWith(setOrderId(1));
        });

        it('should handle API error', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false
            });

            const { result } = renderHook(() => useOrder());

            await act(async () => {
                try {
                    await result.current.addOrder('CREDIT_CARD');
                    fail('Should have thrown error');
                } catch (error) {
                    expect(error.message).toBe('Failed to complete order');
                }
            });

            // Check error state
            expect(result.current.isLoading).toBe(false);
            expect(result.current.error).toBe('Failed to complete order');

            // Verify Redux action was not called
            expect(setOrderId).not.toHaveBeenCalled();
            expect(mockDispatch).not.toHaveBeenCalled();
        });

        it('should handle network error', async () => {
            const networkError = new Error('Network error');
            global.fetch.mockRejectedValueOnce(networkError);

            const { result } = renderHook(() => useOrder());

            await act(async () => {
                try {
                    await result.current.addOrder('CREDIT_CARD');
                    fail('Should have thrown error');
                } catch (error) {
                    expect(error).toBe(networkError);
                }
            });

            // Check error state
            expect(result.current.isLoading).toBe(false);
            expect(result.current.error).toBe('Network error');

            // Verify Redux action was not called
            expect(setOrderId).not.toHaveBeenCalled();
            expect(mockDispatch).not.toHaveBeenCalled();
        });
    });
});