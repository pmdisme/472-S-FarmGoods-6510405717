import { PrismaClient, PaymentMethods } from '@prisma/client'
import { ProductRepository } from '@/repositories/ProductRepository'
import { OrderRepository } from '@/repositories/OrderRepository'
import { OrderDetailRepository } from '@/repositories/OrderDetailRepository'

export class OrderService {
    constructor() {
        this.prisma = new PrismaClient()
        this.productRepository = new ProductRepository()
        this.orderRepository = new OrderRepository()
        this.orderDetailRepository = new OrderDetailRepository()
    }

    async getActiveCart() {
        return await this.orderRepository.findByStatusEqualO()
    }

    async addToCart(productId, quantity) {
        const product = await this.productRepository.findById(productId)

        if (!product) {
            throw new Error("Product not found")
        }

        let cart = await this.getActiveCart()

        if (!cart) {
            cart = await this.createNewCart()
        }

        const totalAmount = product.productPrice * quantity
        return await this.updateOrCreateOrderDetail(cart.orderId, product.productId, quantity, totalAmount)
    }

    async createNewCart() {
        return await this.prisma.order.create({
            data: {
                orderStatus: 0,
                purchaseDatetime: new Date()
            }
        })
    }



    #transformCartToDetails(cart) {
        return {
            orderId: cart.orderId,
            orderStatus: cart.orderStatus,
            purchaseDate: cart.purchaseDatetime,
            purchaseOption: cart.purchaseOption,
            products: cart.orderDetails.map(detail => ({
                productId: detail.product.productId,
                productName: detail.product.productName,
                price: detail.product.productPrice,
                quantity: detail.quantity,
                totalAmount: detail.orderTotalAmount
            })),
            totalCartAmount: cart.orderDetails.reduce((total, detail) =>
                total + detail.orderTotalAmount, 0)
        };
    }

    async getOrderDetails(orderId) {
        const cart = await this.orderRepository.findById(orderId);

        if (!cart) {
            return null;
        }

        return this.#transformCartToDetails(cart);
    }

    async getCartDetails() {
        const cart = await this.getActiveCart();

        if (!cart) {
            return null;
        }

        return this.#transformCartToDetails(cart);
    }

    async addOrder(cartItem) {
        const orderDetail = cartItem.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            orderTotalAmount: item.quantity * item.price
        })
        )


        console.log(orderDetail)
        return await this.orderRepository.addOrder(orderDetail);

    }

    async updateStatusOrder(orderId, paymentMethod) {

        return await this.orderRepository.updateStatusOrder(orderId, paymentMethod);
    }
}
