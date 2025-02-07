import { ProductService } from '../services/ProductService'

export class ProductController {
    constructor() {
        this.productService = new ProductService()
    }

    async showProduct() {
        try {
            const products = await this.productService.getAllProducts()
            return Response.json({ success:true, data: products }, { status: 200 })
        } catch (error) {
            return Response.json(
                { error: error.message || "Error displaying products" },
                { status: 500 }
            )
        }
    }
}