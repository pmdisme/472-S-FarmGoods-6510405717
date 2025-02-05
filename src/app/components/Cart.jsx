"use client"

import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'
import { useState, useEffect } from 'react'
import { useAppSelector } from '@/utile/hooks'
import CartItem from './CartItem'
import { useCart } from '@/hooks/useCart'

const Cart = () => {
  useCart();
  const cartItems = useAppSelector((state) => state.cart.cart);
  const error = useAppSelector(state => state.cart.error);
  const [orderTotal, setOrderTotal] = useState(0);
  const [numberOfItem, setNumberOfItem] = useState(0);
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const getOrderTotal = () => {
    let tempOrderTotal = 0;
    cartItems.map((item) => {
      tempOrderTotal += item.quantity * item.price;
    });
    setOrderTotal(tempOrderTotal);
  };

  /* count order in cart */
  const getNumberOfItem = () => {
    let numberOfItem = 0;
    cartItems.map((item) => {
      numberOfItem += item.quantity;
    });
    setNumberOfItem(numberOfItem);
  };

  useEffect(() => {
    getOrderTotal();
    getNumberOfItem();
  }, [cartItems]);

  useEffect(() => {
    if (error) {
      setOpen(true);
    }
  }, [error]);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Unexpected Error</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Oops! Something went wrong. Please try refreshing the page and doing again. If the problem persists, please contact our support team for assistance.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{
        backgroundColor: "#f8f5db",
        width: "350px",
        position: "fixed",
        right: "10px",
        top: "10px",
        bottom: "10px",
        borderRadius: "0.5rem",
        padding: "1.5rem",
        overflowY: "auto",
      }}>
        <Typography
          sx={{
            color: "#48c9b0",
            fontSize: "2rem",
            fontWeight: "600",
            marginBottom: "1.5rem"
          }}>
          Your Order({numberOfItem})
        </Typography>

        {cartItems.map((item) => {
          return <CartItem key={item.id} {...item} />;
        })}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "1rem 0"
          }}>
          <Typography sx={{ color: "#094372", fontSize: "1rem" }}>
            Order Total
          </Typography>
          <Typography sx={{ color: "#094372", fontSize: "1.5rem", fontWeight: 600 }}>
            ฿{orderTotal.toFixed(2)}
          </Typography>
        </Box>
      </Box>
    </>
  )
}

export default Cart;