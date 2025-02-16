import {ProductRepository} from '@/repositories/ProductRepository'

// Mock Prisma Client to prevent actual database connections
jest.mock('@prisma/client', () => {
    const testPrisma = {
        product: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn()
        }
    }
    return {PrismaClient: jest.fn(() => testPrisma)}
})

describe('ProductRepository', () => {
    let productRepository;
    let prismaTest;

    beforeEach(() => {
        productRepository = new ProductRepository();
        prismaTest = productRepository.prisma;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findById', () => {
        test('should return product found by id', async () => {
            const testProduct = {productId: 123, productName: 'Apple'};

            prismaTest.product.findUnique.mockResolvedValue(testProduct);

            const result = await productRepository.findById(123);

            expect(result).toEqual(testProduct);
            expect(prismaTest.product.findUnique).toHaveBeenCalledWith({
                where: {productId: 123}
            });
        });

        test('should return null when no product is found', async () => {
            prismaTest.product.findUnique.mockResolvedValue(null);

            const result = await productRepository.findById(999);

            expect(result).toBeNull();
            expect(prismaTest.product.findUnique).toHaveBeenCalledWith({
                where: {productId: 999}
            });
        });
    });

    describe('findByName', () => {
        test('should return product found by name (case-insensitive)', async () => {
            const testProduct = {
                productId: 456,
                productName: 'Banana'
            };

            prismaTest.product.findFirst.mockResolvedValue(testProduct);

            const result = await productRepository.findByName('banana');

            expect(result).toEqual(testProduct);
            expect(prismaTest.product.findFirst).toHaveBeenCalledWith({
                where: {
                    productName: {
                        equals: 'banana',
                        mode: 'insensitive'
                    }
                }
            });
        });

        test('should return null when no product is found by name', async () => {
            prismaTest.product.findFirst.mockResolvedValue(null);

            const result = await productRepository.findByName('nonexistent');

            expect(result).toBeNull();
            expect(prismaTest.product.findFirst).toHaveBeenCalledWith({
                where: {
                    productName: {
                        equals: 'nonexistent',
                        mode: 'insensitive'
                    }
                }
            });
        });
    });

    describe('create', () => {
        test('should create a new product', async () => {
            const productData = {
                productName: 'Orange',
                productPrice: 10.99,
                productImage: 'orange.jpg'
            };

            const createdProduct = {
                productId: 789,
                ...productData
            };

            prismaTest.product.create.mockResolvedValue(createdProduct);

            const result = await productRepository.create(productData);

            expect(result).toEqual(createdProduct);
            expect(prismaTest.product.create).toHaveBeenCalledWith({
                data: {
                    productName: 'Orange',
                    productPrice: 10.99,
                    productImage: 'orange.jpg'
                }
            });
        });

        test('should handle creation errors', async () => {
            const productData = {
                productName: 'Invalid Product',
                productPrice: -10, // Invalid price
                productImage: ''
            };

            prismaTest.product.create.mockRejectedValue(new Error('Validation failed'));

            await expect(productRepository.create(productData)).rejects.toThrow('Validation failed');
        });
    });

    describe('update', () => {
        test('should update an existing product', async () => {
            const productId = 123;
            const updateData = {
                productName: 'Updated Apple',
                productPrice: 15.99
            };

            const updatedProduct = {
                productId: 123,
                ...updateData,
                productImage: 'old-image.jpg'
            };

            prismaTest.product.update.mockResolvedValue(updatedProduct);

            const result = await productRepository.update(productId, updateData);

            expect(result).toEqual(updatedProduct);
            expect(prismaTest.product.update).toHaveBeenCalledWith({
                where: {productId: 123},
                data: updateData
            });
        });

        test('should handle update when product not found', async () => {
            const productId = 999;
            const updateData = {
                productName: 'Non-existent Product'
            };

            prismaTest.product.update.mockRejectedValue(new Error('Product not found'));

            await expect(productRepository.update(productId, updateData)).rejects.toThrow('Product not found');
        });
    });

    describe('delete', () => {
        test('should successfully delete an existing product', async () => {
            const productId = 123;

            prismaTest.product.delete = jest.fn().mockResolvedValue({productId});

            await productRepository.delete(productId);

            expect(prismaTest.product.delete).toHaveBeenCalledWith({
                where: {productId: productId}
            });
        });

        test('should throw error when product not found', async () => {
            const productId = 999;
            const errorMessage = 'Product not found';

            prismaTest.product.delete = jest.fn().mockRejectedValue(new Error(errorMessage));

            await expect(productRepository.delete(productId))
                .rejects
                .toThrow(`Failed to delete product with ID ${productId}: ${errorMessage}`);

            expect(prismaTest.product.delete).toHaveBeenCalledWith({
                where: {productId: productId}
            });
        });
    });
});