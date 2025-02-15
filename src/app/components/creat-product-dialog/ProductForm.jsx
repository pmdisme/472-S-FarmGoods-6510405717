import React from 'react';
import { TextField, Box, Typography } from '@mui/material';
import { ImageUpload } from './ImageUpload';

export const ProductForm = ({
                                formData,
                                errors,
                                handleInputChange,
                                handleImageChange,
                                previewUrl,
                                selectedFileName,
                                truncateFileName
                            }) => (
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

        <ImageUpload
            errors={errors}
            handleImageChange={handleImageChange}
            previewUrl={previewUrl}
            selectedFileName={selectedFileName}
            truncateFileName={truncateFileName}
        />
    </Box>
);