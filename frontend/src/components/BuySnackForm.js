import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Paper,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Snackbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const SnackPurchase = () => {
  const [snacks, setSnacks] = useState([]);
  const [selectedSnack, setSelectedSnack] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/api/snacks/all") // Obtener todos los snacks
      .then((response) => {
        setSnacks(response.data);
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
    const snackInCart = cart.find((item) => item.snack.id === selectedSnack.id);
    if (snackInCart) {
      snackInCart.quantity += quantity;
      setCart([...cart]);
    } else {
      setCart([...cart, { snack: selectedSnack, quantity }]);
    }
    setMessage("Snack agregado al carrito.");
    setSnackbarOpen(true);
    setQuantity(1);
    setSelectedSnack(""); // Limpiar snack seleccionado
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
    axios
      .post("http://localhost:3000/api/customer/purchaseSnacks", cart, {
        withCredentials: true,
      })
      .then(() => {
        setMessage("Compra realizada con éxito.");
        setSnackbarOpen(true);
        setCart([]);
      })
      .catch((error) => {
        console.error("Error processing purchase:", error);
        setMessage("Error al realizar la compra. Intenta nuevamente.");
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
          <CircularProgress />
        ) : (
          <>
            {/* Campo de selección de Snack */}
            <FormControl fullWidth variant="outlined" sx={{ marginTop: 2 }}>
              <InputLabel id="snack-select-label">Selecciona un snack</InputLabel>
              <Select
                labelId="snack-select-label"
                value={selectedSnack}
                onChange={(e) => {
                  const snack = snacks.find((s) => s.id === e.target.value);
                  setSelectedSnack(snack); // Actualiza el snack seleccionado
                }}
                label="Selecciona un snack"
              >
                <MenuItem value="" disabled>
                  Selecciona un snack
                </MenuItem>
                {snacks.map((snack) => (
                  <MenuItem key={snack.id} value={snack.id}>
                    {snack.name} {/* Solo mostramos el nombre del snack */}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Campo de cantidad */}
            <TextField
              type="number"
              label="Cantidad"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              inputProps={{ min: 1 }}
              variant="outlined"
              fullWidth
              sx={{ marginTop: 2 }}
            />

            <Button variant="contained" onClick={addToCart} sx={{ marginTop: 2 }}>
              Agregar al carrito
            </Button>

            <Box sx={{ marginTop: 4 }}>
              <Typography variant="h6">Carrito</Typography>
              {cart.length > 0 ? (
                <List>
                  {cart.map((item) => (
                    <ListItem key={item.snack.id} sx={{ justifyContent: "space-between" }}>
                      <ListItemText
                        primary={`${item.snack.name} x${item.quantity} - $${item.snack.price * item.quantity}`}
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

            <Button variant="contained" onClick={handlePurchase} sx={{ marginTop: 2 }}>
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
