import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Radio, RadioGroup, FormControlLabel, FormControl, Box, Typography } from '@mui/material';
import Image from 'next/image'
import { clearCard } from '@/store/cartSlice';

import { useAppDispatch } from '@/utile/hooks';

const Payment = ({ open, handleClose, orderTotal }) => {

    const [paymentMethod, setPaymentMethod] = useState("cash");
    const dispatch = useAppDispatch();
    
    const handleConfirm = () => {
        dispatch(clearCard());
        handleClose();
    };
    
    return (
        <Dialog
            open={open}
            maxWidth='xs'
            fullWidth
        >

            <Button
                style={{
                    color: "#909497",
                    fontSize: "1.4rem",
                    marginLeft: 'auto',
                    padding: "0.5rem"
                }}
                onClick={handleClose}> X
            </Button>

            <DialogTitle sx={{
                textAlign: 'center',
                fontSize: '1.6rem',
                fontWeight: 600,
                color: "#212f3c",
            }}>
                Payment Method
            </DialogTitle>

            <DialogContent>

                <Typography
                    sx={{
                        fontSize: "2rem",
                        fontWeight: 600,
                        margin: "1rem",
                        marginBottom: "1.5rem",
                        color: "#cb4335",
                        textAlign: "center"
                    }}>
                    ฿{orderTotal.toFixed(2)}
                </Typography>

                <FormControl component="fieldset" sx={{ width: '100%' }}>
                    <RadioGroup
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <Box sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            marginBottom: "15px",
                            '&:hover': {
                                backgroundColor: '#f5f5f5'
                            }
                        }}>
                            <FormControlLabel
                                value="cash"
                                control={<Radio />}
                                label={
                                    <Typography>เงินสด</Typography>
                                }
                                sx={{
                                    width: '100%',
                                    margin: "0.5rem",
                                    padding: "0.5rem"
                                }}
                            />
                        </Box>

                        <Box sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            '&:hover': {
                                backgroundColor: '#f5f5f5'
                            }
                        }}>
                            <FormControlLabel
                                value="qr"
                                control={<Radio />}
                                label={
                                    <Typography> QR Code</Typography>
                                }
                                sx={{
                                    width: '100%',
                                    margin: "0.5rem",
                                    padding: "0.5rem"
                                }}
                            />
                        </Box>
                    </RadioGroup>
                </FormControl>

                {paymentMethod === "qr" && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: "1.5rem",
                        marginBotton: "1rem",
                    }}>
                        <Box sx={{
                            backgroundColor: '#f5f5f5',
                            width: '200px',
                            height: '200px',
                            borderRadius: '10px',
                            padding: "1rem"
                        }}>
                            <Image
                                src=""
                                alt="QR Code"
                                style={{
                                    width: '200px',
                                    height: '200px'
                                }}
                            />
                        </Box>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ margin: "10px" }}>

                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    fullWidth

                    sx={{
                        backgroundColor: '#48c9b0',
                        '&:hover': {
                            backgroundColor: '#3cb39a'
                        },
                        borderRadius: '8px',
                        padding: "0.6rem",
                        fontSize: '1rem',
                        fontWeight: 600,

                    }}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Payment;