import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
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
  };

  const isCancelable = (date_and_time) => {
    const purchaseDate = new Date(date_and_time);
    const now = new Date();
    return purchaseDate > new Date(now.getTime() + 2 * 60 * 60 * 1000);
  };

  return (
    <Box
      sx={{
        display:'flex',
        flexDirection:'column',
        py: 5,
        px: 5,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: '40px',
        boxShadow: 'inset 0 0 18px #a805ad, 0 0 15px #a805ad, 0 0 20px #a805ad',
        width:'80vw',
        height: '80vh',
        overflowY: 'auto',
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
              p: 3,
              backgroundColor: '#18181c',
              borderRadius: '20px',
              border: '2px solid #9df8fc',
              boxShadow: 'inset 0 0 15px #0ff0fc, 0 0 15px #0ff0fc',
            }}
          >
            <Typography variant="neonCyan">Película: {purchase.title}</Typography>
            <Typography variant="neonCyan">
              Cine: {purchase.theatre}, Sala: {purchase.roomNumber}
            </Typography>
            <Typography variant="neonCyan">
              Fila: {purchase.row}, Columna: {purchase.col}
            </Typography>
            <Typography variant="neonCyan">
              Fecha y Hora: {format(new Date(purchase.date_and_time), 'dd/MM/yyyy HH:mm')}
            </Typography>
            {isCancelable(purchase.date_and_time) && (
              <Button
                onClick={() => handleCancelClick(purchase)}
                sx={{
                  mt: 2,
                  backgroundColor: '#a805ad',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#00ffff',
                  },
                }}
              >
                Cancelar Reserva
              </Button>
            )}
          </Paper>
        ))
      ) : (
        <Typography variant="neonCyan" fontSize='2rem' align="center">
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

      {feedback && (
        <Typography variant="neonCyan" align="center" mt={2}>
          {feedback}
        </Typography>
      )}
    </Box>
  );
};

export default Purchases;
