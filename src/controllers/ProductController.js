import { ProductService } from '../services/ProductService'

export class ProductController {
    constructor() {
        this.productService = new ProductService()
    }

    async showProduct(req, res) {
        try {
            return await this.productService.getAllProducts(req, res)
        } catch (error) {
            return res.status(500).json(
                { error: error.message || "Error displaying products" },
                { status: 500 }
            )
        }
    }

    // display single product details
    async showProductDetails(req, res) {
        try {
            return await this.productService.getProductDetails(req, res)
        } catch (error) {
            return res.status(500).json(
                { error: error.message || "Error displaying product details" },
                { status: 500 }
            )
        }
    }
}