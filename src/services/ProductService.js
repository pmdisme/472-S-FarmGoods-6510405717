import { PrismaClient } from '@prisma/client'
import { ProductRepository } from '@/repositories/ProductRepository'

export class ProductService {
    constructor() {
        this.prisma = new PrismaClient()
        this.productRepo = new ProductRepository()
    }

    // get products
    async getAllProducts(req, res) {
        try {
            const products = await prisma.product.findMany({
                orderBy: {
                    productName: 'asc' // sort order by product name (a-z)
                }
            })

        return res.status(200).json({
            success: true,
            data: products
        })
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch products'
            })
        }
    }

    // get order details
    async getProductDetails(req, res) {
        try {
            const {id} = req.query // get id from request query

            const product = await prisma.product.findUnique({
                where: {
                    productId: Number(id)
                }
            })
            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                })
            }
            return res.status(200).json({
                success: true,
                data: product
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch product details'
            })
        }
    }
}