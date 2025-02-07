import { ProductService } from "@/services/ProductService"; 
import { PrismaClient } from "@prisma/client";

// Mock เพื่อป้องกันจากการเชื่อมต่อฐานข้อมูลจริง
jest.mock('@prisma/client', () => {
    const testPrisma = {
        product: {
            findMany: jest.fn(),
            findUnique: jest.fn()
        }
    }
    return { PrismaClient: jest.fn(() => testPrisma) }
})

describe('ProductService', () => {
    let productService
    let prismaTest

    beforeEach(() => {
        productService = new ProductService()
        prismaTest = productService.prisma 
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('getAllProducts should return products sorted by name', async () => {
        const testProducts = [
            { productId: 1, productName: 'Apple' },
            { productId: 2, productName: 'Banana'},
            { productId: 3, productName: 'Watermelon'}
        ]

        prismaTest.product.findMany.mockResolvedValue(testProducts)

        const result = await productService.getAllProducts()

        expect(result).toEqual(testProducts)
        expect(prismaTest.product.findMany).toHaveBeenCalledWith({
            orderBy: { productName: 'asc' }
        })
    })
})