import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Paper, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';

const ErrorMessage = styled(Typography)({
  color: 'pink',
  fontWeight: 'bold',
  textShadow: '0 0 5px cyan',
  marginBottom: '10px',
});

const Overlay = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
});

const NewTheatreForm = () => {
  const [location, setLocation] = useState('');
  const [numberOfRooms, setNumberOfRooms] = useState(8);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!location) {
      setError('Ingrese una ubicación válida.');
      setLoading(false);
      return;
    }
    if (!(/^[0-9]+$/.test(numberOfRooms))) {
      setError('Ingrese un número válido.');
      setLoading(false);
      return;
    }

    try {
      const url = numberOfRooms === 0 
        ? 'http://localhost:8080/api/theatre/add' 
        : 'http://localhost:8080/api/theatre/addWithRooms';

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ location, numberOfRooms }),
      });

      if (response.status === 400) {
        try {
          const errorData = await response.json();
          setError(errorData.message);
        } catch (parseError) {
          console.error("Error parsing JSON response:", parseError);
          setError("Error procesando la respuesta del servidor.");
        }
      } else if (response.ok) {
        alert("Sucursal agregada a la base de datos!");
      } else {
        setError(`Error inesperado: ${response.status}`);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError('Error conectándose con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box position="relative">
      {loading && (
        <Overlay>
          <CircularProgress color="primary" />
        </Overlay>
      )}
      <Paper sx={{ padding: '50px', paddingTop: '30px', display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, margin: 'auto', opacity: loading ? 0.5 : 1 }}>
        <Typography variant='neonPink' fontSize={'40px'}>Agregar sucursal</Typography>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <TextField
          label="Ubicación"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          disabled={loading}
        />
        <TextField
          label="Cantidad de salas"
          type="number"
          value={numberOfRooms}
          onChange={(e) => setNumberOfRooms(e.target.value)}
          InputProps={{ inputProps: { min: 0 } }}
          disabled={loading}
        />
        <Button variant='contained' onClick={handleSubmit} disabled={loading}>Enviar</Button>
      </Paper>
    </Box>
  );
};

export default NewTheatreForm;
