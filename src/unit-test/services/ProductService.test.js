import {ProductService} from "@/services/ProductService";

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
    return {PrismaClient: jest.fn(() => testPrisma)}
});

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

    // Tests for getAllProducts
    describe('getAllProducts', () => {
        test('should return products sorted by name', async () => {
            // Products returned by prisma
            const prismaProducts = [
                { productId: 1, productName: 'Apple' },
                { productId: 2, productName: 'Banana' },
                { productId: 3, productName: 'Watermelon' }
            ];
    
            const expectedProducts = [
                { id: 1, name: 'Apple', image: undefined, isActive: undefined, price: undefined },
                { id: 2, name: 'Banana', image: undefined, isActive: undefined, price: undefined },
                { id: 3, name: 'Watermelon', image: undefined, isActive: undefined, price: undefined }
            ];
    
            prismaTest.product.findMany.mockResolvedValue(prismaProducts);
    
            const result = await productService.getAllProducts();
    
            expect(result).toEqual(expectedProducts);
            expect(prismaTest.product.findMany).toHaveBeenCalledWith({
                orderBy: { productName: 'asc' }
            });
        });

        test('should throw an error when cannot fetch products', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            prismaTest.product.findMany.mockRejectedValue(new Error("Database Error"));
        
            await expect(productService.getAllProducts()).rejects.toThrow("Failed to fetch products");
            expect(prismaTest.product.findMany).toHaveBeenCalledTimes(1);
        
            consoleErrorSpy.mockRestore();
        });        
    });

    // Tests for createProduct method
    describe('createProduct', () => {
        const mockImageFile = {
            name: 'test-image.jpg',
            arrayBuffer: jest.fn()
        };

        test('should successfully create a product with image upload', async () => {
            const productName = 'New Product';
            const productPrice = 19.99;
            const mockBuffer = Buffer.from('mock image data');
            mockImageFile.arrayBuffer.mockResolvedValue(mockBuffer);

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
            const productName = 'Existing Product';
            const productPrice = 29.99;

            productRepoMock.findByName.mockResolvedValue({
                productId: 2,
                productName: productName
            });

            await expect(
                productService.createProduct(productName, productPrice, mockImageFile)
            ).rejects.toThrow('Product name already exists');

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

    // Tests for updateProductStatus
    describe('updateProductStatus', () => {
        test('should update multiple product statuses successfully', async () => {
            const updatedProducts = [
                {id: 1, isActive: false},
                {id: 2, isActive: true}
            ];

            // Mock prisma update method
            prismaTest.product.update = jest.fn().mockResolvedValue({});

            const result = await productService.updateProductStatus(updatedProducts);

            expect(result).toEqual({
                success: true,
                message: "Updated modified products only"
            });

            expect(prismaTest.product.update).toHaveBeenCalledTimes(2);

            expect(prismaTest.product.update).toHaveBeenCalledWith({
                where: {productId: 1},
                data: {isActive: false}
            });
            expect(prismaTest.product.update).toHaveBeenCalledWith({
                where: {productId: 2},
                data: {isActive: true}
            });
        });

        test('should throw error when update fails', async () => {
            const updatedProducts = [{id: 1, isActive: false}];

            prismaTest.product.update = jest.fn().mockRejectedValue(
                new Error("Database error")
            );

            await expect(
                productService.updateProductStatus(updatedProducts)
            ).rejects.toThrow("Failed to update product status");

            expect(prismaTest.product.update).toHaveBeenCalledTimes(1);
        });

        test('should handle empty product list', async () => {
            const result = await productService.updateProductStatus([]);

            expect(result).toEqual({
                success: true,
                message: "Updated modified products only"
            });
            expect(prismaTest.product.update).not.toHaveBeenCalled();
        });
    });
});