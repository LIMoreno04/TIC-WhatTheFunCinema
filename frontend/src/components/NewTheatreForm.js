import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
{/*
const NeonTextField = styled(TextField)({
  '& label.Mui-focused': { color: 'cyan' },
  '& .MuiInput-underline:after': { borderBottomColor: 'cyan' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'pink' },
    '&:hover fieldset': { borderColor: 'cyan' },
    '&.Mui-focused fieldset': { borderColor: 'cyan' },
  },
  input: { color: 'turquoise', fontWeight: 'bold' },
});

const NeonButton = styled(Button)({
  background: 'linear-gradient(45deg, cyan, pink)',
  color: 'white',
  fontWeight: 'bold',
  boxShadow: '0 0 5px cyan, 0 0 10px pink',
  '&:hover': {
    background: 'linear-gradient(45deg, pink, cyan)',
    boxShadow: '0 0 10px pink, 0 0 15px cyan',
  },
});
*/}
const ErrorMessage = styled(Typography)({
  color: 'pink',
  fontWeight: 'bold',
  textShadow: '0 0 5px cyan',
  marginBottom: '10px',
});

const NewTheatreForm = () => {
  const [location, setLocation] = useState('');
  const [numberOfRooms, setNumberOfRooms] = useState(8);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!location) {
      setError('Location is required.');
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
        body: JSON.stringify( {location: location, numberOfRooms: numberOfRooms} ),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'An error occurred');
      } else {
        alert("Sucursal agregada exitosamente a la base de datos!")
      }
    } catch (err) {
      setError('Failed to connect to server.');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, margin: 'auto' }}>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <TextField
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />
      <TextField
        label="Number of Rooms"
        type="number"
        value={numberOfRooms}
        onChange={(e) => setNumberOfRooms(e.target.value)}
        InputProps={{ inputProps: { min: 0 } }}
      />
      <Button variant='contained' onClick={handleSubmit}>Submit</Button>
    </Box>
  );
};

export default NewTheatreForm;
