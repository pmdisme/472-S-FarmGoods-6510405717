import { render, screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Cart from '@/app/components/Cart';
import '@testing-library/jest-dom';

global.fetch = jest.fn();

jest.spyOn(global, "fetch").mockImplementation( 
    jest.fn(
      () => Promise.resolve({ json: () => Promise.resolve({ data: 100 }), 
    }), 
  )) 
describe('Shopping Cart Acceptance Tests', () => {
    

    const mockStore = configureStore([]);
    
    const initialState = {
      cart: {
        cart: [
          { id: 1, name: 'Product 1', price: 100, quantity: 2 },
          { id: 2, name: 'Product 2', price: 150, quantity: 1 }
        ],
        error: null
      }
    };
  
    let store;
  
    beforeEach(() => {
      store = mockStore(initialState);
    });
  
    test('displays correct number of items in cart', () => {
      render(
        <Provider store={store}>
          <Cart />
        </Provider>
      );
      expect(screen.getByText('Your Order(3)')).toBeInTheDocument();
    })
    
    test('calculates and displays correct total price', () => {
        render(
          <Provider store={store}>
            <Cart />
          </Provider>
        );
        expect(screen.getByText('฿350.00')).toBeInTheDocument();
  });

  test('displays error dialog when cart operation fails', () => {
    const errorState = {
      cart: {
        cart: [],
        error: 'Failed to update cart'
      }
    };
    store = mockStore(errorState);

    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );

    expect(screen.getByText('Unexpected Error')).toBeInTheDocument();
    expect(screen.getByText(/Oops! Something went wrong/)).toBeInTheDocument();
  });
});
