import { PrismaClient } from "@prisma/client";
import {ProductController} from "@/controllers/ProductController";

const prisma = new PrismaClient();

const productController = new ProductController()

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { productName: "asc" }  // Sort products from a-z
        });

        return Response.json({
            success: true,
            data: products.map(product => ({
                id: product.productId,      
                name: product.productName,
                price: product.productPrice,
                image: product.productImage,
                isActive: product.isActive
            }))
        }, { status: 200 });

    } catch (error) {
        return Response.json({
            success: false,
            error: "Failed to fetch products"
        }, { status: 500 });
    }
}