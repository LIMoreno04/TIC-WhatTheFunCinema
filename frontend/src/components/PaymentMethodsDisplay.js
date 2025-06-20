import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const PaymentMethodsDisplay = ({ cards: propCards, onUpdate, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardType: '',
    holderName: '',
    expirationDate: '',
    cvv: '',
  });
  const [error, setError] = useState('');
  const [cards, setCards] = useState(propCards || null);
  
  const fetchUserData = () => {
    fetch('http://localhost:8080/api/customer/current', {
        method: 'GET',
        credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
      setCards(data.paymentMethods);
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
    });
};

useEffect(() => {
    if (!propCards) {
      setCards(null);
      fetchUserData();
    } else if (propCards) {
      setCards(propCards);
    }
  }, [propCards]);

  const cardTypeOptions = [
    { label: "Visa crédito", value: "VCredit" },
    { label: "Visa débito", value: "VDebit" },
    { label: "Mastercard crédito", value: "MCredit" },
    { label: "Mastercard débito", value: "MDebit" },
    { label: "AmEx crédito", value: "AMCredit" },
    { label: "AmEx débito", value: "AMDebit" },
  ];

  const handleOpenDialog = () => {
    setOpen(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setNewCard({
      cardNumber: '',
      cardType: '',
      holderName: '',
      expirationDate: '',
      cvv: '',
    });
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'expirationDate') {
      // Only allow numeric input
      const input = value.replace(/\D/g, '');
      let formatted = input;

      if (input.length > 2) {
        // Add "/" after the first two digits
        formatted = `${input.slice(0, 2)}/${input.slice(2, 4)}`;
      }

      // Limit to 5 characters (MM/YY format)
      setNewCard((prevCard) => ({
        ...prevCard,
        expirationDate: formatted.slice(0, 5),
      }));
    } else {
      setNewCard((prevCard) => ({ ...prevCard, [name]: value }));
    }
  };

  const handleCardTypeChange = (event, newValue) => {
    if (newValue) {
      setNewCard((prevCard) => ({ ...prevCard, cardType: newValue.value }));
    }
  };

  const handleAddCard = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/customer/addCard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newCard),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      if (!!onUpdate){onUpdate();};
      handleCloseDialog();
    } catch (error) {
      console.error('Error adding new card:', error);
      setError(error.message);
    }
  };

  const handleOpenDeleteDialog = (card) => {
    setSelectedCard(card);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedCard(null);
  };

  const handleDeleteCard = async () => {
    if (selectedCard) {
      try {
        const response = await fetch('http://localhost:8080/api/customer/removeCard', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(selectedCard),
        });

        if (!response.ok) {
          throw new Error('Failed to delete card');
        }
        if (!!onUpdate){onUpdate();};
        handleCloseDeleteDialog();
      } catch (error) {
        console.error('Error deleting card:', error);
      }
    }
  };

  const maskCardNumber = (cardNumber) => {
    return `**** **** **** ${cardNumber.slice(-4)}`;
  };


  return (
    <Paper
      sx={{
        boxShadow: 'inset 0 0 18px #a805ad, 0 0 15px #a805ad, 0 0 20px #a805ad',
        borderRadius: '40px',
        border: `2px solid #e4b4e6`,
        py: 5,
        px: 5,
        backgroundColor: 'rgba(0,0,0,0.3)',
        maxHeight: 'inherit',
        overflowY: 'auto',
        // Hiding the scrollbar
        '&::-webkit-scrollbar': {
        display: 'none', // Hide the scrollbar
        },
        scrollbarWidth: 'none', // Firefox scrollbar hiding
      }}
    >


      {cards && cards.length > 0 ? (
        cards.map((card, index) => (
          <Paper 
            onClick={()=>(!!onSelect ? onSelect() : null)}
            key={index}
            sx={{
              padding: 3,
              paddingLeft: 3.5,
              backgroundColor: '#18181c',
              textAlign: 'left',
              mb: '50px',
              border: `2px solid #9df8fc`, 
              boxShadow: `
                inset 0 0 15px #0ff0fc,   
                0 0 15px #0ff0fc,         
                0 0 5px #0ff0fc`,
              borderRadius: '40px',
              position: 'relative',
              cursor: !!onSelect ? 'pointer' : 'auto'
            }}
          >
            <Box display={'flex'} flexDirection={'row'}>
              <Box flex={8} display={'flex'} flexDirection={'column'}>
                <Typography variant="neonCyan">{card.cardType}</Typography>
                <Typography variant="neonPink" fontSize={'1.2rem'}>
                  {maskCardNumber(card.cardNumber)}
                </Typography>
                <Typography variant="neonCyan">{card.holderName}</Typography>
                <Typography variant="neonCyan">Exp: {card.expirationDate}</Typography>
              </Box>
              <Box flex={1} display={'flex'} flexDirection={'column'} alignItems={'flex-end'}>
                <IconButton onClick={() => handleOpenDeleteDialog(card)}>
                  <DeleteIcon sx={{ 
                    color: '#a805ad',
                    transition: 'color 0.3s ease',
                      '&:hover': {
                          transform:'scale(1.02)',
                          color: '#00ffff',}
                  }}/>
                </IconButton>
              </Box>
            </Box>
          </Paper>
        ))
      ) : (
        <Box mt={'-1.5vh'} mb={'3.5vh'}>
          <Typography variant="neonCyan" fontSize={'1.8vh'} align="center">
            Aquí aparecerán sus métodos de pago
          </Typography>
        </Box>
      )}


      <Paper
        onClick={handleOpenDialog}
        sx={{
          padding: 1,
          backgroundColor: '#18181c',
          textAlign: 'center',
          boxShadow: 'inset 0 0 18px #a805ad, 0 0 15px #a805ad, 0 0 20px #a805ad',
          borderRadius: '40px',
          border: `2px solid #e4b4e6`,
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
          cursor: 'pointer',
        }}
      >
        <Box display={'flex'} flexDirection={'column'}>
          <Typography variant='neonPink' fontSize={'3rem'} my={'-10px'}>+</Typography>
          <Typography variant="neonCyan" mb={'10px'}>Agregar método de pago</Typography>
        </Box>
      </Paper>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Agregar método de pago</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Número de la tarjeta"
            name="cardNumber"
            fullWidth
            variant="outlined"
            value={newCard.cardNumber}
            onChange={handleInputChange}
          />
          <Autocomplete
            options={cardTypeOptions}
            getOptionLabel={(option) => option.label}
            onChange={handleCardTypeChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tipo de tarjeta (en un mundo ideal se cargaría solo)"
                margin="dense"
                variant="outlined"
                fullWidth
              />
            )}
          />
          <Box display={'flex'} flexDirection={'row'} gap={3}>
            <TextField
              margin="dense"
              label="Vencimiento"
              name="expirationDate"
              fullWidth
              variant="outlined"
              placeholder="MM/YY"
              value={newCard.expirationDate}
              onChange={handleInputChange}
              inputProps={{ maxLength: 5 }}
            />
            <TextField
              margin="dense"
              label="CVV"
              name="cvv"
              fullWidth
              variant="outlined"
              value={newCard.cvv}
              onChange={handleInputChange}
            />
          </Box>
          <TextField
            margin="dense"
            label="Titular (como aparece en la tarjeta)"
            name="holderName"
            fullWidth
            variant="outlined"
            value={newCard.holderName}
            onChange={handleInputChange}
          />
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddCard}>Confirm</Button>
        </DialogActions>
      </Dialog>


      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>¿Seguro que deseas eliminar este método de pago?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>
            Cancel
          </Button>
          <Button onClick={handleDeleteCard} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PaymentMethodsDisplay;
