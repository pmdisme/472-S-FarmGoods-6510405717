import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Payment from "@/app/components/Payment";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

const mockStore = configureStore([]);
let store; 

jest.mock("../src/hooks/useOrder", () => ({
    useOrder: () => ({
      addOrder: jest.fn().mockResolvedValue(true), // Ensure addOrder resolves without making network calls
    }),
})); 

describe("Payment Acceptance Test", () => {
  let setSelectedPaymentMethod, handleOpenPayment, handleClosePayment, handleOpenReceipt;
  let selectedPaymentMethod = "cash";

  beforeEach(() => {
    store = mockStore({
      cart: { cart: [] }, // Mock empty cart
    });

    setSelectedPaymentMethod = jest.fn((method) => (selectedPaymentMethod = method));
    handleOpenPayment = jest.fn();
    handleClosePayment = jest.fn();
    handleOpenReceipt = jest.fn();

    render(
      <Provider store={store}>
        <Payment
          openPayment={true}
          orderTotal={100}
          handleClosePayment={handleClosePayment}
          handleOpenReceipt={handleOpenReceipt}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
        />
      </Provider>
    );
  });

  test("Displays at least three payment options", () => {
    expect(screen.getByText("Cash")).toBeInTheDocument();
    expect(screen.getByText("QR Code")).toBeInTheDocument();
    expect(screen.getByText("Card")).toBeInTheDocument();
  });

  test("Allows switching between payment methods before confirmation", () => {
    const cashOption = screen.getByText("Cash");
    const cardOption = screen.getByText("Card");

    fireEvent.click(cardOption); // Change payment to card
    expect(setSelectedPaymentMethod).toHaveBeenCalledWith("card");

    fireEvent.click(cashOption); // Change back to cash
    expect(setSelectedPaymentMethod).toHaveBeenCalledWith("cash");
  });

  test("Stores the selected payment method in local storage", () => {
    fireEvent.click(screen.getByText("QR Code")); // Select QR Code
    expect(localStorage.getItem("selectedPaymentMethod")).toBe("qr");
  });

  test("Confirms payment successfully", async () => {
    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);

    await waitFor(() => expect(handleOpenReceipt).toHaveBeenCalledTimes(1));
    expect(handleOpenReceipt).toHaveBeenCalledWith(selectedPaymentMethod);
  });

  test("Cancels payment selection", () => {
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(handleClosePayment).toHaveBeenCalled();
  });
});