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

    async createProduct(req) {
        try {
            const formData = await req.formData();
            const productName = formData.get('productName');
            const productPrice = parseFloat(formData.get('productPrice'));
            const imageFile = formData.get('productImage');

            const newProduct = await this.productService.createProduct(
                productName,
                productPrice,
                imageFile
            );

            return Response.json({
                success: true,
                data: newProduct
            }, { status: 201 });

        } catch (error) {
            return Response.json({
                success: false,
                error: error.message
            }, { status: 500 });
        }
    }
}