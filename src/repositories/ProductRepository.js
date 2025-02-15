import {PrismaClient} from '@prisma/client'

export class ProductRepository {
    constructor() {
        this.prisma = new PrismaClient()
    }

    async findById(productId) {
        return await this.prisma.product.findUnique({
            where: {productId: parseInt(productId)}
        })
    }

    async findByName(productName) {
        return await this.prisma.product.findFirst({
            where: {
                productName: {
                    equals: productName,
                    mode: 'insensitive'  // ไม่สนใจตัวพิมพ์เล็ก-ใหญ่
                }
            }
        });
    }

    async create(productData) {
        return await this.prisma.product.create({
            data: {
                productName: productData.productName,
                productPrice: productData.productPrice,
                productImage: productData.productImage
            }
        });
    }

    async update(productId, data) {
        return await this.prisma.product.update({
            where: { productId },
            data: data
        });
    }
}
