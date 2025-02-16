import {ProductController} from "@/controllers/ProductController";

describe('ProductController', () => {
    let productController;
    let productService;

    beforeEach(() => {
        productService = {
            getAllProducts: jest.fn(),
            createProduct: jest.fn(),
            updateProductStatus: jest.fn()
        };

        productController = new ProductController();
        productController.productService = productService;

        global.Response = {
            json: jest.fn((data, init) => ({...data, status: init.status}))
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test cases สำหรับ showProduct
    describe('showProduct', () => {
        test('should return all products successfully', async () => {
            const testProducts = [
                {productId: 1, productName: 'Apple'},
                {productId: 2, productName: 'Banana'},
                {productId: 3, productName: 'Watermelon'}
            ];

            productService.getAllProducts.mockResolvedValue(testProducts);

            const response = await productController.showProduct();

            expect(response).toEqual({success: true, data: testProducts, status: 200});
            expect(productService.getAllProducts).toHaveBeenCalledTimes(1);
        });

        test('should throw an error 500 if can not get products', async () => {
            productService.getAllProducts.mockRejectedValue(new Error("Database error"));

            const response = await productController.showProduct();

            expect(response).toEqual({error: "Database error", status: 500});
            expect(productService.getAllProducts).toHaveBeenCalledTimes(1);
        });
    });

    // Test cases สำหรับ createProduct
    describe('createProduct', () => {
        let mockFormData;

        beforeEach(() => {
            mockFormData = new Map();
            mockFormData.set = jest.fn();
            mockFormData.get = jest.fn();
        });

        test('should create product successfully', async () => {
            const testProduct = {
                productId: 1,
                productName: 'Test Product',
                productPrice: 100,
                productImage: '/images/test.jpg'
            };

            mockFormData.get
                .mockReturnValueOnce('Test Product')  // productName
                .mockReturnValueOnce('100')          // productPrice
                .mockReturnValueOnce({               // imageFile
                    name: 'test.jpg',
                    arrayBuffer: jest.fn()
                });

            const mockRequest = {
                formData: () => Promise.resolve(mockFormData)
            };

            productService.createProduct.mockResolvedValue(testProduct);

            const response = await productController.createProduct(mockRequest);

            expect(response).toEqual({
                success: true,
                data: testProduct,
                status: 201
            });
            expect(productService.createProduct).toHaveBeenCalledTimes(1);
            expect(productService.createProduct).toHaveBeenCalledWith(
                'Test Product',
                100,
                expect.any(Object)
            );
        });

        test('should handle error when product creation fails', async () => {
            mockFormData.get
                .mockReturnValueOnce('Test Product')
                .mockReturnValueOnce('100')
                .mockReturnValueOnce({
                    name: 'test.jpg',
                    arrayBuffer: jest.fn()
                });

            const mockRequest = {
                formData: () => Promise.resolve(mockFormData)
            };

            const errorMessage = 'Product name already exists';
            productService.createProduct.mockRejectedValue(new Error(errorMessage));

            const response = await productController.createProduct(mockRequest);

            expect(response).toEqual({
                success: false,
                error: errorMessage,
                status: 500
            });
            expect(productService.createProduct).toHaveBeenCalledTimes(1);
        });
    });

    // Test cases สำหรับ updateProductStatus
    describe('updateProductStatus', () => {
        test('should update product status successfully', async () => {
            const updatedProducts = [
                {id: 1, isActive: true},
                {id: 2, isActive: false}
            ];

            const mockRequest = {
                json: () => Promise.resolve({updatedProducts})
            };

            productService.updateProductStatus.mockResolvedValue({
                success: true,
                message: "Updated modified products only"
            });

            const response = await productController.updateProductStatus(mockRequest);

            expect(response).toEqual({
                success: true,
                message: "Updated modified products only",
                status: 200
            });
            expect(productService.updateProductStatus).toHaveBeenCalledWith(updatedProducts);
        });

        test('should handle error when status update fails', async () => {
            const mockRequest = {
                json: () => Promise.resolve({
                    updatedProducts: [{id: 1, isActive: true}]
                })
            };

            productService.updateProductStatus.mockRejectedValue(
                new Error("Failed to update product status")
            );

            const response = await productController.updateProductStatus(mockRequest);

            expect(response).toEqual({
                error: "Failed to update product status",
                status: 500
            });
            expect(productService.updateProductStatus).toHaveBeenCalledTimes(1);
        });
    });
});