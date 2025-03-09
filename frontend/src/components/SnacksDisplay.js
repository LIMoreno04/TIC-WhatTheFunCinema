import React, { useEffect, useState } from "react";
import SnackDisplay from "./SnackDisplay";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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

const SnacksDisplay = () => {
  const [snackIds, setSnackIds] = useState([]);
  const [loading, setLoading] = useState(false);
  // The cart is an object where keys are snack names and values are objects:
  // { quantity, price, id }
  const [cart, setCart] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  const fetchSnackIds = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/snacks/AllIds", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setSnackIds(data);
    } catch (error) {
      console.error("Error fetching snack ids:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnackIds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // This function will be passed down to each SnackDisplay.
  // It updates the cart: if the quantity is 0, the snack is removed.
  const handleAddToCart = (snack, quantity) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (quantity === 0) {
        delete newCart[snack.name];
      } else {
        newCart[snack.name] = { quantity, price: snack.price, id: snack.id };
      }
      return newCart;
    });
  };

  // Check if the cart has at least one item with quantity > 0.
  const isCartNotEmpty = Object.values(cart).some(
    (item) => item.quantity && item.quantity > 0
  );

  // Calculate total price.
  const total = Object.values(cart).reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  // Function to handle the purchase confirmation in the dialog.
  const handleConfirmPurchase = async () => {
    const purchaseRequests = Object.values(cart).map((item) =>
      fetch("http://localhost:8080/api/customer/buySnack", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ snackId: item.id, quantity: item.quantity }),
      })
    );
    try {
      await Promise.all(purchaseRequests);
      alert("¡Compra exitosa!");
      setCart({});
      setOpenDialog(false);
    } catch (error) {
      console.error("Error purchasing:", error);
    }
  };

  return (
    <Box position="relative" sx={{ padding: 2 }}>
      {loading && (
        <Overlay>
          <CircularProgress color="primary" />
        </Overlay>
      )}

      <Box
        sx={{
          boxShadow: "inset 0 0 18px #a805ad, 0 0 15px #a805ad, 0 0 20px #a805ad",
          borderRadius: "20px",
          border: "2px solid #e4b4e6",
          p: 5,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          width: "88vw",
          height: "65vh",
          overflowY: "auto",
          position: "relative",
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
        }}
      >

        <Box display="flex" flexWrap="wrap" gap={4}>
          {snackIds.map((snackId) => (
            <SnackDisplay
              key={snackId}
              id={snackId}
              onAddToCart={handleAddToCart}
            />
          ))}
        </Box>

        <Box
          sx={{
            position: "sticky",
            bottom: 16,
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <Button
          style={{fontSize:'30px', paddingX:'15px',paddingTop:'5px',paddingBottom:'10px', marginBottom:'-30px'}}
            variant="contained"
            color="secondary"
            disabled={!isCartNotEmpty}
            onClick={() => setOpenDialog(true)}
          >
            Comprar
          </Button>
        </Box>
      </Box>

      {/* Dialog showing the cart details */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              height:'100%',
              maxHeight:'60vh',
              width: "100%",
              maxWidth: "30vw",
            },
          },
        }}
      >
        <DialogTitle>Resumen de compra</DialogTitle>
        <DialogContent
          dividers
          sx={{
            maxHeight: "50vh",
            overflowY: "auto",
          }}
        >
          {Object.entries(cart).length === 0 ? (
            <Typography>No hay items en el carrito.</Typography>
          ) : (
            Object.entries(cart).map(([snackName, { quantity, price }]) => (
              <Box
                key={snackName}
                display="flex"
                justifyContent="space-between"
                my={1}
              >
                <Typography>{snackName}</Typography>
                <Typography>
                  {quantity} x ${Number(price).toFixed(2)}
                </Typography>
              </Box>
            ))
          )}
          <Box
            display="flex"
            justifyContent="space-between"
            mt={2}
            borderTop="1px solid #ccc"
            pt={1}
          >
            <Typography fontWeight="bold">Total:</Typography>
            <Typography fontWeight="bold">${total.toFixed(2)}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleConfirmPurchase}
            variant="contained"
            color="primary"
            disabled={!isCartNotEmpty}
          >
            Comprar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SnacksDisplay;
