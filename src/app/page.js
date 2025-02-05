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
    <Container>

      {/* header section */}

      <Box
        sx={{
          position: "fixed",
          top: "0",
          left: "0",
          gap: "100px",
          width: "100%",
          padding: "1rem",
          display: "flex",
          backgroundColor: "#F8F8FF",
          zIndex: 100
        }}>
        <Image
          src="/images/logo.png"
          alt="logo"
          height={140}
          width={260}
          style={{ marginLeft: "1rem" }} />

        <Search />

      </Box>

      {/* scrollable product section */}
      
      <Box sx={{ display: "flex", justifyContent: "space-between"}}>
        <Box 
        sx={{ 
          marginTop: "200px", 
          marginRight: "200px", 
          marginLeft: "-8rem",
          display: "flex", 
          flexWrap: "wrap",
          gap: "20px",
          }}>
            {Array.isArray(products) && products.length > 0 ? (
              products.map((item) => (
                <Product
                  key={item.id}
                  id={item.id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                />
          ))
          ) : (
          <Typography>No products available</Typography>
          )}

        </Box>
        <Cart />
      </Box>
    </Container>
  );
};

export default Home;