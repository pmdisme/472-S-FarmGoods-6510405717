"use client"

import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'
import { useState, useEffect } from 'react'
import { useAppSelector } from '@/utile/hooks'
import CartItem from './CartItem'
import { useCart } from '@/hooks/useCart'
import Payment from './Payment'

const Cart = () => {
  useCart();
  const cartItems = useAppSelector((state) => state.cart.cart);
  const error = useAppSelector(state => state.cart.error);
  const [orderTotal, setOrderTotal] = useState(0);
  const [numberOfItem, setNumberOfItem] = useState(0);
  const [open, setOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);

  const handleClose = () => setOpen(false);

  // calcuate price
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

  // set open payment
  const handleClickConfirmOrder = () => {
    setOpenPayment(true);
  };

  const handleClosePayment = () => {
    setOpenPayment(false);
  }

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
        zIndex: 1000
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

        {[...cartItems]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((item) => {
            return <CartItem key={item.id} {...item} />;
          })
        }

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
        <Box>
          <button
            style={{
              border: "1px solid #e74c3c",
              backgroundColor: isHover? "#cb4335" :"#e74c3c",
              borderRadius: "1rem",
              color: "#ffffff",
              padding: "0.8rem",
              width: "100%",
              fontSize: "1.3rem",
              fontWeight: 600,
              alignSelf: "center",
              transition: "all 0.2s ease-in-out",
              
            }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onClick={handleClickConfirmOrder}
          > Confirm Order
          </button>

        </Box>
      </Box>

      <Payment 
      open={openPayment} handleClose={handleClosePayment} orderTotal={orderTotal}/>
    </>
  )
}

export default Cart;