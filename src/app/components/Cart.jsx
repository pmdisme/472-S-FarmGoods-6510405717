"use client"
import { Box,Typography } from '@mui/material'
import React from 'react'

const Cart = () => {
  return (
    <Box sx={{
        backgroundColor: "#fcf3cf", 
        width: "70vw",
        position: "relative", 
        bottom: "40px",
        borderRadius: "0.5rem",
        marginLeft: "2rem",
        padding: "1.5rem"
    }}>
      <Typography sx={{color: "#00CED1", fontSize: "1.5rem",fontWeight: "600"}}>Cart Order(0)</Typography>
    </Box>
  )
}

export default Cart;