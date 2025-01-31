"use client"
import { Box, Typography } from '@mui/material';
import React from 'react'

const CartItem = ({ item, price, quantity }) => {
    const totalPrice = price * quantity;
    return (
        <Box
            sx={{
                borderBottom: "1px soild #FFFAFA",
                display: "flex",
                justifyContent: "space-between",
                paddingBottom: "1rem"
            }}>
            <Box>
                <Typography sx={{ color: "#8B795E", fontSize: "0.857rem", fontWeight: "600" }}>
                    {item}
                </Typography>
                <Box sx={{ display: "flex" }}>
                    <Typography sx={{ color: "#696969", fontWeight: "600" }}>{quantity}x</Typography>
                    <Typography sx={{ color: "#8B4513" }}>@{price}x</Typography>
                    <Typography sx={{ color: "#FF4500", fontWeight: "600" }}>{totalPrice}x</Typography>
                </Box>
            </Box>
            <button
                style={{
                    color: "#E9967A",
                    border: "1px soild #E9967A",
                    borderRadius: "4rem", background: "transparent"
                }}
            >
                X
            </button>

        </Box>
    )
}

export default CartItem