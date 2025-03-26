import {PrismaClient} from '@prisma/client';
import {OrderService} from "@/services/OrderService";

jest.mock('@prisma/client');
jest.mock('../../repositories/ProductRepository');
jest.mock('../../repositories/OrderRepository');
jest.mock('../../repositories/OrderDetailRepository');

describe('OrderService', () => {
    let orderService;
    let mockPrismaOrder;
    let mockPrismaOrderDetail;

    beforeEach(() => {
        jest.clearAllMocks();

        mockPrismaOrder = {
            create: jest.fn()
        };
        mockPrismaOrderDetail = {
            create: jest.fn(),
            update: jest.fn()
        };

        PrismaClient.mockImplementation(() => ({
            order: mockPrismaOrder,
            orderDetail: mockPrismaOrderDetail
        }));

        orderService = new OrderService();
    });

    describe('getActiveCart', () => {
        it('should return active cart from order repository', async () => {
            const mockCart = {orderId: 1, orderStatus: 0};
            orderService.orderRepository.findByStatusEqualO.mockResolvedValue(mockCart);

            const result = await orderService.getActiveCart();

            expect(orderService.orderRepository.findByStatusEqualO).toHaveBeenCalled();
            expect(result).toEqual(mockCart);
        });

        it('should return null when no active cart exists', async () => {
            orderService.orderRepository.findByStatusEqualO.mockResolvedValue(null);

            const result = await orderService.getActiveCart();

            expect(result).toBeNull();
        });
    });


    describe('getCartDetails', () => {
        it('should return transformed cart details when active cart exists', async () => {
            const mockCart = {
                orderId: 1,
                orderStatus: 0,
                purchaseDatetime: new Date(),
                purchaseOption: 1,
                orderDetails: [
                    {
                        quantity: 2,
                        orderTotalAmount: 200,
                        product: {
                            productId: 1,
                            productName: 'Test Product',
                            productPrice: 100
                        }
                    }
                ]
            };

            orderService.orderRepository.findByStatusEqualO.mockResolvedValue(mockCart);

            const result = await orderService.getCartDetails();

            expect(result).toEqual({
                orderId: mockCart.orderId,
                orderStatus: mockCart.orderStatus,
                purchaseDate: mockCart.purchaseDatetime,
                purchaseOption: mockCart.purchaseOption,
                products: [{
                    productId: 1,
                    productName: 'Test Product',
                    price: 100,
                    quantity: 2,
                    totalAmount: 200
                }],
                totalCartAmount: 200
            });
        });

        it('should return null when no active cart exists', async () => {
            orderService.orderRepository.findByStatusEqualO.mockResolvedValue(null);

            const result = await orderService.getCartDetails();

            expect(result).toBeNull();
        });
    });

    describe('getOrderDetails', () => {
        it('should return transformed order details when order exists', async () => {
            const mockOrder = {
                orderId: 1,
                orderStatus: 1,
                purchaseDatetime: new Date(),
                purchaseOption: 1,
                orderDetails: [
                    {
                        quantity: 2,
                        orderTotalAmount: 200,
                        product: {
                            productId: 1,
                            productName: 'Test Product',
                            productPrice: 100
                        }
                    }
                ]
            };

            orderService.orderRepository.findById.mockResolvedValue(mockOrder);

            const result = await orderService.getOrderDetails(1);

            expect(result).toEqual({
                orderId: mockOrder.orderId,
                orderStatus: mockOrder.orderStatus,
                purchaseDate: mockOrder.purchaseDatetime,
                purchaseOption: mockOrder.purchaseOption,
                products: [{
                    productId: 1,
                    productName: 'Test Product',
                    price: 100,
                    quantity: 2,
                    totalAmount: 200
                }],
                totalCartAmount: 200
            });
        });

        it('should return null when order does not exist', async () => {
            orderService.orderRepository.findById.mockResolvedValue(null);

            const result = await orderService.getOrderDetails(999);

            expect(result).toBeNull();
        });
    });

    describe('addOrder', () => {
        it('should create order with correct data', async () => {
            const mockCartItems = [
                { id: 1, quantity: 2, price: 100 }
            ];
            const mockPaymentMethods = 'CREDIT_CARD';
            const mockCreatedOrder = {
                orderId: 1,
                orderStatus: 1
            };

            orderService.orderRepository.addOrder.mockResolvedValue(mockCreatedOrder);

            const result = await orderService.addOrder(mockCartItems, mockPaymentMethods);

            expect(orderService.orderRepository.addOrder).toHaveBeenCalledWith(
                [{
                    productId: 1,
                    quantity: 2,
                    orderTotalAmount: 200
                }],
                mockPaymentMethods
            );
            expect(result).toEqual(mockCreatedOrder);
        });
    });
});