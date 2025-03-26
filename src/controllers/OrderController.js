import { OrderService } from '@/services/OrderService'

export class OrderController {
    constructor() {
        this.orderService = new OrderService()
    }

    async addOrder(request) {
  
        try {

            const { cartItems, paymentMethods } = await request.json()
            const order = await this.orderService.addOrder(cartItems, paymentMethods)
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