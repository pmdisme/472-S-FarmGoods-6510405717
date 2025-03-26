import { useState, useEffect } from "react";

export const useManageProduct = (open, onClose) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [openConfirm, setOpenConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [updatedProducts, setUpdatedProducts] = useState([]);

    useEffect(() => {
        if (open) {
            fetch("/api/products")
                .then(response => response.json())
                .then(data => {
                    setProducts(data.data);
                    setFilteredProducts(data.data);
                    setUpdatedProducts([]);
                })
                .catch(error => console.error("Error fetching products:", error));
        }
    }, [open]);

    const handleSearchHide = () => {
        const trimmedSearchTerm = searchTerm.trim().toLowerCase();
        setFilteredProducts(
            trimmedSearchTerm
                ? products.filter(product =>
                    product.name.toLowerCase().includes(trimmedSearchTerm) ||
                    product.id.toString().includes(trimmedSearchTerm)
                )
                : products
        );
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") handleSearchHide();
    };

    const handleToggleStatus = (productId) => {
        setProducts(prevProducts =>
            prevProducts.map(product => {
                if (product.id === productId) {
                    const updatedProduct = { ...product, isActive: !product.isActive };
                    setUpdatedProducts(prev => {
                        const exists = prev.find(p => p.id === productId);
                        return exists
                            ? prev.map(p => (p.id === productId ? updatedProduct : p))
                            : [...prev, updatedProduct];
                    });
                    return updatedProduct;
                }
                return product;
            })
        );

        setFilteredProducts(prevFiltered =>
            prevFiltered.map(product =>
                product.id === productId ? { ...product, isActive: !product.isActive } : product
            )
        );
    };

    const handleConfirmUpdate = () => {
        if (updatedProducts.length === 0) {
            setOpenConfirm(false);
            return;
        }

        fetch("/api/products/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ updatedProducts })
        })
        .then(response => response.json())
        .then((data) => {
            setOpenConfirm(false);
            setShowSuccess(true);
            setUpdatedProducts([]);
            onClose();
        })
        .catch(error => console.error("Failed to update product status:", error));
    };

    const handleCancel = () => {
        setFilteredProducts(products);
        setUpdatedProducts([]); 
        onClose();
    };

    return {
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
    };
};