"use client"

import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'
import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/utils/hooks'
import CartItem from './CartItem'
import Payment from './Payment'
import OrderSummary from './OrderSummary'
import Receipt from './Receipt'
import { clearCard } from '@/store/cartSlice'

const Cart = () => {
  const cartItems = useAppSelector((state) => state.cart.cart);
  const error = useAppSelector(state => state.cart.error);
  const [orderTotal, setOrderTotal] = useState(0);
  const [numberOfItem, setNumberOfItem] = useState(0);
  const [open, setOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [openOrderSummary, setOpenOrderSummary] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [openReceipt, setOpenReceipt] = useState(false)

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');

  const [openAlertRemoveAll, setOpenAlertRemoveAll] = useState(false)
  const dispatch = useAppDispatch();

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

  const isOrderEmpty = numberOfItem === 0;

  useEffect(() => {
    getOrderTotal();
    getNumberOfItem();
  }, [cartItems]);

  useEffect(() => {
    if (error) {
      setOpen(true);
    }
  }, [error]);

  // set open ordersummary
  const handleClickConfirmOrder = () => {
    setOpenOrderSummary(true);
  };

  const handleCloseOrderSummary = () => {
    setOpenOrderSummary(false);
  }

  // set open payment
  const handleOpenPayment = () => {
    setOpenPayment(true);
    setOpenOrderSummary(false);
  }

  const handleClosePayment = () => {
    setOpenPayment(false);
  }

  // set open receipt
  const handleOpenReceipt = () => {
    setOpenReceipt(true);
    setOpenPayment(false);
  }

  const handleCloseReceipt = () => {
    setOpenReceipt(false);
  }

  const handleClickOpenRemoveDialog = () => {
    setOpenAlertRemoveAll(true)
  }

  const handleCloseRemoveAll = () => {
    setOpenAlertRemoveAll(false)
  }

  const handleConfirmRemove = () => {
    dispatch(clearCard());
    setOpenAlertRemoveAll(false)
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

      <Dialog open={openAlertRemoveAll} onClose={handleCloseRemoveAll} maxWidth='xs' fullWidth >
        <DialogTitle sx={{ textAlign: "center", color: "#212f3c", paddingTop: 3.5 }}>
          Remove Product
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: "center", margin: 0.5, padding: 1, fontSize: "1.3rem" }}>
            Are you sure you want to remove all product in cart?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={handleCloseRemoveAll}
            sx={{
              width: 100,
              height: 40,
              backgroundColor: "#FFFFFF",
              "&:hover": { backgroundColor: "#F5F5F5" },
              borderRadius: "1rem",
              borderWidth: "2px",
              borderColor: "#48c9b0",
              borderStyle: "solid",
              fontSize: "1rem",
              fontWeight: 600,
              color: "#48c9b0",
            }}
          >
            No
          </Button>
          <Button
            variant="contained"
            sx={{
              width: 100,
              height: 40,
              backgroundColor: "#48c9b0",
              "&:hover": { backgroundColor: "#3cb39a" },
              borderRadius: "1rem",
              fontSize: "1rem",
              fontWeight: 600,
            }}
            onClick={handleConfirmRemove}
          >
            Yes
          </Button>
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
        zIndex: 1000,
        overflow: "hidden"
      }}>


        <Typography
          sx={{
            color: "#48c9b0",
            fontSize: "2rem",
            fontWeight: "600",
          }}>
          Your Order({numberOfItem})
        </Typography>

        <Button
          disabled={isOrderEmpty}
          sx={{
            marginLeft: "240px",
            marginTop: 1,
            marginBottom: 1,
            color: "#e74c3c",
            textDecoration: "underline",
            visibility: "visible",
            '&.Mui-disabled': {
              color: 'rgba(231, 76, 60, 0.5)',
            }
          }}
          onClick={handleClickOpenRemoveDialog}
        >
          Remove all
        </Button>


        <Box sx={{
          overflow: "auto",
          maxHeight: "calc(100% - 250px)",
        }}>
          {[...cartItems]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((item) => {
              return <CartItem key={item.id} {...item} />;
            })
          }
        </Box>

        <Box sx={{
          position: "sticky",
          bottom: 0,
          marginTop: "auto",
          paddingTop: "1rem"
        }}>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "1rem 0",
              background: "#e5e7e9",
              borderRadius: 2,
              padding: 2
            }}>
            <Typography sx={{ color: "#094372", fontSize: "1rem" }}>
              Order Total
            </Typography>
            <Typography sx={{ color: "#094372", fontSize: "1.5rem", fontWeight: 600 }}>
              ฿{orderTotal.toFixed(2)}
            </Typography>
          </Box>

          <Box>
            {!isOrderEmpty && (
              <button
                style={{
                  border: "#48c9b0",
                  backgroundColor: isHover ? "#3cb39a" : "#48c9b0",
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  borderRadius: "1rem",
                  color: "#ffffff",
                  padding: "0.8rem",
                  width: "100%",
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  alignSelf: "center",
                  transition: "all 0.2s ease-in-out",
                  cursor: isHover ? 'pointer' : 'default'
                }}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                onClick={handleClickConfirmOrder}
              > Confirm Order
              </button>
            )}
          </Box>
        </Box>
      </Box>

      <OrderSummary openOrderSummary={openOrderSummary} handleClose={handleCloseOrderSummary} orderTotal={orderTotal} handleOpenPayment={handleOpenPayment} setSelectedPaymentMethod={setSelectedPaymentMethod} />
      <Payment openPayment={openPayment} orderTotal={orderTotal} handleClosePayment={handleClosePayment} handleOpenReceipt={handleOpenReceipt} selectedPaymentMethod={selectedPaymentMethod} setSelectedPaymentMethod={setSelectedPaymentMethod} />
      <Receipt openReceipt={openReceipt} orderTotal={orderTotal} handleCloseReceipt={handleCloseReceipt} paymentMethod={selectedPaymentMethod} />
    </>
  )
}

export default Cart;