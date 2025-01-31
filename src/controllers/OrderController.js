import { OrderService } from '../services/OrderService'

export class OrderController {
    constructor() {
        this.orderService = new OrderService()
    }
    async addToCart(request) {
        try {
            const { productId, quantity } = await request.json()
            const result = await this.orderService.addToCart(productId, quantity)
            return Response.json(result, { status: 201 })
        } catch (error) {

            if (error.message === "Product not found") {
                return Response.json(
                    { error: "Product not found" },
                    { status: 404 }
                )
            }
            
            return Response.json(
                { error: error.message || "Failed to add to cart" },
                { status: 500 }
            )
        }
    }
}