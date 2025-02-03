import { PrismaClient } from '@prisma/client'
import { ProductRepository } from '@/repositories/ProductRepository'
import { OrderRepository } from '@/repositories/OrderRepository'
import { OrderDetailRepository } from '@/repositories/OrderDetailRepository'

export class OrderService {
    constructor() {
        this.prisma = new PrismaClient()
        this.productRepo = new ProductRepository()
        this.orderRepo = new OrderRepository()
        this.orderDetailRepo = new OrderDetailRepository()
    }

    async getActiveCart() {
        return await this.orderRepo.findByStatusEqualO()
    }

    async addToCart(productId, quantity) {
        const product = await this.productRepo.findById(productId)

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

    async updateOrCreateOrderDetail(orderId, productId, quantity, totalAmount) {
        const existingDetail = await this.orderDetailRepo.findByProductIdAndOrderId(orderId, productId)
        
        if (existingDetail) {
            return await this.prisma.orderDetail.update({
                where: { orderDetailId: existingDetail.orderDetailId },
                data: {
                    quantity: existingDetail.quantity + quantity,
                    orderTotalAmount: existingDetail.orderTotalAmount + totalAmount
                }
            })
        }

        return await this.prisma.orderDetail.create({
            data: {
                orderId,
                productId,
                quantity,
                orderTotalAmount: totalAmount
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
        const cart = await this.orderRepo.findById(orderId);
        
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
}
