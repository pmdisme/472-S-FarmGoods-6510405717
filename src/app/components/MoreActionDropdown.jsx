import React, { useState, useRef, useEffect } from 'react';
import Image from "next/image";
import NewProductDialog from "./creat-product-dialog/NewProductDialog";
import ManageProduct from "@/app/components/ManageProduct";

const CustomDropdown = ({ onProductCreated }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [openManage, setOpenManage] = useState(false);
    const dropdownRef = useRef(null);

    const commonStyles = {
        fontFamily: "'Arial', sans-serif",
        fontWeight: 500,
    };

    const containerStyles = {
        position: 'relative',
        display: 'inline-block',
        ...commonStyles
    };

    const buttonStyles = {
        ...commonStyles,
        fontSize: "1.1rem",
        marginTop: "1.5rem",
        backgroundColor: "#79CDCD",
        height: "3rem",
        width: "10rem",
        border: "none",
        borderRadius: "1rem",
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: "pointer",
        color: "white",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1rem",
        lineHeight: "1",
    };

    const arrowIconStyles = {
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
        transition: 'transform 0.2s ease',
    };

    const dropdownMenuStyles = {
        ...commonStyles,
        position: 'absolute',
        top: "calc(100% + 0.5rem)",
        width: "10rem",
        backgroundColor: "white",
        borderRadius: "1rem",
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        zIndex: 1000
    };

    const optionStyles = {
        ...commonStyles,
        fontSize: "1rem",
        padding: "1rem",
        cursor: "pointer",
        color: "#79CDCD",
        transition: "background-color 0.2s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOptionClick = (value) => {
        if (value === 'new') {
            setOpenCreate(true);
        }
        else if (value === 'hide') {
            setOpenManage(true);
        }
        setIsOpen(false);
    };

    const handleCloseAddProduct = () => {
        setOpenCreate(false);
    };

    const handleCloseManage = () => {
        setOpenManage(false);
    };

    return (
        <div ref={dropdownRef} style={containerStyles}>
            <button onClick={() => setIsOpen(!isOpen)} style={buttonStyles}>
                <span>More Actions</span>
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={arrowIconStyles}
                >
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>

            {isOpen && (
                <div style={dropdownMenuStyles}>
                    <div
                        style={optionStyles}
                        onClick={() => handleOptionClick('new')}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f9f9'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                        <Image
                            src="/images/icons/icon-circle-plus.svg"
                            alt="circle plus icon"
                            width={22}
                            height={22}
                        />
                        <div className="color-transparent">
                            New Product
                        </div>
                    </div>

                    <div
                        style={optionStyles}
                        onClick={() => handleOptionClick('hide')}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f9f9'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                        <Image
                            src="/images/icons/icon-eye-off.svg"
                            alt="circle plus icon"
                            width={22}
                            height={22}
                        />
                        <div className="color-transparent">
                            Hide Product
                        </div>
                    </div>
                </div>
            )}

            {/* New Product Dialog */}
            <NewProductDialog
                open={openCreate}
                handleClose={handleCloseAddProduct}
                onProductCreated={onProductCreated}
            />

            {/* Hide Product (Manage Product) */}
            <ManageProduct
                open={openManage}
                onClose={handleCloseManage}
            />
        </div>
    );
};

export default CustomDropdown;