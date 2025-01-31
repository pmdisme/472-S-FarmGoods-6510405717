import Image from "next/image";
import { Container } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Product from "../app/components/Product";
import data from "../../data/data.json"
import Cart from "./components/Cart";

const Home = () => {
  return (
    <Container sx={{ paddingTop: "3rem" }}>
      <Typography variant="h1" sx={{ color: "#BC8F8F", fontSize: "2rem", fontWeight: 600}}>
        FARM GOODS
      </Typography>

      <Typography variant="h1" sx={{ color: "#BC8F8F", fontSize: "2rem", marginTop: "2rem" }}>
        Search Bar
      </Typography>

      <Box sx={{display: "flex", justifyContent: "space-between"}}>
        <Box sx={{display: "flex", flexWrap: "wrap", justifyContent: "space-between"}}>
          {data.map((item) => {
            return <Product key={item.id} {...item} />;
          })}
        </Box>
        <Cart/>
      </Box>
    </Container>
  );
};

export default Home;