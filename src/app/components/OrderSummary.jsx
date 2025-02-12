import React, { useState } from 'react'
import Payment from './Payment'
import { Dialog, Button, DialogTitle, DialogContent, DialogContentText, Box, Typography } from '@mui/material'
import CartItem from './CartItem';
import { useAppSelector } from '@/utile/hooks';

const OrderSummary = ({ openOrderSummary, handleClose, orderTotal }) => {

  const cartItems = useAppSelector((state) => state.cart.cart)
  const [openPayment, setOpenPayment] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const currentDate = new Date();

  const formattedDate = currentDate.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const handleOpenPayment = () => {
    setOpenPayment(true);
  }

  const handleClosePayment = () => {
    setOpenPayment(false);
  }


  return (
    <Dialog
      open={openOrderSummary}
      onClick={handleClose}
      maxWidth='xs'
      fullWidth
    >
      <DialogTitle
        sx={{
          fontSize: "1.4rem",
          fontWeight: 600,
          padding: "2rem",
          paddingBottom: "1.3rem",
        }}>
        Order Summary
      </DialogTitle>

      <DialogContent sx={{ padding: "2rem" }}>

        {/*Date and Time*/}

        <Box sx={{ borderBottom: "0.5px solid #cacfd2" }}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", color: "#707b7c", fontSize: "1rem", marginBottom: "7px" }}>
            <Typography> Date
            </Typography>
            <Typography>{formattedDate}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", color: "#707b7c", fontSize: "1rem", marginBottom: "10px" }}>
            <Typography>Time</Typography>
            <Typography>{formattedTime}</Typography>
          </Box>
        </Box>

        {/*List Product*/}

        <Box sx={{ marginTop: "1.2rem", borderBottom: "0.5px solid #cacfd2" }}>

          <Typography sx={{ fontSize: "1rem", fontWeight: 600 }}>Products</Typography>

          {cartItems.map((item) =>
            <Box key={item.id}>

              <Box sx={{ display: "flex", alignItems: "center", marginBottom: "1rem", justifyContent: "space-between", marginTop: "1rem" }}>

                <Box sx={{ display: "flex", gap: "10px" }}>
                  <Typography sx={{ color: "#616a6b" }}>{item.name}</Typography>
                  <Typography sx={{ color: "#839192" }}>X{item.quantity}</Typography>
                </Box>
                <Typography sx={{ color: "#424949" }}>{(item.price * item.quantity).toFixed(2)}฿</Typography>

              </Box>
            </Box>
          )}

        </Box>

        {/* total Price */}
        <Box sx={{ marginTop: "auto", paddingTop: "1rem", display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: "1.2rem", fontWeight: 600 }}>Total</Typography>
          <Typography sx={{ fontSize: "1.2rem", fontWeight: 600 }}>{orderTotal.toFixed(2)}฿</Typography>
        </Box>

        {/* confirm payment */}
        <button style={{
          width: "100%",
          padding: "1rem",
          marginTop: "1rem",
          backgroundColor: isHover? "#03af9c":"#48c9b0",
          border: "#48c9b0",
          borderRadius: "1rem",
          fontSize: "1.2rem",
          fontWeight: 600,
          color: "#ffffff"
        }}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onClick={handleOpenPayment}
        > Confirm Payment
        </button>

      </DialogContent>

      <Payment openPayment={openPayment} />

    </Dialog>

  )
}

export default OrderSummary
