import {OrderRepository} from "@/repositories/OrderRepository";

let mockFindFirst;
let mockFindUnique;
let mockCreate;

jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn().mockImplementation(() => {
            mockFindFirst = jest.fn();
            mockFindUnique = jest.fn();
            mockCreate = jest.fn();

            return {
                order: {
                    create: mockCreate,
                    findFirst: mockFindFirst,
                    findUnique: mockFindUnique
                }
            };
        })
    };
});

describe('OrderRepository', () => {
    let orderRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        orderRepository = new OrderRepository();
    });

    describe('findByStatusEqualO', () => {
        it('should return order with status 0 including orderDetails and product', async () => {
            const mockOrder = {
                orderId: 1,
                orderStatus: 0,
                orderDetails: [
                    {
                        id: 1,
                        product: {
                            id: 1,
                            name: 'Test Product'
                        }
                    }
                ]
            };

            mockFindFirst.mockResolvedValue(mockOrder);

            const result = await orderRepository.findByStatusEqualO();

            expect(mockFindFirst).toHaveBeenCalledWith({
                where: {orderStatus: 0},
                include: {
                    orderDetails: {
                        include: {
                            product: true
                        }
                    }
                }
            });
            expect(result).toEqual(mockOrder);
        });

        it('should return null when no order with status 0 exists', async () => {
            mockFindFirst.mockResolvedValue(null);

            const result = await orderRepository.findByStatusEqualO();

            expect(result).toBeNull();
        });
    });

    describe('findById', () => {
        it('should return order when valid ID is provided', async () => {
            const mockOrder = {
                orderId: 1,
                orderStatus: 0
            };
            mockFindUnique.mockResolvedValue(mockOrder);

            const result = await orderRepository.findById('1');

            expect(mockFindUnique).toHaveBeenCalledWith({
                where: {
                    where: {orderId: 1}
                }
            });
            expect(result).toEqual(mockOrder);
        });

        it('should return null when order does not exist', async () => {
            mockFindUnique.mockResolvedValue(null);
            const result = await orderRepository.findById('999');

            expect(result).toBeNull();
        });

        it('should handle non-numeric order ID', async () => {
            mockFindUnique.mockResolvedValue(null);

            const result = await orderRepository.findById('invalid');

            expect(mockFindUnique).toHaveBeenCalledWith({
                where: {
                    where: {orderId: NaN}
                }
            });
            expect(result).toBeNull();
        });
    });

    describe('addOrder', () => {
        it('should create new order with cart items and payment method', async () => {
            const mockCartItem = [
                { productId: 1, quantity: 2, orderTotalAmount: 200 }
            ];
            const mockPaymentMethods = 'CREDIT_CARD';
            const mockCreatedOrder = {
                orderId: 1,
                orderStatus: 1
            };

            mockCreate.mockResolvedValue(mockCreatedOrder);

            const result = await orderRepository.addOrder(mockCartItem, mockPaymentMethods);

            expect(result).toEqual(mockCreatedOrder);
            expect(mockCreate).toHaveBeenCalledWith({
                data: {
                    orderDetails: {create: mockCartItem},
                    paymentMethods: mockPaymentMethods,
                    purchaseDatetime: expect.any(Date)
                }
            });
        });
    });
});