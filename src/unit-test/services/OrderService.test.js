import { PrismaClient } from '@prisma/client';
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
            const mockCart = { orderId: 1, orderStatus: 0 };
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

    describe('addToCart', () => {
        const mockProduct = {
            productId: 1,
            productPrice: 100
        };

        it('should create new cart and add product when no active cart exists', async () => {
            const quantity = 2;
            const mockNewCart = { orderId: 1, orderStatus: 0 };
            const mockOrderDetail = { orderDetailId: 1, quantity, orderTotalAmount: 200 };

            orderService.productRepository.findById.mockResolvedValue(mockProduct);
            orderService.orderRepository.findByStatusEqualO.mockResolvedValue(null);
            mockPrismaOrder.create.mockResolvedValue(mockNewCart);
            mockPrismaOrderDetail.create.mockResolvedValue(mockOrderDetail);

            const result = await orderService.addToCart(mockProduct.productId, quantity);

            expect(mockPrismaOrder.create).toHaveBeenCalled();
            expect(mockPrismaOrderDetail.create).toHaveBeenCalledWith({
                data: {
                    orderId: mockNewCart.orderId,
                    productId: mockProduct.productId,
                    quantity,
                    orderTotalAmount: mockProduct.productPrice * quantity
                }
            });
            expect(result).toEqual(mockOrderDetail);
        });

        it('should update existing order detail when product already in cart', async () => {
            const quantity = 2;
            const existingCart = { orderId: 1, orderStatus: 0 };
            const existingDetail = {
                orderDetailId: 1,
                quantity: 1,
                orderTotalAmount: 100
            };
            const updatedDetail = {
                orderDetailId: 1,
                quantity: 3,
                orderTotalAmount: 300
            };

            orderService.productRepository.findById.mockResolvedValue(mockProduct);
            orderService.orderRepository.findByStatusEqualO.mockResolvedValue(existingCart);
            orderService.orderDetailRepository.findByProductIdAndOrderId.mockResolvedValue(existingDetail);
            mockPrismaOrderDetail.update.mockResolvedValue(updatedDetail);

            const result = await orderService.addToCart(mockProduct.productId, quantity);

            expect(mockPrismaOrderDetail.update).toHaveBeenCalledWith({
                where: { orderDetailId: existingDetail.orderDetailId },
                data: {
                    quantity: existingDetail.quantity + quantity,
                    orderTotalAmount: existingDetail.orderTotalAmount + (mockProduct.productPrice * quantity)
                }
            });
            expect(result).toEqual(updatedDetail);
        });

        it('should throw error when product not found', async () => {
            orderService.productRepository.findById.mockResolvedValue(null);

            await expect(orderService.addToCart(999, 1))
                .rejects
                .toThrow('Product not found');
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
});