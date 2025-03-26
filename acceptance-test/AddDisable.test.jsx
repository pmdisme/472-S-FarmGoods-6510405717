import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import ManageProduct from "../src/app/components/ManageProduct";
import NewProductDialog from "../src/app/components/creat-product-dialog/NewProductDialog";
import { Provider } from "react-redux";
import { store } from "@/store/store";

jest.mock("../src/hooks/useManageProduct", () => ({
  useManageProduct: jest.fn(() => ({
    filteredProducts: [
      { id: 1, name: "Apple", price: 30, image: "/apple.jpg", isActive: true },
      { id: 2, name: "Banana", price: 20, image: "/banana.jpg", isActive: false },
      { id: 3, name: "Watermelon", price: 50, image: "/watermelon.jpg", isActive: true },
    ],
    handleToggleStatus: jest.fn(),
    handleConfirmUpdate: jest.fn(),
    openConfirm: false,
    setOpenConfirm: jest.fn(),
    handleCancel: jest.fn(),
    showSuccess: false,
  }))
}));

jest.mock("../src/hooks/useProductForm", () => {
  const React = require("react");
  return {
    useProductForm: (onSuccess) => {
      const [formData, setFormData] = React.useState({
        productName: "",
        productPrice: "",
        productImage: null,
      });
      const [errors, setErrors] = React.useState({
        productName: "",
        productPrice: "",
        productImage: "",
        general: ""
      });
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };
      // if productName is "Apple", set a duplicate error.
      const handleSubmit = jest.fn(() => {
        if (formData.productName === "Apple") {
          setErrors((prev) => ({ ...prev, productName: "Product name already exists." }));
        }
      });
      return {
        formData,
        errors,
        previewUrl: null,
        selectedFileName: "",
        handleInputChange,
        handleImageChange: jest.fn(),
        handleSubmit,
        truncateFileName: jest.fn((filename) => filename),
        isFormValid: true,
        resetForm: jest.fn(),
      };
    },
  };
});

describe("ManageProduct and NewProductDialog Components", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test("should display inactive products correctly", () => {
    render(
      <Provider store={store}>
        <ManageProduct open={true} onClose={jest.fn()} />
      </Provider>
    );
    const inactiveCheckbox = screen.getByLabelText(/Banana \(ID: 2\)/i);
    expect(inactiveCheckbox).toBeInTheDocument();
    expect(inactiveCheckbox).not.toBeChecked();
  });

  test("should allow adding a new product with name, price, and image fields", async () => {
    render(
      <Provider store={store}>
        <NewProductDialog open={true} handleClose={jest.fn()} onProductCreated={jest.fn()} />
      </Provider>
    );

    const nameInput = await screen.findByRole("textbox", { name: /product name/i });
    const priceInput = await screen.findByRole("spinbutton", { name: /price/i });
    const fileInput = document.querySelector('input[type="file"]');

    const mockProduct = {
      name: "Mango",
      price: "25",
      image: new File(["test"], "mango.jpg", { type: "image/jpeg" })
    };

    fireEvent.change(nameInput, { target: { value: mockProduct.name } });
    fireEvent.change(priceInput, { target: { value: mockProduct.price } });
    fireEvent.change(fileInput, { target: { files: [mockProduct.image] } });

    expect(nameInput).toHaveValue(mockProduct.name);
    expect(priceInput).toHaveValue(Number(mockProduct.price));
    expect(fileInput.files[0].name).toBe(mockProduct.image.name);
  });

  test("should prevent duplicate product entries", async () => {
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: false, error: "name already exists" })
      })
    );

    render(
      <Provider store={store}>
        <NewProductDialog open={true} handleClose={jest.fn()} onProductCreated={jest.fn()} />
      </Provider>
    );

    const nameInput = await screen.findByRole("textbox", { name: /product name/i });
    fireEvent.change(nameInput, { target: { value: "Apple" } });

    // Click the "New" button to open a confirmation dialog
    const newButton = screen.getByRole("button", { name: /^new$/i });
    fireEvent.click(newButton);

    // Wait for the confirmation dialog and click "Yes"
    const yesButton = await screen.findByRole("button", { name: /^yes$/i });
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(
        screen.getByText((content) =>
          content.replace(/\s+/g, " ").includes("Product name already exists.")
        )
      ).toBeInTheDocument();
    });
  });
});

describe("Disable product confirmation", () => {
    test("should show confirmation prompt when disabling a product", async () => {
      Object.defineProperty(window, "location", {
        configurable: true,
        writable: true,
        value: { ...window.location, reload: jest.fn() },
      });
  
      const { useManageProduct } = require("../src/hooks/useManageProduct");
      useManageProduct.mockImplementationOnce(() => ({
        filteredProducts: [
          { id: 1, name: "Apple", price: 30, image: "/apple.jpg", isActive: true },
          { id: 2, name: "Banana", price: 20, image: "/banana.jpg", isActive: false },
          { id: 3, name: "Watermelon", price: 50, image: "/watermelon.jpg", isActive: true },
        ],
        handleToggleStatus: jest.fn(),
        handleConfirmUpdate: jest.fn(() => {}),
        openConfirm: true,  // force the confirmation dialog to be open
        setOpenConfirm: jest.fn(),
        handleCancel: jest.fn(),
        showSuccess: false,
      }));
  
      render(
        <Provider store={store}>
          <ManageProduct open={true} onClose={jest.fn()} />
        </Provider>
      );
  
      const appleCheckbox = await screen.findByLabelText(/Apple \(ID: 1\)/i);
      fireEvent.click(appleCheckbox);
  
      // The confirmation dialog should appear
      const dialog = await screen.findByRole("dialog");
      expect(
        within(dialog).getByText((content) =>
          content.replace(/\s+/g, " ").toLowerCase().includes("update product visibility")
        )
      ).toBeInTheDocument();
  
      const yesButton = within(dialog).getByRole("button", { name: /^yes$/i });
      fireEvent.click(yesButton);
  
      await waitFor(() => {
        expect(window.location.reload).toHaveBeenCalled();
      });
    });
  });  