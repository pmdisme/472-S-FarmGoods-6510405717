import { ProductRepository } from '@/repositories/ProductRepository'
import { PrismaClient } from '@prisma/client'

// Mock เพื่อป้องกันจากการเชื่อมต่อฐานข้อมูลจริง
jest.mock('@prisma/client', () => {
    const testPrisma = {
        product: {
            findUnique: jest.fn()
        }
    }
    return { PrismaClient: jest.fn(() => testPrisma) }
})

describe('ProductRepository', () => {
    let productRepository
    let prismaTest

    beforeEach(() => {
        productRepository = new ProductRepository()
        prismaTest = productRepository.prisma
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('findById should return product found by id', async () => {
        const testProduct = { productId: 123, productName: 'Apple' }
        
        prismaTest.product.findUnique.mockResolvedValue(testProduct)

        const result = await productRepository.findById(123)

        expect(result).toEqual(testProduct)
        expect(prismaTest.product.findUnique).toHaveBeenCalledWith({
            where: { productId: 123 }
        })
    })
})