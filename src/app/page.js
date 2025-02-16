"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import {Button, Container, default as DialogActions} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Product from "../app/components/Product";
import Cart from "./components/Cart";
import Search from "./components/Search";
import NewProductButton from "@/app/components/NewProductButton";
import ManageProduct from "@/app/components/ManageProduct";
import React from "react";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/products");
            const data = await response.json();

            if (data.success) {
                const activeProducts = data.data.filter(product => product.isActive); // ✅ Only keep active products
                setProducts(activeProducts);
                setFilteredProducts(activeProducts);
            } else {
                setError(data.error || "Failed to fetch products")
            }
        } catch (error) {
            setError("Failed to load products")
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);          

    const handleAddNewProduct = (newProduct) => {
        const formattedProduct = {
            id: newProduct.productId,
            name: newProduct.productName,
            price: newProduct.productPrice,
            image: newProduct.productImage
        };

        setProducts(prevProducts => {
            const updatedProducts = [...prevProducts, formattedProduct];
            return updatedProducts.sort((a, b) => {
                return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
            });
        });

        setFilteredProducts(prevProducts => {
            const updatedProducts = [...prevProducts, formattedProduct];
            return updatedProducts.sort((a, b) => {
                return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
            });
        });
    };

    const handleSearch = () => {
        const trimmedSearchTerm = searchTerm.trim().toLowerCase();
        if (trimmedSearchTerm === "") {
            setFilteredProducts(products);
            return;
        }

        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(trimmedSearchTerm)
        );

        setFilteredProducts(filtered);
    };

    const handleUpdateProductList = (updatedProducts) => {
        const activeProducts = updatedProducts.filter(product => product.isActive);
        setProducts(activeProducts);
        setFilteredProducts(activeProducts);
    };

    return (
        <Container>
            <Box sx={{
                position: "fixed",
                top: "0",
                left: "0",
                alignItems: "center",
                gap: "2rem",
                width: "100%",
                padding: "1rem",
                display: "flex",
                backgroundColor: "#F8F8FF",
                zIndex: 100
            }}>
                <Image
                    src="/images/icons/logo.png"
                    alt="logo"
                    height={140}
                    width={260}
                    style={{marginLeft: "1rem"}}
                />
                <Search
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    handleSearch={handleSearch}
                />
                <NewProductButton onProductCreated={handleAddNewProduct} />
                <ManageProduct onProductCreated={handleUpdateProductList} />
            </Box>

            <Box sx={{display: "flex", justifyContent: "space-between"}}>
                <Box data-testid="product-section"
                     sx={{
                         marginTop: "200px",
                         marginRight: "200px",
                         marginLeft: "-8rem",
                         display: "flex",
                         flexWrap: "wrap",
                         gap: "20px",
                     }}>
                    {Array.isArray(products) && products.length > 0 ? (
                        filteredProducts.map((item) => (
                            <Product
                                key={item.id}
                                id={item.id}
                                image={item.image}
                                name={item.name}
                                price={item.price}
                            />
                        ))
                    ) : (
                        <Typography>No products found</Typography>
                    )}
                </Box>
                <Cart />
            </Box>
        </Container>
    );
};

export default Home;