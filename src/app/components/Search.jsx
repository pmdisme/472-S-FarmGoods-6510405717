import React from 'react'
import Image from 'next/image';
import { Box, Typography } from '@mui/material';

const Search = () => {
  return (
    <Box
      sx={{
        marginTop: "3rem",
        display: "flex",
      }}
    >
      <Typography component="input" placeholder=" Search somethings... "
        sx={{
          width: "40%",
          height: "3rem",
          border: 'none',
          color: "text.secondary",
          padding: "0 1rem",
          backgroundColor: "#ffffff",
          border: "1px",
          borderRadius: "1rem",
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: 'none',
          '&:focus': {
            outline: 'none',
            boxShadow: '0 0 0 2px rgba(0,0,0,0.1)'
          }
        }}>
      </Typography>

      <Box 
      sx={{ 
        backgroundColor: "#98ddc3",
        height: "3rem",
        width: "3rem", 
        border: "1px", 
        borderRadius: "1rem",
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginLeft: "0.5rem"
        }}>
        <Image
          src="/images/icon-search.svg"
          alt="Search"
          width={20}
          height={20}
          style={{ margin: "15px"}}
        />
      </Box>

    </Box>
  );
};

export default Search;
