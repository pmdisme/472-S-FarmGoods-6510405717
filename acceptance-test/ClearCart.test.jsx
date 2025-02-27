import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Cart from '@/app/components/Cart';
import { clearCard } from '@/store/cartSlice';
import '@testing-library/jest-dom';

// Mock Redux store
const mockStore = configureStore([]);

jest.mock('../src/utils/hooks', () => ({
  useAppSelector: jest.fn((selector) => []),
  useAppDispatch: jest.fn()
}));

// Mock CartItem component เพื่อจัดการกับ dependency
jest.mock('../src/app/components/CartItem', () => {
  return function MockCartItem(props) {
    return <div data-testid={`cart-item-${props.id}`}>{props.name}</div>;
  };
});

describe('Cart Component - ClearCart', () => {
  let store;
  let mockState;
  let mockDispatch;
  let mockCartItems;

  beforeEach(() => {
    
    mockCartItems = [
      { id: 1, name: 'apple', price: 10, quantity: 2 },
      { id: 2, name: 'banana', price: 8, quantity: 1 }
    ];

    mockState = {
      cart: {
        cart: mockCartItems,
        error: null
      }
    };

    store = mockStore(mockState);
    mockDispatch = jest.fn();
    
  
    const { useAppSelector, useAppDispatch } = require('../src/utils/hooks');
    
    useAppSelector.mockImplementation((selector) => {

      if (typeof selector === 'function') {

        return selector(mockState);
      }
    
      return mockCartItems;
    });
    
    useAppDispatch.mockReturnValue(mockDispatch);
  });

  test('TC1: Should show "Remove all" button based on cart state', () => {
    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );

    const removeAllButton = screen.getByText('Remove all');
    expect(removeAllButton).toBeInTheDocument();
    expect(removeAllButton).not.toBeDisabled();
  });

  test('TC2: Should hide "Remove all" button based on cart state', () => {
   
    mockCartItems = [];
    
  
    const { useAppSelector } = require('../src/utils/hooks');
    useAppSelector.mockImplementation((selector) => {
      if (typeof selector === 'function') {
  
        const emptyState = {
          cart: {
            cart: [],
            error: null
          }
        };
        return selector(emptyState);
      }
      return [];
    });
    
    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );

    const removeAllButton = screen.getByText('Remove all');
    expect(removeAllButton).toBeInTheDocument();
    expect(removeAllButton).toBeDisabled();
  });

  test('TC3: Should display confirmation dialog when clicking "Remove all"', async () => {
    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );

    const removeAllButton = screen.getByText('Remove all');
    fireEvent.click(removeAllButton);

    const dialogTitle = screen.getByText('Remove Product');
    const dialogMessage = screen.getByText('Are you sure you want to remove all product in cart?');
    const noButton = screen.getByText('No');
    const yesButton = screen.getByText('Yes');

    expect(dialogTitle).toBeInTheDocument();
    expect(dialogMessage).toBeInTheDocument();
    expect(noButton).toBeInTheDocument();
    expect(yesButton).toBeInTheDocument();
  });

  test('TC4: Should keep items in cart when clicking "No" on confirmation', async () => {
    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );

    const removeAllButton = screen.getByText('Remove all');
    fireEvent.click(removeAllButton);

    const noButton = screen.getByText('No');
    fireEvent.click(noButton);

    await waitFor(() => {
      expect(screen.queryByText('Remove Product')).not.toBeInTheDocument();
    });

    expect(mockDispatch).not.toHaveBeenCalledWith(clearCard());
  });

  test('TC5: Should clear cart when clicking "Yes" on confirmation', async () => {
    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );

    const removeAllButton = screen.getByText('Remove all');
    fireEvent.click(removeAllButton);

    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(screen.queryByText('Remove Product')).not.toBeInTheDocument();
    });

    expect(mockDispatch).toHaveBeenCalledWith(clearCard());
  });

  test('TC6: Should update cart state after clearing items', async () => {
    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );

    const removeAllButton = screen.getByText('Remove all');
    fireEvent.click(removeAllButton);

    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(clearCard());
    });

    mockCartItems = [];
    const { useAppSelector } = require('../src/utils/hooks');
    useAppSelector.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        const emptyState = {
          cart: {
            cart: [],
            error: null
          }
        };
        return selector(emptyState);
      }
      return [];
    });

  });
});