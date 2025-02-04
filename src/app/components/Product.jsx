"use client"

import { Box } from '@mui/system';
import React from 'react'
import AddToCartButton from './AddToCartButton';
import { Typography } from '@mui/material';
import Image from 'next/image'
import { useAppSelector } from '../../utile/hooks';


const Product = ({ id, image, name, price }) => {

    /* set button false ที่ยังไม่ได้กดแอดสินค้าลงตระกร้า 
    ถ้าเปลี่ยนเป็น true button จะเป็นอีกแบบ*/
    const { cart } = useAppSelector((state) => state.cart)
    const isItemInCart = !!cart.find((item) => item.id === id);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", marginTop: "4rem" }}>
            <Image
                src={image}
                alt="product-image"
                height={200}
                width={200}
                style={{ borderRadius: "0.5rem"}}
            />

            <AddToCartButton
                isItemInCart={isItemInCart}
                id={id}
                name={name}
                price={price}
            />

            <Typography sx={{
                color: "#283747", fontWeight: 600,
                alignSelf: "center", marginTop: "0.5rem"
            }}>
                {name}
            </Typography>
            <Typography sx={{ color: "#e74c3c", fontWeight: 600, alignSelf: "center" }}>
                ฿{price.toFixed(2)}
            </Typography>


        </Box>
    );
};
export default Product;


