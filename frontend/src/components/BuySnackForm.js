import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  CircularProgress,
  Snackbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";

const SnackPurchase = () => {
  const [snacks, setSnacks] = useState([]);
  const [selectedSnack, setSelectedSnack] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Fetch snacks
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8080/api/snacks/all", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch snacks.");
        }
        return response.json();
      })
      .then((data) => {
        setSnacks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching snacks:", error);
        setLoading(false);
      });
  }, []);

  const addToCart = () => {
    if (!selectedSnack || quantity < 1) {
      setMessage("Selecciona un snack y una cantidad válida.");
      setSnackbarOpen(true);
      return;
    }
    const snackInCart = cart.find((item) => item.snack.snackId === selectedSnack.snackId);
    if (snackInCart) {
      snackInCart.quantity += quantity;
      setCart([...cart]);
    } else {
      setCart([...cart, { snack: selectedSnack, quantity }]);
    }
    setMessage("Snack agregado al carrito.");
    setSnackbarOpen(true);
    setQuantity(1);
    setSelectedSnack(null); // Clear selected snack
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.snack.id !== id));
    setMessage("Snack eliminado del carrito.");
    setSnackbarOpen(true);
  };

  const handlePurchase = () => {
    if (cart.length === 0) {
      setMessage("El carrito está vacío.");
      setSnackbarOpen(true);
      return;
    }

    const purchasePayload = cart.map((item) => ({
      snackId: item.snack.id,
      quantity: item.quantity,
    }));

    setLoading(true);
    fetch("http://localhost:8080/api/customer/purchaseSnacks", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(purchasePayload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to process purchase.");
        }
        setMessage("Compra realizada con éxito.");
        setCart([]);
      })
      .catch((error) => {
        console.error("Error processing purchase:", error);
        setMessage("Error al realizar la compra. Intenta nuevamente.");
      })
      .finally(() => {
        setLoading(false);
        setSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 600, margin: "0 auto" }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Compra de Snacks
        </Typography>
        {loading ? (
          <Box display={'flex'} justifyContent={'center'}>
          <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Autocomplete for Snack selection */}
            <Autocomplete
              options={snacks}
              getOptionLabel={(option) => option.snackName}
              onChange={(event, value) => setSelectedSnack(value)}
              value={selectedSnack}
              renderInput={(params) => (
                <TextField {...params} label="Selecciona un snack" variant="outlined" />
              )}
              sx={{ marginTop: 2 }}
            />

            {/* Quantity Field */}
            <TextField
              type="number"
              label="Cantidad"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              inputProps={{ min: 1 }}
              variant="outlined"
              fullWidth
              sx={{ marginTop: 2 }}
            />

            <Button fullWidth variant="contained" onClick={addToCart} sx={{ marginTop: 2 }}>
              Agregar al carrito
            </Button>

            <Box sx={{ marginTop: 4 }}>
              <Typography variant="h6">Carrito</Typography>
              {cart.length > 0 ? (
                <List>
                  {cart.map((item) => (
                    <ListItem key={item.snack.snackId} sx={{ justifyContent: "space-between" }}>
                      <ListItemText
                        primary={`${item.snack.snackName} x${item.quantity} - $${item.snack.price * item.quantity}`}
                      />
                      <Button onClick={() => removeFromCart(item.snack.id)} color="error">
                        Eliminar
                      </Button>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No hay snacks en el carrito.</Typography>
              )}
            </Box>

            <Button fullWidth variant="contained" onClick={handlePurchase} sx={{ marginTop: 2 }}>
              Finalizar compra
            </Button>
          </>
        )}
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={message}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default SnackPurchase;
