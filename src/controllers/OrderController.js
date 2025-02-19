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

    async getCart() {
        try {
            const cartDetails = await this.orderService.getCartDetails()
            
            if (!cartDetails) {
                return Response.json(
                    { message: "No active cart found" },
                    { status: 404 }
                )
            }

            return Response.json(cartDetails, { status: 200 })
        } catch (error) {
            return Response.json(
                { error: error.message || "Failed to retrieve cart" },
                { status: 500 }
            )
        }
    }

    async addOrder(request) {
  
        try {

            const { paymentMethod, cartItems } = await request.json()
            const order = await this.orderService.addOrder(paymentMethod, cartItems)
            return Response.json(order)
            
        } catch (error) {
            console.log(error.message)
            return Response.json(
                { error: error.message || "Failed to add order" },
                { status: 500 }
            )
        }

    }
}