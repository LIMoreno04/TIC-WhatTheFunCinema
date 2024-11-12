import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/system';
import NewTheatreForm from './NewTheatreForm'; // Import the NewTheatreForm component
import Cancel from '@mui/icons-material/Cancel'; // Import close icon
import { Close } from '@mui/icons-material';

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

const TheatresDisplay = ({ userRole }) => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); // State to control form visibility


  const fetchTheatres = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/theatre/allLocations', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTheatres(data);
    } catch (error) {
      console.error('Error fetching theatres:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchTheatres();
  }, []);

  return (
    <Box position="relative">
      {loading && (
        <Overlay>
          <CircularProgress color="primary" />
        </Overlay>
      )}

      {showForm && (
        <Overlay>
        <Box 
          flexDirection={'column-reverse'} 
          display={'inline-flex'} 
          position="relative"  // Ensure the Box is positioned relatively
        >
          <NewTheatreForm onAdd={fetchTheatres}/>
          <IconButton
            onClick={() => setShowForm(false)}
            sx={{
              color: '#ff4081',
              position: 'absolute',   // Position the button absolutely within the Box
              top: 20,                 // Place at the top
              right: 20,               // Place at the right
              zIndex: 1,              // Ensure it overlays the NewTheatreForm
            }}
          >
            <Close fontSize="large" />
          </IconButton>
        </Box>
      </Overlay>
      
      )}

      <Box
        sx={{
          boxShadow: 'inset 0 0 18px #a805ad, 0 0 15px #a805ad, 0 0 20px #a805ad',
          borderRadius: '40px',
          border: '2px solid #e4b4e6',
          py: 5,
          px: 5,
          backgroundColor: 'rgba(0,0,0,0.3)',
          width: '60vw',
          minHeight: '65vh',
          maxHeight: '75vh',
          overflowY: 'auto',
          opacity: loading ? 0.5 : 1,
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
        }}
      >
        <Box mb={7}>
          <Typography variant='neonPink' fontSize={'60px'}>Sucursales</Typography>
        </Box>
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
                borderRadius: '20px',
                position: 'relative',
              }}
            >
              <Box display={'flex'} flexDirection={'row'}>
                <Box flex={8} display={'flex'} flexDirection={'column'}>
                  <Typography variant="neonCyan" fontSize={'1.5rem'}>
                    {theatre}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))
        ) : (
          !loading && (
            <Box display={'flex'} mt={'-1.5vh'} mb={'3.5vh'} justifyContent={'center'}>
              <Typography variant="neonCyan" fontSize={'1.8vh'} align="center">
                Ups... Parece que aún no tenemos sucursales disponibles!
              </Typography>
            </Box>
          )
        )}

        {userRole === 'employee' && (
          <Paper
            onClick={() => setShowForm(true)} // Show form when clicked
            sx={{
              padding: 1,
              backgroundColor: '#18181c',
              textAlign: 'center',
              boxShadow: 'inset 0 0 18px #a805ad, 0 0 15px #a805ad, 0 0 20px #a805ad',
              borderRadius: '30px',
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
    </Box>
  );
};

export default TheatresDisplay;
