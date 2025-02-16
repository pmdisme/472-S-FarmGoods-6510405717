import {PrismaClient} from '@prisma/client'
import {ProductRepository} from '@/repositories/ProductRepository'

export class ProductService {
    constructor() {
        this.prisma = new PrismaClient()
        this.productRepo = new ProductRepository()
    }

    async getAllProducts() {
        try {
            return await this.prisma.product.findMany({
                orderBy: { productName: 'asc' }
            })
        } catch (error) {
            throw new Error("Failed to fetch products")
        }
    }

    // Handle image upload and return image path
    async #handleImageUpload(imageFile, productId) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const originalExtension = imageFile.name.split('.').pop().toLowerCase();
        const fileName = `${productId}.${originalExtension}`;
        const imagePath = `/images/products/${fileName}`;

        const fs = require('fs').promises;
        const path = require('path');
        const fullPath = path.join(process.cwd(), 'public', 'images', 'products', fileName);

        // Create directory if not exists
        await fs.mkdir(path.dirname(fullPath), { recursive: true });

        // Save file
        await fs.writeFile(fullPath, buffer);

        return imagePath;
    }

    // Main create product method
    async createProduct(productName, productPrice, imageFile) {
        try {
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
            let imagePath = "";
            try {
                imagePath = await this.#handleImageUpload(imageFile, newProduct.productId);
            } catch (error) {
                // If image upload fails, delete the created product
                await this.productRepo.delete(newProduct.productId);
                throw error;
            }

            // Update product with image path
            return await this.productRepo.update(newProduct.productId, {
                productImage: imagePath
            });
        } catch (error) {
            const errorMessage = error.code ? `Database error: ${error.message}` : error.message;
            throw new Error(`Failed to create product: ${errorMessage}`);
        }
    }

    async toggleProductStatus(productId, isActive) {
        return await this.prisma.product.update({
            where: { id: productId },
            data: { isActive },
        });
    }    
}