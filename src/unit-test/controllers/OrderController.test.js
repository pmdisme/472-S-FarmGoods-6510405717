import {OrderController} from '@/controllers/OrderController';
import {OrderService} from '@/services/OrderService';

// Mock OrderService
jest.mock('../../services/OrderService');

// Mock Response object
global.Response = {
    json: (data, options = {}) => {
        const response = {
            status: options.status || 200,
            json: async () => data
        };
        return response;
    }
};

describe('OrderController', () => {
    let orderController;
    let mockOrderService;

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();

        // Create a new instance of OrderService mock
        mockOrderService = new OrderService();

        // Create a new OrderController instance
        orderController = new OrderController();
        // Replace the real service with our mock
        orderController.orderService = mockOrderService;
    });

    describe('addOrder', () => {
        it('should create order successfully', async () => {
            const mockRequest = {
                json: jest.fn().mockResolvedValue({
                    cartItems: [{ id: 1, quantity: 2 }],
                    paymentMethods: 'CREDIT_CARD'
                })
            };
            const mockOrder = { orderId: 1 };
            
            mockOrderService.addOrder.mockResolvedValue(mockOrder);

            const response = await orderController.addOrder(mockRequest);
            const data = await response.json();

            expect(data).toEqual(mockOrder);
            expect(mockOrderService.addOrder).toHaveBeenCalledWith(
                [{ id: 1, quantity: 2 }],
                'CREDIT_CARD'
            );
        });

        it('should return 500 on error', async () => {
            const mockRequest = {
                json: jest.fn().mockResolvedValue({
                    cartItems: [{ id: 1, quantity: 2 }],
                    paymentMethods: 'CREDIT_CARD'
                })
            };
            
            mockOrderService.addOrder.mockRejectedValue(new Error('Failed to create order'));

            const response = await orderController.addOrder(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data).toEqual({ error: 'Failed to create order' });
        });
    });
});