import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
} from '@mui/material';

const TheatresDisplay = ({ userRole }) => {
  const [theatres, setTheatres] = useState([]);

  // Fetch the theatres data from the API on component mount
  useEffect(() => {
    fetch('http://localhost:8080/api/theatre/all', {
      method: 'GET',
      credentials: 'include', // Ensures cookies are included
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setTheatres(data))
      .catch(error => console.error('Error fetching theatres:', error));
  }, []);

  return (
    <Box
      sx={{
        boxShadow: 'inset 0 0 18px #a805ad, 0 0 15px #a805ad, 0 0 20px #a805ad',
        borderRadius: '40px',
        border: '2px solid #e4b4e6',
        py: 5,
        px: 5,
        backgroundColor: 'rgba(0,0,0,0.3)',
        width: '60vw',
        maxHeight: '85vh',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          display: 'none', // Hide the scrollbar
        },
        scrollbarWidth: 'none', // Firefox scrollbar hiding
      }}
    >
        <Typography variant='neonPink' fontSize={'60px'}>Sucursales</Typography>
      {theatres.length > 0 ? (
        theatres.map((theatre, index) => (
          <Paper 
            key={index}
            sx={{
              padding: 3,
              paddingLeft: 3.5,
              backgroundColor: '#18181c',
              textAlign: 'left',
              mb: '50px',
              border: '2px solid #9df8fc', 
              boxShadow: `
                inset 0 0 15px #0ff0fc,   
                0 0 15px #0ff0fc,         
                0 0 5px #0ff0fc`,
              borderRadius: '40px',
              position: 'relative',
            }}
          >
            <Box display={'flex'} flexDirection={'row'}>
              <Box flex={8} display={'flex'} flexDirection={'column'}>
                <Typography variant="neonCyan" fontSize={'1.5rem'}>
                  {theatre.location}
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))
      ) : (
        <Box display={'flex'} mt={'-1.5vh'} mb={'3.5vh'} justifyContent={'center'}>
          <Typography variant="neonCyan" fontSize={'1.8vh'} align="center">
            Ups... Parece que aún no tenemos sucursales disponibles!
          </Typography>
        </Box>
      )}

      {userRole === 'employee' && (
        <Paper
          sx={{
            padding: 1,
            backgroundColor: '#18181c',
            textAlign: 'center',
            boxShadow: 'inset 0 0 18px #a805ad, 0 0 15px #a805ad, 0 0 20px #a805ad',
            borderRadius: '40px',
            border: '2px solid #e4b4e6',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
            },
            cursor: 'pointer',
          }}
        >
          <Box display="flex" flexDirection="column">
            <Typography variant="neonPink" fontSize="3rem" my="-10px">
              +
            </Typography>
            <Typography variant="neonCyan" mb="10px">
              Agregar sucursal
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default TheatresDisplay;
