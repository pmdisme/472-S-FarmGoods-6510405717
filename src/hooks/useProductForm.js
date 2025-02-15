import { useState } from 'react';

const ERROR_MESSAGES = {
    GENERAL: "Product creation failed. Something went wrong. Please refresh and try again, or contact support if the issue persists.",
    NAME: "Product name already exists.",
    PRICE: "Invalid price. Please enter a number that is zero or greater.",
    IMAGE_TYPE: "Invalid file type. Please upload JPEG, JPG, PNG, WebP, or SVG files only.",
    IMAGE_SIZE: "File size exceeds 10MB limit."
};

export const useProductForm = (onSuccess) => {
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
        productImage: '',
        general: ''
    });

    const validateImageFile = (file) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            return ERROR_MESSAGES.IMAGE_TYPE;
        }

        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return ERROR_MESSAGES.IMAGE_SIZE;
        }

        return null;
    };

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
        setErrors(prev => ({
            ...prev,
            [name]: '',
            general: ''
        }));
    };

    const handleImageChange = (e) => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        setSelectedFileName('');
        setFormData(prev => ({
            ...prev,
            productImage: null
        }));

        const file = e.target.files[0];
        if (file) {
            const error = validateImageFile(file);
            if (error) {
                setErrors(prev => ({
                    ...prev,
                    productImage: error
                }));
                e.target.value = '';
                return;
            }

            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setSelectedFileName(file.name);
            setFormData(prev => ({
                ...prev,
                productImage: file
            }));
            setErrors(prev => ({
                ...prev,
                productImage: ''
            }));
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
                if (onSuccess) {
                    onSuccess(data.data);
                }
            } else {
                if (data.error.includes('name already exists')) {
                    setErrors(prev => ({ ...prev, productName: ERROR_MESSAGES.NAME }));
                } else if (data.error.includes('price')) {
                    setErrors(prev => ({ ...prev, productPrice: ERROR_MESSAGES.PRICE }));
                } else {
                    setErrors(prev => ({ ...prev, general: ERROR_MESSAGES.GENERAL }));
                }
            }
        } catch (error) {
            setErrors(prev => ({ ...prev, general: ERROR_MESSAGES.GENERAL }));
        }
    };

    const isFormValid = Boolean(
        formData.productName.trim() &&
        formData.productPrice.trim() &&
        formData.productImage
    );

    const resetForm = () => {
        setFormData({
            productName: '',
            productPrice: '',
            productImage: null
        });
        setErrors({
            productName: '',
            productPrice: '',
            productImage: '',
            general: ''
        });
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        setSelectedFileName('');
    };

    return {
        formData,
        errors,
        previewUrl,
        selectedFileName,
        handleInputChange,
        handleImageChange,
        handleSubmit,
        truncateFileName,
        isFormValid,
        resetForm
    };
};