"use client"
import { Box, Typography } from '@mui/material';
import { useAppDispatch } from '@/utile/hooks';
import { removeFromCart } from '@/store/cartSlice';
import React from 'react'

const CartItem = ({ id, name, price, quantity }) => {

    const dispatch = useAppDispatch();
    const totalPrice = price * quantity;

    return (
        <Box
            sx={{
                borderBottom: "0.5px solid #B0C4DE",
                display: "flex",
                justifyContent: "space-between",
                paddingBottom: "1rem",
                alignItems: "center",
                marginTop: "1rem"
            }}>
            <Box>
                <Typography sx={{ color: "#2F4F4F", fontSize: "1.2rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                    {name}
                </Typography>
                <Box sx={{ display: "flex" }}>
                    <Typography sx={{ color: "#C73B0F", fontWeight: "600", paddingRight: "1rem"}}>{quantity}x</Typography>
                    <Typography sx={{ color: "#708090", fontWeight: "600" }}>฿{totalPrice.toFixed(2)}</Typography>
                </Box>
            </Box>
            <button
                style={{
                    color: "#FF6347",
                    border: "1px solid #FF6347",
                    borderRadius: "4rem", 
                    background: "transparent",
                    padding: "0 0.5rem",
                    height: "1.7rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
                onClick={() => dispatch(removeFromCart(id))}
            >
                X
            </button>

        </Box>
    )
}

export default CartItem