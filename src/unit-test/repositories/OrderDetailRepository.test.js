import { OrderDetailRepository } from "@/repositories/OrderDetailRepository";

let mockFindFirst;

jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn().mockImplementation(() => {
            mockFindFirst = jest.fn();

            return {
                orderDetail: {
                    findFirst: mockFindFirst
                }
            };
        })
    };
});

describe('OrderDetailRepository', () => {
    let orderDetailRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        orderDetailRepository = new OrderDetailRepository();
    });

    describe('findByProductIdAndOrderId', () => {
        it('should return orderDetail when valid orderId and productId are provided', async () => {
            const mockOrderDetail = {
                orderDetailId: 1,
                orderTotalAmount: 100.00,
                quantity: 2,
                orderId: 1,
                productId: 1
            };
            mockFindFirst.mockResolvedValue(mockOrderDetail);

            const result = await orderDetailRepository.findByProductIdAndOrderId(1, 1);

            expect(mockFindFirst).toHaveBeenCalledWith({
                where: {
                    orderId: 1,
                    productId: 1
                }
            });
            expect(result).toEqual(mockOrderDetail);
        });

        it('should return null when no orderDetail exists for given orderId and productId', async () => {
            mockFindFirst.mockResolvedValue(null);

            const result = await orderDetailRepository.findByProductIdAndOrderId(999, 999);

            expect(mockFindFirst).toHaveBeenCalledWith({
                where: {
                    orderId: 999,
                    productId: 999
                }
            });
            expect(result).toBeNull();
        });

        it('should handle non-numeric orderId and productId', async () => {
            mockFindFirst.mockResolvedValue(null);

            const result = await orderDetailRepository.findByProductIdAndOrderId('invalid', 'invalid');

            expect(mockFindFirst).toHaveBeenCalledWith({
                where: {
                    orderId: 'invalid',
                    productId: 'invalid'
                }
            });
            expect(result).toBeNull();
        });

        it('should handle undefined parameters', async () => {
            mockFindFirst.mockResolvedValue(null);

            const result = await orderDetailRepository.findByProductIdAndOrderId(undefined, undefined);

            expect(mockFindFirst).toHaveBeenCalledWith({
                where: {
                    orderId: undefined,
                    productId: undefined
                }
            });
            expect(result).toBeNull();
        });

        it('should handle null parameters', async () => {
            mockFindFirst.mockResolvedValue(null);

            const result = await orderDetailRepository.findByProductIdAndOrderId(null, null);

            expect(mockFindFirst).toHaveBeenCalledWith({
                where: {
                    orderId: null,
                    productId: null
                }
            });
            expect(result).toBeNull();
        });

        it('should handle missing productId', async () => {
            mockFindFirst.mockResolvedValue(null);

            const result = await orderDetailRepository.findByProductIdAndOrderId(1);

            expect(mockFindFirst).toHaveBeenCalledWith({
                where: {
                    orderId: 1,
                    productId: undefined
                }
            });
            expect(result).toBeNull();
        });
    });
});