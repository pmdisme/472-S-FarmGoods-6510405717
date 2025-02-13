import React from 'react';
import { FileIcon } from 'lucide-react';
import { Button, Box, Typography } from '@mui/material';
import Image from 'next/image';

export const ImageUpload = ({
                                selectedFileName,
                                previewUrl,
                                errors,
                                handleImageChange,
                                truncateFileName
                            }) => (
    <Box>
        <input
            accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
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
                    <Typography variant="caption" sx={{ fontSize: '0.8rem', ml: '0.5rem' }}>
                        (Max 10MB: JPEG, PNG, WebP, SVG)
                    </Typography>
                </Button>
            </label>

            {errors.productImage && (
                <Typography
                    color="error"
                    sx={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <span style={{ fontSize: '20px' }}>⚠️</span>
                    {errors.productImage}
                </Typography>
            )}

            {selectedFileName && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <FileIcon width={16} height={16} style={{ color: '#666666', display: 'block', flexShrink: 0 }} />
                    <Typography sx={{
                        fontSize: '0.875rem',
                        color: 'text.secondary',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        lineHeight: 1.5,
                        display: 'block',
                    }}>
                        {truncateFileName(selectedFileName)}
                    </Typography>
                </Box>
            )}

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
    </Box>
);