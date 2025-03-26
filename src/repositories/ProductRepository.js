import {PrismaClient} from '@prisma/client'

export class ProductRepository {
    constructor() {
        this.prisma = new PrismaClient()
    }

    async findById(productId) {
        return this.prisma.product.findUnique({
            where: {productId: parseInt(productId)}
        });
    }

    async findByName(productName) {
        return this.prisma.product.findFirst({
            where: {
                productName: {
                    equals: productName,
                    mode: 'insensitive'  // ไม่สนใจตัวพิมพ์เล็ก-ใหญ่
                }
            }
        });
    }

    async create(productData) {
        return this.prisma.product.create({
            data: {
                productName: productData.productName,
                productPrice: productData.productPrice,
                productImage: productData.productImage
            }
        });
    }

    async update(productId, data) {
        return this.prisma.product.update({
            where: { productId },
            data: data
        });
    }

    async delete(productId) {
        try {
            await this.prisma.product.delete({
                where: { productId: productId }
            });
        } catch (error) {
            throw new Error(`Failed to delete product with ID ${productId}: ${error.message}`);
        }
    }
}
