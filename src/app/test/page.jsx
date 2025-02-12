"use client";
import { useState } from "react";
import { Box } from "@mui/material";
import Newww from "@/app/components/NewProductDialog";

export default function SomePage() {
    const [openPayment, setOpenPayment] = useState(false);
    const [isHover, setIsHover] = useState(false);

    const handleClickConfirmOrder = () => {
        setOpenPayment(true);
    };

    const handleClosePayment = () => {
        setOpenPayment(false);
    };

    return (
        <Box>
            <button
                style={{
                    border: "1px solid #e74c3c",
                    backgroundColor: isHover ? "#cb4335" : "#e74c3c",
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
            >
                Confirm Order
            </button>

            <Newww
                open={openPayment}
                handleClose={handleClosePayment}
                orderTotal={0}
            />
        </Box>
    );
}
