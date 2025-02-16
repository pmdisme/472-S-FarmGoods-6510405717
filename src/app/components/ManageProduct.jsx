"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
    DialogActions,
    Box
} from "@mui/material";
import ManageProductDialog from "./ManageProductDialog";
import { useManageProduct } from "@/hooks/useManageProduct";
import Image from 'next/image';
import React from "react";

const ManageProduct = ({ open, onClose }) => {
    const {
        searchTerm,
        setSearchTerm,
        handleSearchHide,
        handleKeyPress,
        filteredProducts,
        handleToggleStatus,
        handleConfirmUpdate,
        openConfirm,
        setOpenConfirm,
        handleCancel,
        showSuccess
    } = useManageProduct(open, onClose);

    const handleUpdate = async () => {
        await handleConfirmUpdate();
        setOpenConfirm(false);
        onClose();
        window.location.reload(); // Refresh the page after update
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
                sx={{
                    "& .MuiDialog-paper": {
                        minHeight: "500px",
                        height: "500px",
                        maxHeight: "500px",
                        padding: "1rem"
                    }
                }}
            >
                <DialogTitle sx={{
                    marginTop: '1rem',
                    textAlign: 'center',
                    fontSize: '1.6rem',
                    fontWeight: 600,
                    color: "#212f3c",
                }}>
                    Manage Products
                </DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            marginTop: "0.5rem",
                            marginBottom: "1rem",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search for products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyPress}
                            sx={{
                                height: "3rem",
                                width: "28rem",
                                marginLeft: "0.5rem",
                                border: 'none',
                                color: "text.secondary",
                                padding: "0 1rem 4px",
                                backgroundColor: "#ffffff",
                                borderRadius: "1rem",
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": { border: "none" },
                                    "&:hover fieldset": { border: "none" },
                                    "&.Mui-focused fieldset": { border: "none" },
                                },
                                '&:focus-within': {
                                    outline: 'none',
                                    boxShadow: '0 0 0 2px rgba(0,0,0,0.1)'
                                }
                            }}
                        />
                        <Box
                            data-testid="search-button"
                            sx={{
                                backgroundColor: "#79CDCD",
                                height: "3rem",
                                width: "3rem",
                                border: "1px",
                                borderRadius: "1rem",
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                marginLeft: "0.5rem",
                                cursor: "pointer",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                            onClick={handleSearchHide}
                        >
                            <Image
                                src="/images/icons/icon-search.svg"
                                alt="search icon"
                                width={24}
                                height={24}
                            />
                        </Box>
                    </Box>
                    {filteredProducts.sort((a, b) => a.id - b.id).map(product => (
                        <Box key={product.id} sx={{ display: "block" }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={product.isActive}
                                        onChange={() => handleToggleStatus(product.id)}
                                    />
                                }
                                label={`${product.name} (ID: ${product.id})`}
                            />
                        </Box>
                    ))}
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={handleCancel}
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
                        Cancel
                    </Button>

                    <Button
                        onClick={() => setOpenConfirm(true)}
                        sx={{
                            width: 100,
                            height: 40,
                            backgroundColor: '#48c9b0',
                            '&:hover': {
                                backgroundColor: '#3cb39a'
                            },
                            borderRadius: "1rem",
                            borderWidth: '2px',
                            borderColor: '#48c9b0',
                            borderStyle: 'solid',
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: '#FFFFFF',
                        }}
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            <ManageProductDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={handleUpdate}
            />
        </>
    );
};

export default ManageProduct;