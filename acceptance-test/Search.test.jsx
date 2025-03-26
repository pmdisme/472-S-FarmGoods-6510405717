// search.test.js
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Home from '@/app/page';
import cartReducer from '@/store/cartSlice';

// Mock the next/image component
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props) => {
        // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
        return <img {...props} />;
    },
}));

// Mock the API call
global.fetch = jest.fn();

// Mock useAppSelector and useAppDispatch hooks
jest.mock('../src/utils/hooks', () => ({
    useAppSelector: jest.fn((selector) => selector({
        cart: {
            cart: [],
        }
    })),
    useAppDispatch: () => jest.fn(),
}));

// Mock MoreActionDropdown component
jest.mock('../src/app/components/MoreActionDropdown', () => ({
    __esModule: true,
    default: () => <div data-testid="mock-more-action-dropdown">More Actions</div>,
}));

// Mock Cart component
jest.mock('../src/app/components/Cart', () => ({
    __esModule: true,
    default: () => <div data-testid="mock-cart">Cart</div>,
}));

// Mock data - correctly formatted to match the component's expected props
const mockProducts = [
    { productId: 1, productName: 'Coffee', productPrice: 25.0, productImage: '/images/coffee.png', isActive: true },
    { productId: 2, productName: 'Espresso', productPrice: 35.0, productImage: '/images/espresso.png', isActive: true },
    { productId: 3, productName: 'Latte', productPrice: 45.0, productImage: '/images/latte.png', isActive: true },
    { productId: 4, productName: 'Cappuccino', productPrice: 50.0, productImage: '/images/cappuccino.png', isActive: true },
    { productId: 5, productName: 'Mocha', productPrice: 55.0, productImage: '/images/mocha.png', isActive: true },
    { productId: 6, productName: 'Chocolate Cake', productPrice: 60.0, productImage: '/images/chocolate-cake.png', isActive: true },
    { productId: 7, productName: 'Croissant', productPrice: 40.0, productImage: '/images/croissant.png', isActive: true },
    { productId: 8, productName: 'Hidden Product', productPrice: 100.0, productImage: '/images/hidden.png', isActive: false },
];

// Create mock store
const createMockStore = () => {
    return configureStore({
        reducer: {
            cart: cartReducer,
        },
        preloadedState: {
            cart: {
                cart: [],
                error: null,
            },
        },
    });
};

// Setup for each test
beforeEach(() => {
    jest.clearAllMocks();
    // Transform the mock data to match the format expected by the components
    const formattedMockProducts = mockProducts.map(product => ({
        ...product,
        id: product.productId,
        name: product.productName,
        price: product.productPrice,
        image: product.productImage
    }));

    fetch.mockImplementation(() =>
        Promise.resolve({
            json: () => Promise.resolve({ success: true, data: formattedMockProducts }),
        })
    );
});

