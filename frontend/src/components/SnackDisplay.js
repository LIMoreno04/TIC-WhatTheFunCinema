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


const SnackDisplay = (id) => {
  const [snack, setSnack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState({});

  const fetchSnack = () => {
    setLoading(true);
    fetch(`http://localhost:8080/api/snacks/preview/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setSnack(data);
        setLoading(false);
        console.log(snack);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
      fetchSnack();
  }, []);


  const handleBuy = async () => {
      if (!quantity || quantity < 1) return;
  
      try {
        const response = await fetch("http://localhost:8080/api/customer/buySnack", {
          method: "POST", credentials:'include',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, quantity }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to buy snack");
        }
  
        alert("Purchase successful!");
      } catch (error) {
        console.error("Error buying snack:", error);
      }
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
              textAlign: "center",
              border: "2px solid #9df8fc",
              borderRadius: "20px",
              width: "250px",
              boxShadow: "0 0 10px #0ff0fc",
              height: "400px", // Adjust as needed
            }}
          >
            {loading && (
                    <Overlay>
                      <CircularProgress color="primary" />
                    </Overlay>
                  )}

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
                  objectFit: "cover", // Ensures the image covers the space
                  borderRadius: "10px 10px 0 0", // Rounded top corners
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
              <Box mt={2} display="flex" flexDirection={'row'} justifyContent="center" gap={1}>
                <TextField
                  type="number"
                  label='Cantidad'
                  variant="outlined"
                  value={quantity[snack.id] || ""}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  sx={{
                     width:'40%',
                    input: { color: "#fff" },
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#0ff0fc" },
                  }}
                />
                <Button
                  variant="contained"
                  
                  color="primary"
                  onClick={() => handleBuy(snack.id)}
                  disabled={!quantity[snack.id] || quantity[snack.id] < 1}
                  sx={{
                    width:'60%',
                    "&:disabled": {
                      backgroundColor: "#555",
                      color: "#aaa",
                    },
                  }}
                >
                  Comprar
                </Button>
              </Box>
            </Box>
    </Paper>
  );
};

export default SnackDisplay;
