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

    describe('addToCart', () => {
        it('should successfully add item to cart', async () => {
            // Arrange
            const mockRequest = {
                json: jest.fn().mockResolvedValue({
                    productId: 1,
                    quantity: 2
                })
            };

            const mockResult = {
                orderDetailId: 1,
                quantity: 2,
                productId: 1,
                orderId: 1
            };

            mockOrderService.addToCart.mockResolvedValue(mockResult);

            // Act
            const response = await orderController.addToCart(mockRequest);
            const data = await response.json();

            // Assert
            expect(response.status).toBe(201);
            expect(data).toEqual(mockResult);
            expect(mockOrderService.addToCart).toHaveBeenCalledWith(1, 2);
        });

        it('should return 404 when product not found', async () => {
            // Arrange
            const mockRequest = {
                json: jest.fn().mockResolvedValue({
                    productId: 999,
                    quantity: 1
                })
            };

            mockOrderService.addToCart.mockRejectedValue(new Error('Product not found'));

            // Act
            const response = await orderController.addToCart(mockRequest);
            const data = await response.json();

            // Assert
            expect(response.status).toBe(404);
            expect(data).toEqual({error: 'Product not found'});
        });

        it('should return 500 on general error', async () => {
            // Arrange
            const mockRequest = {
                json: jest.fn().mockResolvedValue({
                    productId: 1,
                    quantity: 1
                })
            };

            mockOrderService.addToCart.mockRejectedValue(new Error('Database error'));

            const response = await orderController.addToCart(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data).toEqual({error: 'Database error'});
        });
    });

    describe('getCart', () => {
        it('should successfully retrieve cart details', async () => {
            // Arrange
            const mockCartDetails = {
                orderId: 1,
                orderStatus: 0,
                orderDetails: [
                    {
                        orderDetailId: 1,
                        quantity: 2,
                        productId: 1,
                        product: {
                            productName: 'Test Product',
                            productPrice: 100
                        }
                    }
                ]
            };

            mockOrderService.getCartDetails.mockResolvedValue(mockCartDetails);

            const response = await orderController.getCart();
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual(mockCartDetails);
        });

        it('should return 404 when no active cart found', async () => {
            mockOrderService.getCartDetails.mockResolvedValue(null);

            const response = await orderController.getCart();
            const data = await response.json();

            expect(response.status).toBe(404);
            expect(data).toEqual({message: 'No active cart found'});
        });

        it('should return 500 on general error', async () => {
            mockOrderService.getCartDetails.mockRejectedValue(new Error('Database error'));

            const response = await orderController.getCart();
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data).toEqual({error: 'Database error'});
        });
    });
});