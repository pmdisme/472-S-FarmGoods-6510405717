import { OrderRepository } from "@/repositories/OrderRepository";

let mockFindFirst;
let mockFindUnique;

jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn().mockImplementation(() => {
            mockFindFirst = jest.fn();
            mockFindUnique = jest.fn();

            return {
                order: {
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
                where: { orderStatus: 0 },
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
                    where: { orderId: 1 }
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
                    where: { orderId: NaN }
                }
            });
            expect(result).toBeNull();
        });
    });
});