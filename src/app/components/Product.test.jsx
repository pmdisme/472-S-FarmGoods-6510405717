import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Product from './Product';
import '@testing-library/jest-dom';
import Home from '../page';

const mockProduct = {
    id: 1,
    name: 'test1',
    price: 100.00,
    image: '/test-image1.jpg'
}

const mockProduct2 = [
    {
        id: 2,
        name: 'test2',
        price: 139.00,
        image: '/test-image2.jpg'
    },
    {
        id: 3,
        name: 'test3',
        price: 234.00,
        image: '/test-image3.jpg'
    },
    {
        id: 4,
        name: 'test4',
        price: 48.00,
        image: '/test-image4.jpg'
    },
]


const mockStore = configureStore([]);

describe('Product Showcase Acceptance Tests', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            cart: { cart: [] },
        });
    });

    test('Displays product details including name and price', () => {
        render(
            <Provider store={store}>
                <Product {...mockProduct} />
            </Provider>
        );

        expect(screen.getByText(mockProduct.name)).toBeTruthy();
        expect(screen.getByText(`฿${mockProduct.price.toFixed(2)}`)).toBeTruthy();
    });

    test('The system must load product images within 3 seconds.', async () => {
        render(
            <Provider store={store}>
                <Product {...mockProduct} />
            </Provider>
        );

        const productImage = screen.getByAltText('product-image');
        await waitFor(() => expect(productImage).toBeInTheDocument(), { timeout: 3000 });
    });

    test('Products should be displayed in a grid or list format for easy browsing.', async () => {
        render(
            <Provider store={store}>
                <Home products={mockProduct2}/>
            </Provider>
        );

        const productContainer = screen.getByTestId('product-section');
        expect(productContainer).toBeInTheDocument();

        expect(productContainer).toHaveStyle({
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
        });
    });
});




