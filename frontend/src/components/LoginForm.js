import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Container, Paper, Typography, Button, InputAdornment, IconButton, Tooltip, CircularProgress, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';


export default function LoginForm({fetchRole, reloadOnLogin=true, onLogin}) {
  const paperStyle = { padding: '40px 30px', width: 400, margin: '20px auto'};
  const navigate = useNavigate();


  const [userRole, setUserRole] = useState('notLoggedIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ email: false, password: false, server: false });
  const [errorMessage, setErrorMessage] = useState({ email: '', password: '', server: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
 
  const toggleShowPassword = () => setShowPassword(!showPassword);


  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError({ ...error, email: false });
    setErrorMessage({ ...errorMessage, email: '' });
  };


  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError({ ...error, password: false });
    setErrorMessage({ ...errorMessage, password: '' });
  };


  React.useEffect(() => {
    fetch('http://localhost:8080/api/user/role', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.text(); // Expecting a string response for the role
      })
      .then((role) => setUserRole(role))
      .catch((error) => console.error('Error fetching user role:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading


    try {
      const response = await fetch('http://localhost:8080/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });


      if (response.ok) {
        if (!!onLogin) {
          onLogin();
        }
        if (reloadOnLogin) {
          window.location.reload();
        }
      } else if (response.status === 401) {
        const responseBody = await response.json();
        if (responseBody.error === 'email') {
          setEmail('');
          setPassword('');
          setError({ ...error, email: true });
          setErrorMessage({ ...errorMessage, email: 'No existe una cuenta asociada a ese e-mail.' });
        } else if (responseBody.error === 'password') {
          setPassword('');
          setError({ ...error, password: true });
          setErrorMessage({ ...errorMessage, password: 'Contraseña incorrecta.' });
        }
      } else {
        setError({ ...error, server: true });
        setErrorMessage({ ...errorMessage, server: 'Error inesperado.' });
      }
    } catch (error) {
      setError({ ...error, server: true });
      setErrorMessage({ ...errorMessage, server: 'Error conectándose con el servidor.' });
      console.error('Error during login:', error);
    } finally {
      setLoading(false); // Stop loading
      fetchRole();
    }
  };


  const isFormValid = email !== '' && password !== '';


  if (userRole==='notLoggedIn') {
    return (
      <Container>
        <Paper elevation={24} style={paperStyle} sx={{borderRadius:'10px', border:'2px solid #9df8fc',backgroundColor: '#191331'}}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontFamily: 'Monospace',
              letterSpacing: '0.15rem',
              marginBottom: 3,
              marginTop: -2,
            }}
          >
            Iniciar sesión
          </Typography>


          <Box
            component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <TextField
              required
              id="email"
              label="e-mail"
              value={email}
              onChange={handleEmailChange}
              error={error.email || error.server}
              helperText={error.server ? errorMessage.server : errorMessage.email}
              disabled={loading}
            />
            <TextField
              required
              id="password"
              label="Contraseña"
              value={password}
              onChange={handlePasswordChange}
              error={error.server || error.password}
              helperText={error.server ? errorMessage.server : errorMessage.password}
              autoComplete="current-password"
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Mostrar">
                      <IconButton onClick={toggleShowPassword} edge="end" disabled={loading}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              disabled={loading}
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={!isFormValid || loading}
              sx={{ marginBottom: -1, marginTop: 2, fontFamily: 'monospace' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Enviar'}
            </Button>
          </Box>
          <Divider
          sx={{
            height: '1px',
            backgroundColor: '#ffffff', // Neon cyan color
            boxShadow: '0 0 5px #00ffff, 0 0 10px #00ffff', // Neon glow effect
            marginTop: 5,
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
              ¿Aún no estás registrado?
            </Typography>

            <Button
              onClick={() => navigate('/signup')}
              variant='contained' sx={{width:'170px', padding:'7px', fontSize:'1rem'}}
            >
              Registrarse
            </Button>
          </Box>
        </Box>

        </Paper>
      </Container>
    );
  } else {
    return (
      <Container>
        <Paper elevation={24} style={paperStyle} sx={{border:'2px solid #9df8fc',backgroundColor: '#191331'}}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8 }} alignItems={'center'}>
            <Typography variant='neonCyan' fontFamily={'InfinityThin'} sx={{fontSize: '35px'}}>
              sesión iniciada con exito
            </Typography>
            <Button
              variant='contained'
              color='secondary'
              href='/home'
              sx={{ marginBottom: -1, marginTop: 2 }}
            >
              volver a inicio
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }
}
