import React, { useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, Box, Typography } from '@mui/material'
import { clearCard } from '@/store/cartSlice';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';

const Receipt = ({ openReceipt, orderTotal, handleCloseReceipt, paymentMethod }) => {

    const cartItems = useAppSelector((state) => state.cart.cart)
    const [isHover, setIsHover] = useState(false);

    const dispatch = useAppDispatch();

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

    const handleClickClose = () => {
        handleCloseReceipt();
        dispatch(clearCard())
        setIsHover(false)
    }


    return (
        <Dialog
            open={openReceipt}
            maxWidth='xs'
            fullWidth
        >

            <DialogContent sx={{ padding: "2rem" }}>


                <Box
                    sx={{
                        alignItems: "center",
                        borderBottom: "0.5px solid #cacfd2",
                        flexDirection: 'column',
                        padding: '3px 0',
                        display: 'flex'
                    }}>
                    <Image
                        src="/images/icons/icon-correct.svg"
                        alt="success-image"
                        width={100}
                        height={100}
                        style={{ marginBottom: "10px" }}
                    />
                    <Typography sx={{ color: "#202020", fontWeight: 600, fontSize: "1.7rem" }}>Payment Success!</Typography>
                    <Typography sx={{ color: "#63D7A7", fontWeight: 600, fontSize: "1.7rem", mb: 2 }}>{orderTotal.toFixed(2)}</Typography>
                </Box>

                {/*Date and Time*/}
                <Box sx={{ borderBottom: "0.5px solid #cacfd2" }}>
                    <Box
                        sx={{ display: "flex", justifyContent: "space-between", fontSize: "1rem", marginBottom: "7px", mt: 2 }}>
                        <Typography sx={{ color: "#707b7c" }}> Date </Typography>
                        <Typography sx={{ color: "240 5.3% 26.1%" }}>{formattedDate}</Typography>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "1rem", marginBottom: "7px" }}>
                        <Typography sx={{ color: "#707b7c" }}>Time</Typography>
                        <Typography sx={{ color: "240 5.3% 26.1%" }}>{formattedTime}</Typography>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "1rem", marginBottom: "7px" }}>
                        <Typography sx={{ color: "#707b7c" }}>Payment Method</Typography>
                        <Typography sx={{ color: "240 5.3% 26.1%" }}>
                            {paymentMethod === 'cash' && 'Cash'}
                            {paymentMethod === 'qr' && 'QR Code'}
                            {paymentMethod === 'card' && 'Card'}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                        <Typography sx={{ fontSize: "1rem", color: "#707b7c" }}>Payment Status</Typography>
                        <Typography sx={{
                            color: "#4bc897",
                            border: "1.5px solid #48c9b0",
                            borderRadius: "1rem",
                            fontSize: "0.8rem",
                            padding: "1px 5px",
                            background: "#e2f8ef",
                            fontWeight: 600
                        }}>
                            Success
                        </Typography>
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
                    backgroundColor: isHover ? "#3cb39a" : "#48c9b0",
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    border: "#48c9b0",
                    borderRadius: "1rem",
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    color: "#ffffff",
                    cursor: isHover ? 'pointer' : 'default'
                }}
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                    onClick={handleClickClose}


                > Confirm
                </button>
            </DialogContent>
        </Dialog>
    )
}

export default Receipt
