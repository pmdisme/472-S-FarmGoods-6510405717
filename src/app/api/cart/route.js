import { OrderController } from '@/controllers/OrderController'

const orderController = new OrderController()

export async function POST(request) {
    return await orderController.addToCart(request)
}