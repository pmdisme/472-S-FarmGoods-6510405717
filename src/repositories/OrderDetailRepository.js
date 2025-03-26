import { PrismaClient } from '@prisma/client'

export class OrderDetailRepository {
    constructor() {
        this.prisma = new PrismaClient()
    }

    async findByProductIdAndOrderId(orderId, productId) {
        return this.prisma.orderDetail.findFirst({
            where: {
                orderId,
                productId
            }
        });
    }
}