import { PrismaClient } from '@prisma/client'

export class OrderDetailRepository {
    constructor() {
        this.prisma = new PrismaClient()
    }

    async findByProductIdAndOrderId(orderId, productId) {
        return await this.prisma.orderDetail.findFirst({
            where: {
                orderId,
                productId
            }
        })
    }
}