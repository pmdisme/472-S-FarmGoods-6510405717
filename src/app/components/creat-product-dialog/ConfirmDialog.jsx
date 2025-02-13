import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

export const ConfirmDialog = ({
                                  open,
                                  onClose,
                                  confirmAction,
                                  onConfirm
                              }) => (
    <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
    >
        <DialogTitle sx={{ textAlign: 'center', color: "#212f3c" }}>
            Please Confirm
        </DialogTitle>
        <DialogContent>
            <DialogContentText sx={{ textAlign: 'center' }}>
                {confirmAction === 'create'
                    ? 'Would you like to proceed with creating this product?'
                    : 'Would you like to close this form? The information you entered will not be saved.'}
            </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
            <Button
                onClick={onClose}
                sx={{
                    width: 100,
                    height: 40,
                    backgroundColor: '#FFFFFF',
                    '&:hover': {
                        backgroundColor: '#F5F5F5'
                    },
                    borderRadius: "1rem",
                    borderWidth: '2px',
                    borderColor: '#48c9b0',
                    borderStyle: 'solid',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#48c9b0',
                }}
            >
                No
            </Button>
            <Button
                onClick={onConfirm}
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
                Yes
            </Button>
        </DialogActions>
    </Dialog>
);