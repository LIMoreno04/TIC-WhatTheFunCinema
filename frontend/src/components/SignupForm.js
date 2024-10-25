import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Container, Paper, Typography, Button } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

export default function SignupForm() {
  const paperStyle = { padding: '40px 30px', width: 400, margin: '20px auto' };

  const countries = [
    { code: "UY", label: "Uruguay", phone: 598 },
    { code: "US", label: "USA", phone: 1 },
    { code: "BR", label: "Brasil", phone: 55 },
    { code: "AR", label: "Argentina", phone: 54 },
    { code: "CH", label: "Chile", phone: 56 },
    { code: "CA", label: "Canada", phone: 1 },
    { code: "MX", label: "Mexico", phone: 52 },
    { code: "GB", label: "Reino Unido", phone: 44 },
    { code: "DE", label: "Alemania", phone: 49 },
    { code: "FR", label: "Francia", phone: 33 },
    { code: "IT", label: "Italia", phone: 39 },
    { code: "JP", label: "Japón", phone: 81 },
    { code: "CN", label: "China", phone: 86 },
    { code: "IN", label: "India", phone: 91 },
    { code: "AU", label: "Australia", phone: 61 },
    { code: "OTHER", label: "Otro", phone: 0 }
  ];

  const idTypes = [
    { label: "C.I." },
    { label: "Pasaporte" }
  ];

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPhoneCountry, setSelectedPhoneCountry] = React.useState(null);
  const [selectedIDType, setSelectedIDType] = useState(null);
  const [selectedIDCountry, setIDCountry] = useState(null)
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [PasswordValidationError, setPasswordValidationError] = useState(false);
  const passwordErrorMessage = 'Contraseñas no coinciden'

  // Check if all fields are filled
  useEffect(() => {
    const allFieldsFilled = email && firstName && lastName && dob && idNumber && phoneNumber && selectedPhoneCountry && selectedIDType && password && confirmPassword;
    setIsFormValid(allFieldsFilled);
  }, [email, firstName, lastName, dob, idNumber, phoneNumber, selectedPhoneCountry, selectedIDType, password, confirmPassword]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const validatePasswords = (pass1, pass2) => {
    if (pass1 !== pass2) {
      setPasswordValidationError(true);
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validatePasswords(password, confirmPassword)) {
      const newUser={email,firstName,lastName,dob,selectedPhoneCountry,phoneNumber,selectedIDType,selectedIDCountry,idNumber,password}
      fetch('http://localhost:8080/api/user/signup', 
        {method: 'POST', 
          headers: {'Content-Type':'application/json'},
          body:JSON.stringify(newUser)
        }).then(()=>{
          alert('Registro exitoso!')
          setEmail('')
          setPassword('')
          setConfirmPassword('')
        })

      alert('Registro exitoso');
    } else {
      // Reset the form
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <Container sx={{ marginTop: 15 }}> {/* Moves the container down */}
      <Paper elevation={24} style={paperStyle}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            fontFamily: 'Monospace',
            letterSpacing: '0.15rem',
            marginBottom: 2,
            marginTop: -3,
          }}
        >
          Registrar cuenta
        </Typography>

        <Box
          component="form"
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit} // Handle form submission
        >
          <TextField required id="email" label="e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField
            id="password"
            label="Contraseña"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            autoComplete="current-password"
            error={PasswordValidationError}
            helperText={PasswordValidationError ? passwordErrorMessage : ''}
          />
          <TextField
            id="verify-password"
            label="Confirmar contraseña"
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            autoComplete="current-password"
            error={PasswordValidationError}
            helperText={PasswordValidationError ? passwordErrorMessage : ''}
          />
          <TextField required id="first-name" label="Nombre(s)" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <TextField required id="last-name" label="Apellido(s)" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <TextField
            id="dob"
            label="Fecha de nacimiento (DD/MM/YYYY)"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <Typography align='center' my={-1}>Documento de identidad</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <Autocomplete
              id="country-origin-select"
              options={countries}
              disableClearable
              value={selectedIDCountry}
              onChange={(event, newValue) => {
                setIDCountry(newValue);
              }}
              autoHighlight
              getOptionLabel={(option) => option.label}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <img
                    loading="lazy"
                    width="20"
                    src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                    alt=""
                    style={{ marginRight: 10, marginLeft: -10 }}
                  />
                  <Typography fontSize={13} marginLeft={-0.5}>{option.label}</Typography>
                </Box>
              )}
              renderInput={(params) => (
                <TextField sx={{ width: '150px' }} {...params} label="País" value={selectedIDCountry} onChange={(e) => setIDCountry(e.target.value)} />
              )}
            />
            <Autocomplete
              id="id-type-select"
              options={idTypes}
              disableClearable
              autoHighlight
              value={selectedIDType}
              onChange={(event, newValue) => {
                setSelectedIDType(newValue);
              }}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField sx={{ width: '100px' }} {...params} label="Tipo" />
              )}
            />
            <TextField id="id-number" label="Número" sx={{ flex: 1 }} value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
          </Box>
          <Typography align='center' my={-1}>Teléfono de contacto</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
            <Autocomplete
              id="phone-country-code-select"
              options={countries}
              autoHighlight
              value={selectedPhoneCountry}
              onChange={(event, newValue) => {
                setSelectedPhoneCountry(newValue);
              }}
              getOptionLabel={(option) => `+${option.phone}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Código"
                  sx={{ width: 120 }}
                />
              )}
            />
            <TextField
              id="phone-number"
              label="Número de teléfono"
              sx={{ flex: 1 }}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              InputProps={{
                startAdornment: selectedPhoneCountry ? (
                  <Box sx={{ paddingRight: 1 }}>+{selectedPhoneCountry.phone}</Box>
                ) : null,
              }}
            />
          </Box>
          <Button
            sx={{ marginBottom: -1, marginTop: 2 }}
            type="submit"
            variant="contained"
            color="secondary"
            disabled={!isFormValid}
          >
            <Typography fontFamily={'Monospace'}>Enviar</Typography>
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
