import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Box, Typography, Button } from '@mui/material';

const CalculateChange = ({ open, onClose, orderTotal, handleOpenReceipt }) => {
    const [amountPaid, setAmountPaid] = useState('');
    const [change, setChange] = useState(null);
    const [isHover, setIsHover] = useState(false);
    const [isHoverCancel, setIsHoverCancel] = useState(false);

    const handleCalculateChange = () => {
        const paid = parseFloat(amountPaid);
        if (isNaN(paid)) {
            alert('Please enter a valid number');
            return;
        }
        const calculatedChange = paid - orderTotal;
        if (calculatedChange < 0) {
            alert('Amount paid is less than the order total');
            return;
        }
        setChange(calculatedChange.toFixed(2));
    };

    const handleConfirm = () => {
        if (change === null) {
            alert('Please calculate change first');
            return;
        }
        
        setAmountPaid('');
        setChange(null);
        onClose();
        
        // Open receipt after closing the change calculator
        if (handleOpenReceipt) {
            handleOpenReceipt('cash');
        }
    };

    const handleCancel = () => {
        setAmountPaid('');
        setChange(null);
        onClose();
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleCalculateChange(); // trigger when enter
        }
    };

    return (
        <Dialog
            open={open}
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
                Calculate Change
            </DialogTitle>

            <DialogContent sx={{ padding: "2rem" }}>
                <Box sx={{ textAlign: "center", marginBottom: 3 }}>
                    <Typography sx={{ fontSize: "1.2rem", marginBottom: 1 }}>
                        Order Total:
                    </Typography>
                    <Typography sx={{ color: "#e74c3c", fontSize: "2rem", fontWeight: 600, marginBottom: "10px" }}>
                        {orderTotal.toFixed(2)}฿
                    </Typography>
                </Box>

                <Box sx={{ marginBottom: 3 }}>
                    <TextField
                        fullWidth
                        label="Amount Paid"
                        variant="outlined"
                        type="number"
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                        sx={{ marginBottom: 2 }}
                        onKeyDown={handleKeyPress}
                    />
                    
                    <Button 
                        fullWidth 
                        onClick={handleCalculateChange}
                        style={{
                            width: "100%",
                            padding: "1rem",
                            backgroundColor: "#48c9b0",
                            border: "none",
                            borderRadius: "1rem",
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            fontSize: "1.2rem",
                            fontWeight: 600,
                            color: "white",
                            cursor: "pointer"
                        }}
                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}
                    >
                        Calculate
                    </Button>
                </Box>

                {change !== null && (
                    <Box sx={{ textAlign: "center", marginBottom: 3, padding: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}>
                        <Typography sx={{ fontSize: "1.2rem", marginBottom: 1 }}>
                            Change:
                        </Typography>
                        <Typography sx={{ color: "#27ae60", fontSize: "2rem", fontWeight: 600 }}>
                            {change}฿
                        </Typography>
                    </Box>
                )}

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
                            cursor: "pointer"
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
                            color: "white",
                            cursor: "pointer"
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

export default CalculateChange;