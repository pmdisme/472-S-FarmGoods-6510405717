import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Typography } from '@mui/material';
import { useOrder,  } from '@/hooks/useOrder';

const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: '/images/icons/icon-cash.png' },
    { id: 'qr', label: 'QR Code', icon: '/images/icons/icon-qrCode.png' },
    { id: 'card', label: 'Card', icon: '/images/icons/icon-credit.png' },
];

const Payment = ({ openPayment, orderTotal, handleClosePayment, handleOpenReceipt, selectedPaymentMethod, setSelectedPaymentMethod }) => {


    const [isHoverCancel, setIsHoverCancel] = useState(false)
    const [isHover, setIsHover] = useState(false)
    const { addOrder } = useOrder();

    const handlePaymentMethodChange = (method) => {
        setSelectedPaymentMethod(method);
        localStorage.setItem('selectedPaymentMethod', method);
    };

    const handleConfirm = async () => {
        try {
            await addOrder(selectedPaymentMethod);
            handleOpenReceipt(selectedPaymentMethod);
            setIsHover(false)
        } catch (error) {

        }

    }

    const handleCancel = () => {
        handleClosePayment();
        setIsHoverCancel(false);
    }


    return (
        <Dialog
            open={openPayment}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle sx={{
                fontSize: "1.3rem",
                fontWeight: 600,
                padding: "2rem",
                paddingBottom: "1.3rem",
                marginTop: "0.5rem",
                marginBottom: "1rem"
            }}>
                Payment Method
            </DialogTitle>

            <DialogContent sx={{ padding: "2rem" }}>

                {/* Payment Method Selection */}
                <Box sx={{
                    display: "flex",
                    gap: "1rem",
                    mb: 4
                }}
                >
                    {paymentMethods.map((method) => (
                        <Box
                            key={method.id}
                            onClick={() => handlePaymentMethodChange(method.id)}
                            sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "1rem",
                                borderRadius: "0.5rem",
                                border: "2px solid",
                                borderColor: selectedPaymentMethod === method.id ? "black" : "grey.300",
                                cursor: "pointer",
                                transition: "all 0.2s",
                                '&:hover': {
                                    borderColor: "grey.600"
                                }
                            }}
                        >
                            <Box
                                component="img"
                                src={method.icon}
                                alt={method.label}
                                sx={{ width: 40, height: 40, marginBottom: "5px" }}
                            />
                            <Typography>{method.label}</Typography>
                        </Box>
                    ))}
                </Box>

                {/* Payment Method Content */}

                <Box sx={{ marginBottom: 4 }}>
                    {selectedPaymentMethod === 'cash' && (
                        <Box sx={{ textAlign: "center" }}>

                            <Typography sx={{ color: "#e74c3c", fontSize: "2rem", fontWeight: 600, marginBottom: "10px" }}>
                                {orderTotal.toFixed(2)}฿
                            </Typography>

                            <Box
                                component="img"
                                src="/images/icons/icon-cash.png"
                                alt="Cash payment"
                                sx={{ width: 150, height: 150 }}
                            />
                        </Box>
                    )}

                    {selectedPaymentMethod === 'qr' && (
                        <Box sx={{ textAlign: "center" }}>

                            <Typography sx={{ color: "#e74c3c", fontSize: "2rem", fontWeight: 600, marginBottom: "10px" }}>
                                {orderTotal.toFixed(2)}฿
                            </Typography>

                            <Box
                                component="img"
                                src="/images/icons/payment.png"
                                alt="QR Code"
                                sx={{ width: 200, height: 200 }}
                            />
                        </Box>
                    )}

                    {selectedPaymentMethod === 'card' && (
                        <Box sx={{ textAlign: "center" }}>
                            <Typography sx={{ color: "#e74c3c", fontSize: "2rem", fontWeight: 600, marginBottom: "10px" }}>
                                {orderTotal.toFixed(2)}฿
                            </Typography>

                        </Box>
                    )}


                </Box>

                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <button
                        style={{
                            width: "100%",
                            padding: "1rem",
                            backgroundColor: isHoverCancel ? "#F5F5F5" : "white",
                            border: "2px solid #48c9b0",
                            borderRadius: "1rem",
                            fontSize: "1.2rem",
                            fontWeight: 600,
                            color: "#48c9b0",
                        }}
                        onMouseEnter={() => setIsHoverCancel(true)}
                        onMouseLeave={() => setIsHoverCancel(false)}
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>

                    <button
                        style={{
                            width: "100%",
                            padding: "1rem",
                            backgroundColor: isHover ? "#3cb39a" : "#48c9b0",
                            border: "none",
                            borderRadius: "1rem",
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            fontSize: "1.2rem",
                            fontWeight: 600,
                            color: "white"
                        }}
                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}
                        onClick={handleConfirm}

                    >
                        Confirm
                    </button>
                </Box>
            </DialogContent>

        </Dialog>
    );
};

export default Payment;