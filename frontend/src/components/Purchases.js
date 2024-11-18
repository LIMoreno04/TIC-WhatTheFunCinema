import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Grid,
  Stack,
} from '@mui/material';
import { format } from 'date-fns';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/customer/shoppingHistory', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Error fetching purchase history');
        const data = await response.json();
        setPurchases(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPurchases();
  }, []);

  const handleCancelClick = (purchase) => {
    setSelectedPurchase(purchase);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedPurchase) return;
    const { theatre, roomNumber, date_and_time, row, col } = selectedPurchase;
    try {
      const response = await fetch(
        `http://localhost:8080/api/customer/cancelReservation/${theatre}/${roomNumber}/${date_and_time}/${row}/${col}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );
      if (response.ok) {
        setFeedback('¡Reserva cancelada con éxito!');
        setPurchases((prev) =>
          prev.filter(
            (purchase) =>
              !(
                purchase.theatre === theatre &&
                purchase.roomNumber === roomNumber &&
                purchase.date_and_time === date_and_time &&
                purchase.row === row &&
                purchase.col === col
              )
          )
        );
      } else {
        setFeedback('No se pudo cancelar la reserva.');
      }
    } catch (error) {
      console.error(error);
      setFeedback('Error al cancelar la reserva.');
    } finally {
      setCancelDialogOpen(false);
      setSelectedPurchase(null);
    }

    // Clear feedback after a few seconds
    setTimeout(() => {
      setFeedback('');
    }, 3000);
  };

  const isCancelable = (date_and_time) => {
    const purchaseDate = new Date(date_and_time);
    const now = new Date();
    return purchaseDate > new Date(now.getTime() + 2 * 60 * 60 * 1000);
  };

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          gap: 2,
          flexDirection: 'column',
          py: 5,
          px: 5,
          backgroundColor: 'rgba(0,0,0,0.3)',
          borderRadius: '40px',
          boxShadow: 'inset 0 0 18px #a805ad, 0 0 15px #a805ad, 0 0 20px #a805ad',
          width: '80vw',
          height: '70vh',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
        }}
      >
        <Typography variant="neonPink" fontSize="60px" mb={3}>
          Historial de Compras
        </Typography>
        {purchases.length > 0 ? (
          purchases.map((purchase, index) => (
            <Paper
              key={index}
              sx={{
                mb: 3,
                p: 3.5,
                backgroundColor: '#18181c',
                borderRadius: '20px',
                border: '2px solid #9df8fc',
                boxShadow: 'inset 0 0 15px #0ff0fc, 0 0 15px #0ff0fc',
              }}
            >
              <Grid container spacing={2} alignItems="center">
                {/* Left Column */}
                <Grid item xs={6}>
                  <Stack spacing={1}>
                    <Typography variant="neonCyan" sx={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
                      Película: {purchase.movieTitle}
                    </Typography>
                    <Typography variant="neonCyan">Cine: {purchase.theatre}</Typography>
                    <Typography variant="neonCyan">Sala: {purchase.roomNumber}</Typography>
                    <Typography variant="neonCyan">
                      Fecha: {format(new Date(purchase.date_and_time), 'dd/MM/yyyy')}
                    </Typography>
                  </Stack>
                </Grid>

                {/* Right Column */}
                <Grid item xs={5}>
                  <Stack spacing={1}>
                    <Typography variant="neonCyan">
                      Hora: {format(new Date(purchase.date_and_time), 'HH:mm')}
                    </Typography>
                    <Typography variant="neonCyan">Fila: {purchase.row}</Typography>
                    <Typography variant="neonCyan">Asiento: {purchase.col}</Typography>
                  </Stack>
                </Grid>

                {/* Cancel Button */}
                {isCancelable(purchase.date_and_time) && (
                  <Grid item xs={1} display="flex" justifyContent="flex-end">
                    <Button
                      onClick={() => handleCancelClick(purchase)}
                      sx={{
                        backgroundColor: '#a805ad',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: '#00ffff',
                        },
                      }}
                    >
                      Cancelar Reserva
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Paper>
          ))
        ) : (
          <Typography variant="neonCyan" fontSize="2rem" align="center">
            No tienes compras registradas.
          </Typography>
        )}

        <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
          <DialogTitle>¿Estás seguro que deseas cancelar esta reserva?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setCancelDialogOpen(false)}>No</Button>
            <Button onClick={handleConfirmCancel} color="error">
              Sí
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {feedback && (
        <Box
          sx={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: '#9df8fc',
            px: 3,
            py: 1.5,
            borderRadius: '10px',
            boxShadow: '0 0 15px #a805ad, 0 0 20px #a805ad',
          }}
        >
          <Typography variant="neonCyan">{feedback}</Typography>
        </Box>
      )}
    </>
  );
};

export default Purchases;
