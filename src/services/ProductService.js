import { PrismaClient } from '@prisma/client'
import { ProductRepository } from '@/repositories/ProductRepository'

export class ProductService {
    constructor() {
        this.prisma = new PrismaClient()
        this.productRepo = new ProductRepository()
    }

    // get products
    async getAllProducts() {
        try {
            return await this.prisma.product.findMany({
                orderBy: { productName: 'asc' }
            })
        } catch (error) {
            throw new Error("Failed to fetch products")
        }
    }

    // create product
    async createProduct(productName, productPrice, imageFile) {
        try {

            if (!imageFile) {
                throw new Error('Product image is required');
            }

            // Validate image
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(imageFile.type)) {
                throw new Error('Invalid file type.');
            }

            // Check duplicate name
            const existingProduct = await this.productRepo.findByName(productName.trim());
            if (existingProduct) {
                throw new Error('Product name already exists');
            }

            // Create product first to get ID
            const newProduct = await this.productRepo.create({
                productName: productName.trim(),
                productPrice: productPrice,
                productImage: "" // temporary empty string
            });

            // Handle image upload
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const originalExtension = imageFile.name.split('.').pop().toLowerCase();
            const fileName = `${newProduct.productId}.${originalExtension}`;
            const imagePath = `/images/products/${fileName}`;

            const fs = require('fs').promises;
            const path = require('path');
            const fullPath = path.join(process.cwd(), 'public', 'images', 'products', fileName);

            // Create directory if not exists
            await fs.mkdir(path.dirname(fullPath), { recursive: true });

            // Save file
            await fs.writeFile(fullPath, buffer);

            // Update product with image path
            const updatedProduct = await this.productRepo.update(newProduct.productId, {
                productImage: imagePath
            });

            return updatedProduct;

        } catch (error) {
            const errorMessage = error.code ? `Database error: ${error.message}` : error.message;
            throw new Error(`Failed to create product: ${errorMessage}`);
        }
    }
}