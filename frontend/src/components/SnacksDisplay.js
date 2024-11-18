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

const SnackDisplay = () => {
  const [snacks, setSnacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState({}); // To track quantities for each snack

  const fetchSnacks = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/snacks/preview/all", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setSnacks(data);
    } catch (error) {
      console.error("Error fetching snacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (snackId) => {
    const quantity = quantities[snackId];
    if (!quantity || quantity < 1) return;

    try {
      const response = await fetch("http://localhost:8080/api/customer/buySnack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ snackId, quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to buy snack");
      }

      alert("Purchase successful!");
    } catch (error) {
      console.error("Error buying snack:", error);
    }
  };

  const handleQuantityChange = (snackId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [snackId]: Math.max(0, Number(value)),
    }));
  };

  useEffect(() => {
    fetchSnacks();
  }, []);

  return (
    <Box position="relative">
      {loading && (
        <Overlay>
          <CircularProgress color="primary" />
        </Overlay>
      )}

      <Box
        sx={{
            display:'flex', flexDirection:'column',
          boxShadow: "inset 0 0 18px #a805ad, 0 0 15px #a805ad, 0 0 20px #a805ad",
          borderRadius: "20px",
          border: "2px solid #e4b4e6",
          p: 5,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          width: "88vw",
          minHeight: "65vh",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
        }}
      >
        <Typography variant="neonPink" fontSize="60px" mb={4} gutterBottom>
          Snacks
        </Typography>

        <Box display="flex" flexWrap="wrap" gap={4}>
          {snacks.map((snack) => (
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
                  value={quantities[snack.id] || ""}
                  onChange={(e) => handleQuantityChange(snack.id, e.target.value)}
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
                  disabled={!quantities[snack.id] || quantities[snack.id] < 1}
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
          
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SnackDisplay;
