import { ProductController } from "@/controllers/ProductController";
import { ProductService } from "@/services/ProductService";
import { PrismaClient } from "@prisma/client";

describe('ProductController', () => {
    let productController
    let productService

    beforeEach(() => {
        // สร้าง mock function สำหรับ getAllProducts
        productService = {
            getAllProducts: jest.fn()
        };

        productController = new ProductController()
        productController.productService = productService

        // Mock Response.json() เพราะ jest ไม่มีให้
        global.Response = {
            json: jest.fn((data, init) => ({ ...data, status: init.status }))
        };
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('showProduct should return all products successfully', async () => {
        const testProducts = [
            { productId: 1, productName: 'Apple' },
            { productId: 2, productName: 'Banana'},
            { productId: 3, productName: 'Watermelon'}
        ]

        productService.getAllProducts.mockResolvedValue(testProducts) // ถ้า mock สำเร็จจะ return test data

        const response = await productController.showProduct()

        expect(response).toEqual({ success: true, data: testProducts, status: 200 }) // เช็คว่าถูก format ไหม
        expect(productService.getAllProducts).toHaveBeenCalledTimes(1); // เช็คว่าโดนเรียกหนึ่งครั้งไหม
    })

    test('showProduct should thrown an error 500 if can not get products', async () => {
        productService.getAllProducts.mockRejectedValue(new Error("Database error"))

        const response = await productController.showProduct()

        expect(response).toEqual({ error: "Database error", status: 500 });
        expect(productService.getAllProducts).toHaveBeenCalledTimes(1);
    })
})