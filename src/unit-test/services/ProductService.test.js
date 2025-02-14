import { ProductService } from "@/services/ProductService";
import { PrismaClient } from "@prisma/client";
import path from 'path';

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
            findByName: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        }))
    }
})

// Mock fs/promises
jest.mock('fs/promises', () => ({
    mkdir: jest.fn(() => Promise.resolve()),
    writeFile: jest.fn(() => Promise.resolve())
}));

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

        // test('should successfully create a product with image upload', async () => {
        //     // Prepare mock data
        //     const productName = 'New Product';
        //     const productPrice = 19.99;
        //     const mockBuffer = Buffer.from('mock image data');
        //     mockImageFile.arrayBuffer.mockResolvedValue(mockBuffer);
        //
        //     // Mock repository methods
        //     productRepoMock.findByName.mockResolvedValue(null);
        //     productRepoMock.create.mockResolvedValue({
        //         productId: 1,
        //         productName: productName,
        //         productPrice: productPrice
        //     });
        //     productRepoMock.update.mockResolvedValue({
        //         productId: 1,
        //         productName: productName,
        //         productPrice: productPrice,
        //         productImage: '/images/products/1.jpg'
        //     });
        //
        //     // Call the method
        //     const result = await productService.createProduct(productName, productPrice, mockImageFile);
        //
        //     // Assertions
        //     expect(productRepoMock.findByName).toHaveBeenCalledWith(productName);
        //     expect(productRepoMock.create).toHaveBeenCalledWith({
        //         productName: productName,
        //         productPrice: productPrice,
        //         productImage: ""
        //     });
        //     expect(productRepoMock.update).toHaveBeenCalledWith(1, {
        //         productImage: '/images/products/1.jpg'
        //     });
        //     expect(result).toEqual({
        //         productId: 1,
        //         productName: productName,
        //         productPrice: productPrice,
        //         productImage: '/images/products/1.jpg'
        //     });
        // });

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
        //
        // test('should handle image upload error', async () => {
        //     // Prepare mock data
        //     const productName = 'New Product';
        //     const productPrice = 39.99;
        //     const mockBuffer = Buffer.from('mock image data');
        //     mockImageFile.arrayBuffer.mockResolvedValue(mockBuffer);
        //
        //     // Mock repository and fs methods
        //     productRepoMock.findByName.mockResolvedValue(null);
        //     productRepoMock.create.mockResolvedValue({
        //         productId: 1,
        //         productName: productName,
        //         productPrice: productPrice
        //     });
        //
        //     // Mock fs.writeFile to throw an error
        //     const fsPromises = require('fs/promises');
        //     fsPromises.writeFile.mockRejectedValue(new Error('File write error'));
        //
        //     // Call the method and expect an error
        //     await expect(
        //         productService.createProduct(productName, productPrice, mockImageFile)
        //     ).rejects.toThrow('Failed to create product: File write error');
        //
        //     // Verify method calls
        //     expect(productRepoMock.findByName).toHaveBeenCalledWith(productName);
        //     expect(productRepoMock.create).toHaveBeenCalled();
        //     expect(fsPromises.writeFile).toHaveBeenCalled();
        //     expect(productRepoMock.delete).toHaveBeenCalled();
        // });
    });
});