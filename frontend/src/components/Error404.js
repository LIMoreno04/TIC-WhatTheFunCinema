import { Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Error404() {
  const navigate = useNavigate();

  return (
    <Paper sx={{alignItems:'center', minWidth:'420px', border:'2px solid #9df8fc', borderRadius:'30px',boxShadow: '0 0 15px #a805ad, 0 0 25px #0ff0fc', padding: '70px', paddingTop: '50px', display: 'flex', flexDirection: 'column', gap: 5, maxWidth: 500, margin: 'auto'}}>
      <Typography
        variant="h1"
        sx={{
          fontFamily: 'InfinityRegular',
          fontSize: '4rem',
          color: '#f7bedf', // Neon pink text color
          textShadow: '0 0 5px #ff0090, 0 0 10px #ff0090, 0 0 15px #ff0090',
        }}
      >
        Error 404
      </Typography>
      <Typography
        variant="neonCyan"
        sx={{
          fontSize:'1.2rem',
          marginBottom: 2,
        }}
      >
        Page Not Found
      </Typography>
      <Button
        fullWidth
        onClick={() => navigate('/home')}
        variant='contained'
      >
        Volver a Inicio
      </Button>
    </Paper>
  );
}

export default Error404;
