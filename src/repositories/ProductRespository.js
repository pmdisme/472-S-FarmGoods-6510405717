import { PrismaClient } from "@prisma/client";

export class ProductRepository {
    constructor() {
        this.prisma = new PrismaClient()
    }

    async findById(productId) {
        return await this.prisma.product.findUnique({
            where: { productId: parseInt(productId) }
        })
    }
}