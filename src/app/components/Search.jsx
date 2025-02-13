import React from 'react'
import Image from 'next/image';
import { Box, TextField } from '@mui/material';

const Search = ({ searchTerm, setSearchTerm, handleSearch}) => {
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch(); // trigger search when enter
    }
  };

  return (
    <Box
      sx={{
        marginTop: "3rem",
        display: "flex",
        width: "100%"
      }}
    >
      <TextField 
        fullWidth
        variant="outlined"
        placeholder=" Search for products... "
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyPress}
        sx={{
          height: "3rem",
          width: "30%",
          border: 'none',
          color: "text.secondary",
          padding: "0 1rem",
          backgroundColor: "#ffffff",
          borderRadius: "1rem",
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          "& .MuiOutlinedInput-root": {
            "& fieldset": { border: "none" }, 
            "&:hover fieldset": { border: "none" },
            "&.Mui-focused fieldset": { border: "none" },
          },
          '&:focus-within': {
            outline: 'none',
            boxShadow: '0 0 0 2px rgba(0,0,0,0.1)'
          }
        }}>
      </TextField>

      <Box 
      sx={{ 
        backgroundColor: "#98ddc3",
        height: "3rem",
        width: "3rem", 
        border: "1px", 
        borderRadius: "1rem",
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginLeft: "0.5rem",
        cursor: "pointer"
        }}
        onClick={handleSearch}
        >
        <Image
          src="/images/icons/icon-search.svg"
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
