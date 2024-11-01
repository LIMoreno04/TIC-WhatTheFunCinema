import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Container, Paper, Typography, Button, InputAdornment, IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function LoginForm() {
  const paperStyle = { padding: '40px 30px', width: 400, margin: '20px auto'};
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ email: false, password: false });
  const [errorMessage, setErrorMessage] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
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
    fetch('http://localhost:8080/api/user/auth', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => setIsLoggedIn(data))
      .catch((error) => console.error('Error fetching login status:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        navigate('/home');
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
          setErrorMessage({ ...errorMessage, password: 'Contraseña incorrecta' });
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const isFormValid = email !== '' && password !== '';



  if (!isLoggedIn) {
  return (
    <Container>
      <Paper elevation={24} style={paperStyle} sx={{backgroundColor: '#191331'}}>
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
            error={error.email}
            helperText={errorMessage.email}
          />
          <TextField
            required
            id="password"
            label="Contraseña"
            value={password}
            onChange={handlePasswordChange}
            error={error.password}
            helperText={errorMessage.password}
            autoComplete="current-password"
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Mostrar">
                    <IconButton onClick={toggleShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={!isFormValid}
            sx={{marginBottom: -1, marginTop: 2, fontFamily: 'monospace'}}
          >
            Enviar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
else {
  return (<Container>
    <Paper elevation={24} style={paperStyle} sx={{backgroundColor: '#191331'}}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Typography variant='neonCyan' fontFamily='Monospace' sx={{fontSize: '20px'}}>
        sesión iniciada
      </Typography>
      <Button 
      variant='contained'
      color='secondary'
      href='/home'
      sx={{marginBottom: -1, marginTop: 2, fontFamily: 'monospace'}}
      >
        volver a inicio
      </Button>
      </Box>
    </Paper>
  </Container>);
}
}
