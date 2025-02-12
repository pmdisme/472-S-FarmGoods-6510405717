import React, { useState } from 'react';
import { FileIcon } from 'lucide-react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography
} from '@mui/material';
import Image from 'next/image';

const NewProductDialog = ({ open, handleClose }) => {
    const generalError = "Product creation failed. Something went wrong. Please refresh and try again, or contact support if the issue persists."
    const nameError = "Product name already exists.";
    const priceError = "Invalid price. Please enter a number that is zero or greater.";

    const [formData, setFormData] = useState({
        productName: '',
        productPrice: '',
        productImage: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [errors, setErrors] = useState({
        productName: '',
        productPrice: '',
        general: ''
    });

    const truncateFileName = (fileName) => {
        if (fileName.length <= 60) return fileName;

        const extension = fileName.split('.').pop();
        const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));

        return `${nameWithoutExt.substring(0, 57)}...${extension}`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user edits
        setErrors(prev => ({
            ...prev,
            [name]: '',
            general: ''
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setSelectedFileName(file.name);
            setFormData(prev => ({
                ...prev,
                productImage: file
            }));

            // Clean up the old preview URL
            return () => URL.revokeObjectURL(url);
        }
    };

    const handleSubmit = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('productName', formData.productName);
            formDataToSend.append('productPrice', formData.productPrice);
            formDataToSend.append('productImage', formData.productImage);

            const response = await fetch('/api/products', {
                method: 'POST',
                body: formDataToSend,
            });

            const data = await response.json();

            if (data.success) {
                handleClose();
            } else {
                // Check error type
                if (data.error.includes('name already exists')) {
                    setErrors(prev => ({ ...prev, productName: nameError }));
                } else if (data.error.includes('price')) {
                    setErrors(prev => ({ ...prev, productPrice: priceError }));
                } else {
                    setErrors(prev => ({ ...prev, general: generalError}));
                }
            }
        } catch (error) {
            setErrors(prev => ({ ...prev, general: 'Failed to create product' }));
        }
    };

    return (
        <Dialog
            open={open}
            maxWidth='sm'
            fullWidth
        >
            <DialogTitle sx={{
                marginTop: '1rem',
                textAlign: 'center',
                fontSize: '1.6rem',
                fontWeight: 600,
                color: "#212f3c",
            }}>
                New Product
            </DialogTitle>

            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    {errors.general && (
                        <Typography
                            color="error"
                            sx={{
                                backgroundColor: '#ffebee',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <span style={{ fontSize: '20px' }}>⚠️</span>
                            {errors.general}
                        </Typography>
                    )}

                    <TextField
                        name="productName"
                        label="Product Name"
                        fullWidth
                        value={formData.productName}
                        onChange={handleInputChange}
                        error={!!errors.productName}
                        helperText={errors.productName}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '1rem',
                                height: 55
                            },
                            '& .MuiFormHelperText-root': {
                                fontSize: '0.8rem',
                                marginTop: '4px',
                                fontWeight: 500
                            }
                        }}
                    />

                    <TextField
                        name="productPrice"
                        label="Price"
                        type="number"
                        fullWidth
                        value={formData.productPrice}
                        onChange={handleInputChange}
                        error={!!errors.productPrice}
                        helperText={errors.productPrice}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '1rem',
                                height: 55
                            },
                            '& .MuiFormHelperText-root': {
                                fontSize: '0.8rem',
                                marginTop: '4px',
                                fontWeight: 500
                            }
                        }}
                        inputProps={{
                            min: 0,
                            step: "0.01",
                            onKeyPress: (e) => {
                                if (!/[0-9.]/.test(e.key)) {
                                    e.preventDefault();
                                }
                                if (e.key === "." && e.target.value.includes(".")) {
                                    e.preventDefault();
                                }
                            }
                        }}
                    />

                    <Box>
                        <input
                            accept="image/*"
                            type="file"
                            id="image-upload"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <label htmlFor="image-upload">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    fullWidth
                                    sx={{
                                        borderColor: '#48c9b0',
                                        color: '#48c9b0',
                                        borderRadius: "1rem",
                                        height: 40,
                                        '&:hover': {
                                            borderColor: '#3cb39a',
                                            backgroundColor: '#F5F5F5'
                                        }
                                    }}
                                >
                                    Upload Image
                                </Button>
                            </label>
                            {selectedFileName && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <FileIcon
                                        width={16}
                                        height={16}
                                        alt="File icon"
                                        style={{
                                            color: '#666666',
                                            display: 'block',
                                            flexShrink: 0,
                                        }}
                                    />

                                    <Typography
                                        sx={{
                                            fontSize: '0.875rem',
                                            color: 'text.secondary',
                                            maxWidth: '100%',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            lineHeight: 1.5,
                                            display: 'block',
                                        }}
                                    >
                                        {truncateFileName(selectedFileName)}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>

                    {previewUrl && (
                        <Box sx={{ textAlign: 'center' }}>
                            <Image
                                src={previewUrl}
                                alt="Preview"
                                height={195}
                                width={195}
                                style={{
                                    borderRadius: "0.5rem",
                                    marginBottom: "1rem",
                                    objectFit: "contain"
                                }}
                            />
                        </Box>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ margin: "10px" }}>
                <Button
                    onClick={handleClose}
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
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                        width: 104,
                        height: 40,
                        backgroundColor: '#48c9b0',
                        '&:hover': {
                            backgroundColor: '#3cb39a',
                        },
                        borderRadius: "1rem",
                        fontSize: '1rem',
                        fontWeight: 600,
                    }}
                    disabled={!formData.productName || !formData.productPrice || !formData.productImage}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewProductDialog;