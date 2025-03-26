import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import { useProductForm } from "@/hooks/useProductForm";
import { ProductForm } from './ProductForm';
import { ConfirmDialog } from './ConfirmDialog';
import { SuccessDialog } from './SuccessDialog';

const NewProductDialog = ({ open, handleClose, onProductCreated }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSuccess = (newProduct) => {
        if (onProductCreated) {
            onProductCreated(newProduct);
        }
        setShowSuccess(true);
    };

    const {
        formData,
        errors,
        previewUrl,
        selectedFileName,
        handleInputChange,
        handleImageChange,
        handleSubmit: submitForm,
        truncateFileName,
        isFormValid,
        resetForm
    } = useProductForm(handleSuccess);

    const handleConfirmSubmit = () => {
        setShowConfirm(false);
        submitForm();
    };

    const handleCancel = () => {
        setConfirmAction('cancel');
        setShowConfirm(true);
    };

    const handleConfirmCancel = () => {
        setShowConfirm(false);
        resetForm();
        handleClose();
    };

    const handleCloseSuccess = () => {
        setShowSuccess(false);
        resetForm();
        handleClose();
    };

    return (
        <Dialog open={open} maxWidth='sm' fullWidth>
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
                <ProductForm
                    formData={formData}
                    errors={errors}
                    handleInputChange={handleInputChange}
                    handleImageChange={handleImageChange}
                    previewUrl={previewUrl}
                    selectedFileName={selectedFileName}
                    truncateFileName={truncateFileName}
                />
            </DialogContent>

            <DialogActions sx={{ margin: "10px" }}>
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
                    onClick={() => {
                        setConfirmAction('create');
                        setShowConfirm(true);
                    }}
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
                    disabled={!isFormValid}
                >
                    New
                </Button>
            </DialogActions>

            <ConfirmDialog
                open={showConfirm}
                onClose={() => setShowConfirm(false)}
                confirmAction={confirmAction}
                onConfirm={confirmAction === 'create' ? handleConfirmSubmit : handleConfirmCancel}
            />

            <SuccessDialog
                open={showSuccess}
                onClose={handleCloseSuccess}
            />
        </Dialog>
    );
};

export default NewProductDialog;