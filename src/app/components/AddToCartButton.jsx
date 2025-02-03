'use client'

import { Box, Button } from '@mui/material'
import React from 'react'
import Image from 'next/image'
import { useAppDispatch, useAppSelector } from '@/utile/hooks';
import { addToCart, increaseQuantity, decreaseQuantity } from '@/store/cartSlice';
import { useAddToCart } from '@/hooks/useAddToCart';

const AddToCartButton = ({ isItemInCart, id, price, name }) => {
    const dispatch = useAppDispatch();
    const { cart } = useAppSelector((state) => state.cart);
    const { addItemToCart } = useAddToCart();

    const isItem = (item) => item.id === id;
    const itemIndex = cart.findIndex(isItem);

    const handleAddToCart = async () => {
        const success = await addItemToCart(id, 1);
        
        if (success) {
            dispatch(addToCart({
                id: id, 
                price: price, 
                name: name, 
                quantity: 1
            }));
        }
    };

    const handleIncreaseQuantity = async () => {
        const success = await addItemToCart(id, 1);
        if (success) {
            dispatch(increaseQuantity(itemIndex));
        }
    };

    const handleDecreaseQuantity = () => {
        dispatch(decreaseQuantity(itemIndex));
    };

    return (
        <Box
            sx={{
                border: isItemInCart ? "none" : "1px solid #48c9b0",
                backgroundColor: isItemInCart ? "#79CDCD" : "#FFFFFF",
                borderRadius: "4rem",
                color: isItemInCart ? "#FFFFFF" : "#212f3d",
                fontSize: "1rem",
                fontWeight: 600,
                padding: "0.2rem",
                width: "70%",
                alignSelf: "center",
                position: "relative"
            }}
        >
            {isItemInCart ? (
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                    height: "100%",
                    marginBottom: "0.5rem"
                }}>
                    <button
                        style={{
                            backgroundColor: "transparent",
                            border: "1px solid #FFFFFF",
                            borderRadius: "4rem",
                            color: "#FFFFFF",
                            marginLeft: "0.5rem",
                        }}
                        onClick={handleDecreaseQuantity}
                    >
                        -
                    </button>

                    {cart[itemIndex].quantity}

                    <button style={{
                        backgroundColor: "transparent",
                        border: "1px solid #FFFFFF",
                        borderRadius: "4rem",
                        color: "#FFFFFF",
                        marginRight: "0.5rem",
                    }}
                    onClick={handleIncreaseQuantity}
                    >
                        +
                    </button>
                </Box>
            ) : (
                <Button
                    style={{
                        width: "100%",
                        background: "transparent",
                        border: "none",

                    }}
                    onClick={handleAddToCart}
                    >
                    <Image
                        src="/images/icon-add-to-cart.svg"
                        alt="cart"
                        height={16}
                        width={16}
                        style={{ marginRight: "0.5rem" }}
                    />
                    Add to Cart
                </Button>
            )}
        </Box>
    )
}

export default AddToCartButton;
