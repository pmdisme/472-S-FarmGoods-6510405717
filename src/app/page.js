"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import { Container } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Product from "../app/components/Product";
import data from "../../data/data.json"
import Cart from "./components/Cart";
import Search from "./components/Search";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        if (data.success) {
          setProducts(data.data);
        } else {
          setError(data.error || "Failed to fetch products")
        }
      } catch (error) {
        setError("Failed to load products")
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Container sx={{ paddingTop: "3rem" }}>
      <Typography variant="h1" sx={{ color: "#148575", fontSize: "2rem", fontWeight: 600}}>
        FARM GOODS
      </Typography>

      <Search/>

      <Box sx={{display: "flex", justifyContent: "space-between"}}>
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
            {Array.isArray(products) && products.length > 0 ? (
              products.map((item) => (
                <Product 
                  key={item.id} 
                  productId={item.id}
                  image={item.image}  
                  name={item.name} 
                  price={item.price} 
                />
              ))
            ) : (
              <Typography>No products available</Typography>
            )}
          </Box>
        <Cart/>
      </Box>
    </Container>
  );
};

export default Home;