// UAT for search functionality
describe('Search Functionality User Acceptance Tests', () => {

    test('UAT-1: Search results appear within 2 seconds', async () => {
        // Setup performance measurement
        const startTime = performance.now();

        // Render the component with store
        const store = createMockStore();

        // Mock the API response transformation
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    success: true,
                    data: mockProducts.map(product => ({
                        ...product,
                        // Transform to match the format expected by the component
                        id: product.productId,
                        name: product.productName,
                        price: product.productPrice,
                        image: product.productImage
                    }))
                }),
            })
        );

        render(
            <Provider store={store}>
                <Home />
            </Provider>
        );

        // Wait for initial products to load
        await waitFor(() => {
            expect(screen.getByText('Coffee')).toBeInTheDocument();
        });

        // Search for a product
        const searchInput = screen.getByPlaceholderText(/search for products/i);
        const searchButton = screen.getByTestId('search-button');

        fireEvent.change(searchInput, { target: { value: 'Latte' } });
        fireEvent.click(searchButton);

        // Wait for results
        await waitFor(() => {
            expect(screen.getByText('Latte')).toBeInTheDocument();
        });

        // Calculate time taken
        const endTime = performance.now();
        const timeTaken = endTime - startTime;

        // Assert that search results appear within 2 seconds (2000ms)
        expect(timeTaken).toBeLessThan(2000);
        console.log(`UAT-1: Search time: ${timeTaken.toFixed(2)}ms`);
    });


    test('UAT-2: Search with full product name returns correct results', async () => {
        const store = createMockStore();
        render(
            <Provider store={store}>
                <Home />
            </Provider>
        );

        // Wait for products to load
        await waitFor(() => {
            expect(screen.getByText('Coffee')).toBeInTheDocument();
            expect(screen.getByText('Espresso')).toBeInTheDocument();
            expect(screen.getByText('Latte')).toBeInTheDocument();
            expect(screen.getByText('Cappuccino')).toBeInTheDocument();
        });

        // Full name search for "Latte"
        const searchInput = screen.getByPlaceholderText(/search for products/i);
        const searchButton = screen.getByTestId('search-button');

        fireEvent.change(searchInput, { target: { value: 'Latte' } });
        fireEvent.click(searchButton);

        // Verify only Latte is shown
        await waitFor(() => {
            expect(screen.getByText('Latte')).toBeInTheDocument();
            expect(screen.queryByText('Coffee')).not.toBeInTheDocument();
            expect(screen.queryByText('Espresso')).not.toBeInTheDocument();
            expect(screen.queryByText('Cappuccino')).not.toBeInTheDocument();
        });
    });

    test('UAT-3: Search with partial product name returns correct results', async () => {
        const store = createMockStore();
        render(
            <Provider store={store}>
                <Home />
            </Provider>
        );

        // Wait for products to load
        await waitFor(() => {
            expect(screen.getByText('Coffee')).toBeInTheDocument();
            expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
        });

        // Partial name search for "Co" which should match Coffee and Chocolate Cake
        const searchInput = screen.getByPlaceholderText(/search for products/i);
        const searchButton = screen.getByTestId('search-button');

        fireEvent.change(searchInput, { target: { value: 'Co' } });
        fireEvent.click(searchButton);

        // Verify filtered results
        await waitFor(() => {
            expect(screen.getByText('Coffee')).toBeInTheDocument();
            expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
            expect(screen.queryByText('Latte')).not.toBeInTheDocument();
            expect(screen.queryByText('Espresso')).not.toBeInTheDocument();
        });
    });

    /**
     * Additional test: Search with Enter key
     */
    test('UAT-Additional1: Search can be triggered with Enter key', async () => {
        const store = createMockStore();
        render(
            <Provider store={store}>
                <Home />
            </Provider>
        );

        // Wait for products to load
        await waitFor(() => {
            expect(screen.getByText('Coffee')).toBeInTheDocument();
        });

        // Search with Enter key
        const searchInput = screen.getByPlaceholderText(/search for products/i);

        fireEvent.change(searchInput, { target: { value: 'Espresso' } });
        fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

        // Verify results
        await waitFor(() => {
            expect(screen.getByText('Espresso')).toBeInTheDocument();
            expect(screen.queryByText('Coffee')).not.toBeInTheDocument();
        });
    });

    /**
     * Additional test: Search with empty search term should show all products
     */
    test('UAT-Additional2: Empty search should display all active products', async () => {
        const store = createMockStore();
        render(
            <Provider store={store}>
                <Home />
            </Provider>
        );

        // Wait for products to load
        await waitFor(() => {
            expect(screen.getByText('Coffee')).toBeInTheDocument();
        });

        // First filter to some products
        const searchInput = screen.getByPlaceholderText(/search for products/i);
        const searchButton = screen.getByTestId('search-button');

        fireEvent.change(searchInput, { target: { value: 'Espresso' } });
        fireEvent.click(searchButton);

        // Verify filtered results
        await waitFor(() => {
            expect(screen.getByText('Espresso')).toBeInTheDocument();
            expect(screen.queryByText('Coffee')).not.toBeInTheDocument();
        });

        // Then clear and search again
        fireEvent.change(searchInput, { target: { value: '' } });
        fireEvent.click(searchButton);

        // Verify all active products are shown
        await waitFor(() => {
            expect(screen.getByText('Coffee')).toBeInTheDocument();
            expect(screen.getByText('Espresso')).toBeInTheDocument();
            expect(screen.getByText('Latte')).toBeInTheDocument();
            expect(screen.getByText('Cappuccino')).toBeInTheDocument();
            expect(screen.getByText('Mocha')).toBeInTheDocument();
            // Make sure inactive products still aren't shown
            expect(screen.queryByText('Hidden Product')).not.toBeInTheDocument();
        });
    });

    /**
     * Additional test: Case insensitive search
     */
    test('UAT-Additional3: Search is case insensitive', async () => {
        const store = createMockStore();
        render(
            <Provider store={store}>
                <Home />
            </Provider>
        );

        // Wait for products to load
        await waitFor(() => {
            expect(screen.getByText('Coffee')).toBeInTheDocument();
        });

        // Search with lowercase
        const searchInput = screen.getByPlaceholderText(/search for products/i);
        const searchButton = screen.getByTestId('search-button');

        fireEvent.change(searchInput, { target: { value: 'coffee' } });
        fireEvent.click(searchButton);

        // Verify Coffee is found (despite searching with lowercase)
        await waitFor(() => {
            expect(screen.getByText('Coffee')).toBeInTheDocument();
        });

        // Search with mixed case
        fireEvent.change(searchInput, { target: { value: 'EsPrEsSo' } });
        fireEvent.click(searchButton);

        // Verify Espresso is found
        await waitFor(() => {
            expect(screen.getByText('Espresso')).toBeInTheDocument();
        });
    });
});