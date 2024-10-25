import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Container, Paper, Typography, Button } from '@mui/material';

export default function LoginForm() {
  const paperStyle = { padding: '50px 20px', width: 400, margin: '20px auto' };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle form submission
    if (email === '' || password === '') {
      setError(true);
      setErrorMessage('Los campos no pueden estar vacíos');
    } else {
      setError(false);
      setErrorMessage('');
      alert('Inicio de sesión exitoso!');
      // Perform login logic
    }
  };

  return (
    <Container sx={{ marginTop: 20 }}> {/* Moves the container down */}
      <Paper elevation={24} style={paperStyle}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 'bold', // Makes the text bold
            fontFamily: 'Monospace', // Adds a distinct font style
            letterSpacing: '0.15rem', // Spatiation (adds space between letters)
            marginBottom: 3, // Adjust spacing below the title
            marginTop: -2, // Moves the text a bit closer to the top
          }}
        >
          Iniciar sesión
        </Typography>

        <Box
          component="form"
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit} // Handle form submission
        >
          <TextField
            required
            id="email"
            label="e-mail"
            value={email}
            onChange={handleEmailChange}
            error={error && email === ''} // Show error if email is empty
            helperText={error && email === '' ? errorMessage : ''}
          />
          <TextField
            required
            id="password"
            label="Contraseña"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            error={error && password === ''} // Show error if password is empty
            helperText={error && password === '' ? errorMessage : ''}
            autoComplete="current-password"
          />
          <Button type="submit" variant="contained" color="secondary" disabled={error}>
            Iniciar sesión
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
