'use client'

import { Box, Button } from '@mui/material'
import React from 'react'
import Image from 'next/image'


const AddToCartButton = ({isItemInCart}) => {
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
                            border: "1px soild #FFFFFF",
                            borderRadius: "4rem",
                            color: "#FFFFFF",
                            marginLeft: "0.5rem",
                        }}
                    >
                        -
                    </button>
                    0
                    <button style={{
                        backgroundColor: "transparent",
                        border: "1px soild #FFFFFF",
                        borderRadius: "4rem",
                        color: "#FFFFFF",
                        marginRight: "0.5rem",
                    }}
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
                         
                    }}>
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

export default AddToCartButton
