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

export async function POST(request) {
    const requestBody = await request.json();
    if (requestBody.updatedProducts) {
        for (const product of requestBody.updatedProducts) {
            await prisma.product.update({
                where: { productId: product.id },
                data: { isActive: product.isActive },
            });
        }

        return Response.json({
            success: true,
            message: "Products updated successfully"
        }, { status: 200 });
    }

    return await productController.createProduct(request)
}
