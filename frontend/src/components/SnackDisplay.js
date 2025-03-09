import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";

const Overlay = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
});

const SnackDisplay = ({ id, onAddToCart }) => {
  const [snack, setSnack] = useState({});
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const fetchSnack = () => {
    setLoading(true);
    fetch(`http://localhost:8080/api/snacks/preview/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setSnack(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSnack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddToCart = () => {
    if (!quantity || quantity < 1) return;
    // Call parent's function with the snack info and desired quantity.
    // We pass along id, name and price so that the parent can build the cart.
    onAddToCart({ id: snack.id, name: snack.name, price: snack.price }, quantity);
    setQuantity(0);
  };

  const handleQuantityChange = (value) => {
    setQuantity(Math.max(0, Number(value)));
  };

  return (
    <Paper
      key={snack.id}
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: 3,
        backgroundColor: "#18181c",
        border: "2px solid #9df8fc",
        borderRadius: "20px",
        width: "250px",
        boxShadow: "0 0 10px #0ff0fc",
        height: "400px",
        justifyContent: "center",
        alignItems: "center",
        textAlign:'center'
      }}
    >
      {loading ? (
        <Box>
          <CircularProgress sx={{ color: "#a805ad" }} />
          <Typography
            sx={{ color: "#9df8fc", marginTop: "15px", fontSize: "1rem" }}
          >
            Cargando snack...
          </Typography>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              flexGrow: 1,
              overflow: "hidden",
            }}
          >
            <img
              src={snack.image}
              alt={snack.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "10px 10px 0 0",
              }}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ color: "#fff", mb: 1 }}>
              {snack.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "#aaa", mb: 1 }}>
              {snack.description}
            </Typography>
            <Typography variant="body1" sx={{ color: "#fff" }}>
              $
              {typeof snack.price === "number"
                ? snack.price.toFixed(2)
                : parseFloat(snack.price).toFixed(2)}
            </Typography>
            <Box
              mt={2}
              display="flex"
              flexDirection="row"
              justifyContent="center"
              gap={1}
            >
              <TextField
                type="number"
                label="Cantidad"
                variant="outlined"
                value={quantity || ""}
                onChange={(e) => handleQuantityChange(e.target.value)}
                sx={{
                  width: "50%",
                  input: { color: "#fff" },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0ff0fc",
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddToCart}
                disabled={!quantity || quantity < 1}
                sx={{
                  width: "50%",
                  "&:disabled": {
                    backgroundColor: "#555",
                    color: "#aaa",
                  },
                }}
              >
                Agregar
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default SnackDisplay;
