import { Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Error404() {
  const navigate = useNavigate();

  return (
    <Paper
      sx={{
        width: '70vw',
        maxWidth: '500px',
        margin: '20px auto',
        padding: 4,
        backgroundColor: '#191331', // Dark background color
        textAlign: 'center',
        boxShadow: '0 0 15px #a805ad, 0 0 25px #0ff0fc', // Neon glow around Paper
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontFamily: 'monospace',
          fontSize: '3rem',
          color: '#f7bedf', // Neon pink text color
          textShadow: '0 0 5px #ff0090, 0 0 10px #ff0090, 0 0 15px #ff0090',
        }}
      >
        Error 404
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontFamily: 'monospace',
          color: '#ffffff', // Neon cyan color for subtext
          textShadow: '0 0 5px #0ff0fc, 0 0 10px #0ff0fc, 0 0 15px #0ff0fc',
          marginBottom: 2,
        }}
      >
        Page Not Found
      </Typography>
      <Button
        onClick={() => navigate('/home')}
        sx={{
          marginTop: 3,
          padding: '10px 20px',
          fontSize: '1rem',
          fontFamily: 'monospace',
          color: '#ffffff',
          backgroundColor: '#a805ad', // Neon purple background
          textShadow: '0 0 5px #0ff0fc, 0 0 10px #0ff0fc, 0 0 15px #0ff0fc',
          boxShadow: '0 0 10px #a805ad, 0 0 20px #a805ad', // Neon glow for button
          borderRadius: '8px',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)', // Slight pop on hover
            backgroundColor: '#7a007a', // Darker purple on hover
            color: '#ff0090', // Neon pink text on hover
            boxShadow: '0 0 15px #7a007a, 0 0 25px #ff0090', // Enhanced glow on hover
          },
        }}
      >
        Volver a Inicio
      </Button>
    </Paper>
  );
}

export default Error404;
