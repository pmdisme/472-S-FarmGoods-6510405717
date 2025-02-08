
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Product from '@/app/components/Product';
import '@testing-library/jest-dom';
import Home from '@/app/page';

const mockProduct = {
    id: 1,
    name: 'test1',
    price: 100.00,
    image: '/test-image1.jpg'
}

const mockStore = configureStore([]);

describe('Product Showcase Acceptance Tests', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            cart: { cart: [] },
        });
    });

    test("The system must display product details including name, price clearly.", () => {
        render(
            <Provider store={store}>
                <Product {...mockProduct} />
            </Provider>
        )
        expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
        expect(screen.getByText(`฿${mockProduct.price.toFixed(2)}`)).toBeInTheDocument();
    })

    test("The system must load product images", async () => {
        render(
            <Provider store={store}>
                <Product {...mockProduct} />
            </Provider>
        );
        const productImage = screen.getByAltText('product-image');
        await waitFor(() => expect(productImage).toBeInTheDocument(), { timeout: 3000 });
    })

    test("Products should be displayed in a grid or list format for easy browsing ", () => {
        render(
            <Provider store={store}>
                <Home products={mockProduct} />
            </Provider>
        );
        const productContainer = screen.getByTestId('product-section');
        const style = window.getComputedStyle(productContainer)

        expect(style.display).toBe('flex');
        expect(style.flexWrap).toBe('wrap');
    })
})