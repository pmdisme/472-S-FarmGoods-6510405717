import { createSlice} from '@reduxjs/toolkit'

const initialState = {
    cart: [],
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            state.cart.push(action.payload);
        },
        removeFromCart: (state, action) => {
            state.cart = state.cart.filter((item) => item.id !== action.payload)
        },
        increaseQuantity: (state, action) => {
            state.cart[action.payload].quantity += 1;
        },
        decreaseQuantity: (state, action) => {
            state.cart[action.payload].quantity -= 1;
        },
    },
})
  
  export const {addToCart, removeFromCart, increaseQuantity, decreaseQuantity} = cartSlice.actions
  
  
  export const selectCart = (state) => state.cart
  
  export default cartSlice.reducer

