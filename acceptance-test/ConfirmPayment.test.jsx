import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React, { useState } from 'react';
import OrderSummary from "@/app/components/OrderSummary";
import Payment from "@/app/components/Payment";

jest.mock('../src/hooks/useOrder', () => ({
    useOrder: () => ({
        updateStatusOrder: jest.fn().mockResolvedValue(true),
        addOrder: jest.fn().mockResolvedValue(true),
    }),
}));

const createMockStore = (initialState = {}) => {
    return configureStore({
        reducer: {
            order: (state = initialState.order || {}, action) => state,
            payment: (state = initialState.payment || {}, action) => state,
            cart: (state = initialState.cart || { cart: [] }, action) => state,
        },
    });
};

describe("Order and Payment Acceptance Tests", () => {
    const sampleOrder = {
        items: [
            { id: "product-1", name: "Product 1", price: 50, quantity: 1 },
            { id: "product-2", name: "Product 2", price: 50, quantity: 1 }
        ],
        total: 100
    };

    const initialState = {
        order: {
            items: sampleOrder.items,
            total: sampleOrder.total,
        },
        payment: {
            selectedMethod: null,
            processing: false,
            success: false,
        },
        cart: {
            cart: sampleOrder.items,
        },
    };

    const renderWithProvider = (component) => {
        const store = createMockStore(initialState);
        return render(
            <Provider store={store}>
                {component}
            </Provider>
        );
    };

    describe("Viewing Order Summary", () => {
        test("Customer should see a summary of all items and costs when checkout", async () => {
            renderWithProvider(
                <OrderSummary
                    openOrderSummary={true}
                    orderTotal={sampleOrder.total}
                    handleClose={() => {}}
                    handleOpenPayment={() => {}}
                    setSelectedPaymentMethod={() => {}}
                />
            );

            // Check if order details are displayed
            expect(screen.getByText("Product 1")).toBeInTheDocument();
            expect(screen.getByText("Product 2")).toBeInTheDocument();
            // Check total
            expect(
                screen.getByText((content) => content.includes("100.00") && content.includes("฿"))
            ).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /confirm payment/i })).toBeInTheDocument();
        });
    });

    describe("Payment Method Selection", () => {
        const PaymentWrapper = ({ handleOpenReceipt }) => {
            const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
            return (
                <Payment
                    openPayment={true}
                    orderTotal={sampleOrder.total}
                    handleClosePayment={() => {}}
                    handleOpenReceipt={handleOpenReceipt}
                    selectedPaymentMethod={selectedPaymentMethod}
                    setSelectedPaymentMethod={setSelectedPaymentMethod}
                />
            );
        };

        test("Select a payment method and confirm then should be able to proceed payment", async () => {
            const handleOpenReceipt = jest.fn();

            renderWithProvider(
                <PaymentWrapper handleOpenReceipt={handleOpenReceipt} />
            );

            // Check if payment method shows
            expect(screen.getByAltText("Cash")).toBeInTheDocument();
            expect(screen.getByAltText("QR Code")).toBeInTheDocument();
            expect(screen.getByAltText("Card")).toBeInTheDocument();

            // Select Cash
            fireEvent.click(screen.getByAltText("Cash"));

            await waitFor(() => {
                expect(
                    screen.getByText((content) => content.includes("100.00") && content.includes("฿"))
                ).toBeInTheDocument();
            });

            // Click confirm
            fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
        });
    });

    describe("Receipt Generation", () => {
        test("When the transaction is successful then should receive a receipt", async () => {
            const handleOpenReceipt = jest.fn();

            // selectedPaymentMethod เป็น cash
            renderWithProvider(
                <Payment
                    openPayment={true}
                    orderTotal={sampleOrder.total}
                    handleClosePayment={() => {}}
                    handleOpenReceipt={handleOpenReceipt}
                    selectedPaymentMethod="cash"
                    setSelectedPaymentMethod={() => {}}
                />
            );

            // Click confirm
            fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

            await waitFor(() => {
                // verify handleOpenReceipt was called.
                expect(handleOpenReceipt).toHaveBeenCalled();
            });
        });
    });
});