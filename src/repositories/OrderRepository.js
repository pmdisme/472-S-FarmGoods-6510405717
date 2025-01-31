import { PrismaClient } from '@prisma/client'

export class OrderRepository {
    constructor() {
        this.prisma = new PrismaClient()
    }

    async findByStatusEqualO() {
        return await this.prisma.order.findFirst({
            where: { orderStatus: 0 },
            include: {
                orderDetails: {
                    include: {
                        product: true
                    }
                }
            }
        })
    }
}