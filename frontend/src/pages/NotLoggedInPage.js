import { Paper, Typography, Button, Container, Box, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function NotLoggedInPage() {
  const navigate = useNavigate();

  return (
    <Container
      sx={{
        width: '800px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper
        sx={{
          width: '500px',
          padding: 4,
          backgroundColor: '#191331',
          textAlign: 'center',
          boxShadow: '0 0 15px #a805ad, 0 0 25px #0ff0fc',
        }}
      >
        <Typography
          variant="neonPink"
          fontSize={'3.2rem'}
          gutterBottom
        >
          Sesión no iniciada
        </Typography>

        <Divider
          sx={{
            height: '2px',
            backgroundColor: '#ffffff', // Neon cyan color
            boxShadow: '0 0 5px #00ffff, 0 0 10px #00ffff', // Neon glow effect
            marginTop: 10,
            marginBottom: 1,
          }}
        />

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={7}
          mt={3}
        >
          
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography
              variant="neonPink"
              fontSize={'0.9rem'}
              mb={1}
              sx={{
                color: '#ffffff',
                textShadow: '0 0 5px #0ff0fc',
              }}
            >
              ¿Ya tienes cuenta?
            </Typography>

            <Button
              onClick={() => navigate('/login')}
              sx={{
                width: '220px',
                padding: '10px 20px',
                fontSize: '1rem',
                fontFamily: 'infinityThin',
                color: '#ffffff',
                backgroundColor: '#a805ad',
                textShadow: '0 0 10px #0ff0fc, 0 0 20px #0ff0fc, 0 0 15px #0ff0fc',
                boxShadow: '0 0 10px #a805ad, 0 0 20px #a805ad',
                borderRadius: '8px',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  backgroundColor: '#7a007a',
                  color: '#0ff0fc',
                },
              }}
            >
              Iniciar sesión
            </Button>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography
              variant="neonPink"
              fontSize={'0.9rem'}
              mb={1}
              sx={{
                color: '#ffffff',
                textShadow: '0 0 5px #0ff0fc',
              }}
            >
              ¿Aún no estás registrado?
            </Typography>

            <Button
              onClick={() => navigate('/signup')}
              sx={{
                width: '220px',
                padding: '10px 20px',
                fontSize: '1rem',
                fontFamily: 'infinityThin',
                color: '#ffffff',
                backgroundColor: '#a805ad',
                textShadow: '0 0 10px #0ff0fc, 0 0 20px #0ff0fc, 0 0 15px #0ff0fc',
                boxShadow: '0 0 10px #a805ad, 0 0 20px #a805ad',
                borderRadius: '8px',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  backgroundColor: '#7a007a',
                  color: '#0ff0fc',
                },
              }}
            >
              Registrarse
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default NotLoggedInPage;
