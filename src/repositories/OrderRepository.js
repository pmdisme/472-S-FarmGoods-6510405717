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

    async findById(orderId) {
        return await this.prisma.order.findUnique({
            where: {
                where: { orderId: parseInt(orderId) }       
            }
        })
    }

    async addOrder(cartItem) {
        return await this.prisma.order.create({
            data: {
                orderStatus: 0,
                orderDetails: {create: cartItem},
                purchaseDatetime: new Date()
            }
        });
    }

    async updateStatusOrder(orderId, paymentMethod){
        return await this.prisma.order.update({
            where: {orderId},
            data: {
                orderStatus: 1,
                paymentMethods: paymentMethod,
            }
        });
    }

}