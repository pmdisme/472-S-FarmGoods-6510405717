"use client"
import { useState } from "react";
import { CirclePlus } from "lucide-react";
import NewProductDialog from "@/app/components/creat-product-dialog/NewProductDialog";

const NewProductButton = ({ onProductCreated }) => {
    const [openCreate, setOpenCreate] = useState(false);
    const [isHover, setIsHover] = useState(false);

    const handleClickAddProduct = () => {
        setOpenCreate(true);
    };

    const handleCloseAddProduct = () => {
        setOpenCreate(false);
    };

    return (
        <>
            <button
                style={{
                    marginTop: "1.5rem",
                    backgroundColor: "#79CDCD",
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
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                onClick={handleClickAddProduct}
            >
                <CirclePlus size={24} />
                <span style={{ display: 'inline-block', marginTop: "1px" }}>New Product</span>
            </button>

            <NewProductDialog
                open={openCreate}
                handleClose={handleCloseAddProduct}
                onProductCreated={onProductCreated}
            />
        </>
    );
};

export default NewProductButton;