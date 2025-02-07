import { PrismaClient } from '@prisma/client'
import { ProductRepository } from '@/repositories/ProductRepository'

export class ProductService {
    constructor() {
        this.prisma = new PrismaClient()
        this.productRepo = new ProductRepository()
    }

    // get products
    async getAllProducts() {
        try {
            return await this.prisma.product.findMany({
                orderBy: { productName: 'asc' }
            })
        } catch (error) {
            throw new Error("Failed to fetch products")
        }
    }
}