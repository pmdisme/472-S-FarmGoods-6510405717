"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, FormControlLabel, Checkbox, Button, DialogActions, Box } from "@mui/material";
import ManageProductDialog from "./ManageProductDialog";
import Image from 'next/image';
import React from "react";

const ManageProduct = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [openManage, setOpenManage] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [updatedProducts, setUpdatedProducts] = useState([]);

    useEffect(() => {
        if (openManage) {
            fetch("/api/products")
                .then(response => response.json())
                .then(data => {
                    setProducts(data.data);
                    setFilteredProducts(data.data);
                })
                .catch(error => console.error("Error fetching products:", error));
        }
    }, [openManage]);

    const handleSearchHide = () => {
        const trimmedSearchTerm = searchTerm.trim().toLowerCase();
        if (trimmedSearchTerm === "") {
            setFilteredProducts(products);
            return;
        }

        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(trimmedSearchTerm) || 
            product.id.toString().includes(trimmedSearchTerm)
        );

        setFilteredProducts(filtered);
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSearchHide();
        }
    };

    const handleToggleStatus = (productId) => {
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === productId ? { ...product, isActive: !product.isActive } : product
            )
        );

        setFilteredProducts(prevFiltered =>
            prevFiltered.map(product =>
                product.id === productId ? { ...product, isActive: !product.isActive } : product
            )
        );

        setUpdatedProducts(prevUpdated => {
            const updated = [...prevUpdated];
            const index = updated.findIndex(p => p.id === productId);
            if (index !== -1) {
                updated[index].isActive = !updated[index].isActive;
            } else {
                const productToUpdate = products.find(p => p.id === productId);
                if (productToUpdate) {
                    updated.push({ ...productToUpdate, isActive: !productToUpdate.isActive });
                }
            }
            return updated;
        });
    };

    const handleConfirmUpdate = () => {
        fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ updatedProducts })
        })
        .then(response => response.json())
        .then(() => {
            setOpenConfirm(false);
            setUpdatedProducts([]);
        })
        .catch(error => console.error("Failed to update product status:", error));
    };

    return (
        <>
            <Box sx={{ marginLeft: "1rem" }}>
                <Button
                    style={{
                        marginTop: "1.5rem",
                        backgroundColor: "#cc0000",
                        height: "3rem",
                        width: "10rem",
                        border: "none",
                        borderRadius: "1rem",
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        marginLeft: "0.5rem",
                        cursor: "pointer",
                        fontSize: "1rem",
                        fontWeight: 525,
                        color: "white",
                        transition: "all 0.2s ease",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 1rem",
                        lineHeight: "1",
                        gap: "0.35rem"
                    }}
                    onClick={() => setOpenManage(true)}
                >
                    Hide Product
                </Button>
            </Box>

            <Dialog
                open={openManage}
                onClose={() => setOpenManage(false)}
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
                    {filteredProducts
                        .sort((a, b) => a.id - b.id) // Sort by ID
                        .map(product => (
                            <Box key={product.id} sx={{ display: "block" }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={product.isActive} // isActive=false products unchecked
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
                    onClick={() => setOpenManage(false)}
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
                onConfirm={handleConfirmUpdate}
            />
        </>
    );
};

export default ManageProduct;