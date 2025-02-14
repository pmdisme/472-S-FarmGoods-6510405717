import React from 'react';
import { Dialog, DialogContent, Typography, Button } from '@mui/material';
import Image from "next/image";

export const SuccessDialog = ({ open, onClose }) => (
    <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
    >
        <DialogContent sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 4
        }}>
            <Image
                src="/images/icons/icon-circle-check.svg"
                width={48}
                height={48}
                style={{ marginBottom: '1rem' }}
                alt={"circle check icon"}
            />
            <Typography variant="h6" sx={{ mb: 2, color: "#212f3c" }}>
                Product Created Successfully!
            </Typography>
            <Button
                onClick={onClose}
                variant="contained"
                sx={{
                    width: 100,
                    height: 40,
                    backgroundColor: '#48c9b0',
                    '&:hover': {
                        backgroundColor: '#3cb39a',
                    },
                    borderRadius: "1rem",
                    fontSize: '1rem',
                    fontWeight: 600,
                }}
            >
                OK
            </Button>
        </DialogContent>
    </Dialog>
);