import { ProductController } from "@/controllers/ProductController";

const productController = new ProductController()

export async function GET() {
    return await productController.showProduct()
}