import { ProductService } from "@/services/ProductService";
import { PrismaClient } from "@prisma/client";
import path from 'path';
import fs from "fs";

// Mock fs module
jest.mock('fs', () => ({
    promises: {
        mkdir: jest.fn(() => Promise.resolve()),
        writeFile: jest.fn(() => Promise.resolve())
    }
}));

// Mock dependencies
jest.mock('@prisma/client', () => {
    const testPrisma = {
        product: {
            findMany: jest.fn(),
            findUnique: jest.fn()
        }
    }
    return { PrismaClient: jest.fn(() => testPrisma) }
})

// Mock ProductRepository
jest.mock('../../repositories/ProductRepository', () => {
    return {
        ProductRepository: jest.fn().mockImplementation(() => ({
            findByName: jest.fn().mockImplementation(() => Promise.resolve(null)),
            create: jest.fn().mockImplementation(() => Promise.resolve({})),
            update: jest.fn().mockImplementation(() => Promise.resolve({})),
            delete: jest.fn().mockImplementation(() => Promise.resolve())
        }))
    }
});

describe('ProductService', () => {
    let productService;
    let prismaTest;
    let productRepoMock;

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();

        // Create a new ProductService instance
        productService = new ProductService();

        // Get mocked instances
        prismaTest = productService.prisma;
        productRepoMock = productService.productRepo;
    });

    // Tests for getAllProducts (existing tests)
    describe('getAllProducts', () => {
        test('should return products sorted by name', async () => {
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

        test('should throw an error when cannot fetch products', async () => {
            prismaTest.product.findMany.mockRejectedValue(new Error("Database Error"));

            await expect(productService.getAllProducts()).rejects.toThrow("Failed to fetch products");
            expect(prismaTest.product.findMany).toHaveBeenCalledTimes(1);
        })
    });

    // Tests for createProduct method
    describe('createProduct', () => {
        // Mock file for image upload
        const mockImageFile = {
            name: 'test-image.jpg',
            arrayBuffer: jest.fn()
        };

        test('should successfully create a product with image upload', async () => {
            const productName = 'New Product';
            const productPrice = 19.99;
            const mockBuffer = Buffer.from('mock image data');
            mockImageFile.arrayBuffer.mockResolvedValue(mockBuffer);

            // แก้ไขการ mock repository methods
            productRepoMock.findByName.mockResolvedValueOnce(null);
            productRepoMock.create.mockResolvedValueOnce({
                productId: 1,
                productName: productName,
                productPrice: productPrice
            });
            productRepoMock.update.mockResolvedValueOnce({
                productId: 1,
                productName: productName,
                productPrice: productPrice,
                productImage: '/images/products/1.jpg'
            });

            const result = await productService.createProduct(productName, productPrice, mockImageFile);

            // เช็คว่า fs operations ถูก mock จริงๆ
            const fs = require('fs');
            expect(fs.promises.mkdir).toHaveBeenCalled();
            expect(fs.promises.writeFile).toHaveBeenCalled();

            expect(result).toEqual({
                productId: 1,
                productName: productName,
                productPrice: productPrice,
                productImage: '/images/products/1.jpg'
            });
        });

        test('should throw error when product name already exists', async () => {
            // Prepare mock data
            const productName = 'Existing Product';
            const productPrice = 29.99;

            // Mock an existing product
            productRepoMock.findByName.mockResolvedValue({
                productId: 2,
                productName: productName
            });

            // Call the method and expect an error
            await expect(
                productService.createProduct(productName, productPrice, mockImageFile)
            ).rejects.toThrow('Product name already exists');

            // Verify findByName was called
            expect(productRepoMock.findByName).toHaveBeenCalledWith(productName);
        });

        test('should handle image upload error', async () => {
            const productName = 'New Product';
            const productPrice = 39.99;
            const mockBuffer = Buffer.from('mock image data');
            mockImageFile.arrayBuffer.mockResolvedValue(mockBuffer);

            productRepoMock.findByName.mockResolvedValueOnce(null);
            productRepoMock.create.mockResolvedValueOnce({
                productId: 1,
                productName: productName,
                productPrice: productPrice
            });

            // Mock writeFile ให้ throw error
            const fs = require('fs');
            fs.promises.writeFile.mockRejectedValueOnce(new Error('File write error'));

            await expect(
                productService.createProduct(productName, productPrice, mockImageFile)
            ).rejects.toThrow('Failed to create product: File write error');

            expect(productRepoMock.findByName).toHaveBeenCalledWith(productName);
            expect(productRepoMock.create).toHaveBeenCalled();
            expect(fs.promises.writeFile).toHaveBeenCalled();
            expect(productRepoMock.delete).toHaveBeenCalled();
        });
    });
});