import * as React from 'react';
import format from 'date-fns/format';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { es } from 'date-fns/locale'; // Use 'es' locale for Spanish
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Container, Paper, Typography, Button, IconButton, InputAdornment, Tooltip, CircularProgress } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import NotFound from '../pages/NotFound';
import { DatePicker } from '@mui/x-date-pickers';


export default function NewEmployeeForm() {
  const paperStyle = { padding: '40px 30px', width: 400, margin: '20px auto' };


  const countries = [
    { code: "UY", label: "Uruguay", phone: '598' },
    { code: "DE", label: "Alemania", phone: '49' },
    { code: "AR", label: "Argentina", phone: '54' },
    { code: "AU", label: "Australia", phone: '61' },
    { code: "BR", label: "Brasil", phone: '55' },
    { code: "CA", label: "Canada", phone: '1' },
    { code: "CL", label: "Chile", phone: '56' },
    { code: "CN", label: "China", phone: '86' },
    { code: "ES", label: "España", phone: '34' },
    { code: "FR", label: "Francia", phone: '33' },
    { code: "IN", label: "India", phone: '91' },
    { code: "IT", label: "Italia", phone: '39' },
    { code: "JP", label: "Japón", phone: '81' },
    { code: "MX", label: "Mexico", phone: '52' },
    { code: "GB", label: "Reino Unido", phone: '44' },
    { code: "US", label: "USA", phone: '1' },
    { code: "OTHER", label: "Otro", phone: '0' }
  ];
  


  const idTypes = [
    { label: "CI" },
    { label: "Pasaporte" }
  ];

  const [userRole, setUserRole] = useState('notLoggedIn');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState(null);
  const [idNumber, setIdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPhoneCountry, setSelectedPhoneCountry] = useState(null);
  const [selectedIDType, setSelectedIDType] = useState(null);
  const [selectedIDCountry, setIDCountry] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [address, setAddress] = useState('');

  useEffect(() => {
    const allFieldsFilled = email && firstName && lastName && dob && idNumber && phoneNumber && selectedPhoneCountry && selectedIDType && password && confirmPassword;
    setIsFormValid(allFieldsFilled);
  }, [email, firstName, lastName, dob, idNumber, phoneNumber, selectedPhoneCountry, selectedIDType, password, confirmPassword]);

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Las contraseñas no coinciden.",
      }));
      return false;
    }
    return true;
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
    setFormErrors({});
    setServerError('');

    if (validatePasswords()) {
      setLoading(true);

      const newEmployee = {
        email, firstName, lastName, dateOfBirth: dob,
        celCountryCode: selectedPhoneCountry?.code,
        celNumber: phoneNumber, idType: selectedIDType?.label,
        idCountry: selectedIDCountry?.code, idNumber, password, address,
      };

      try {
        const response = await fetch('http://localhost:8080/api/employee/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEmployee),
          credentials: 'include',
        }); 

        if (!response.ok) {
          if (response.status === 400) {
            const errorData = await response.json();
            setFormErrors(errorData);
          } else {
            setServerError("Error inesperado.");
          }
        } else {
          window.location.reload();
          alert('Registro exitoso!');
        }
      } catch (error) {
        console.error('Error during signup:', error);
        setServerError("Error comunicándose con el servidor.");
      } finally {
        setLoading(false);
      }
    }
    else {
      setFormErrors({password: 'Las contraseñas no coinciden.'})
    }
  };



  if (userRole === 'employee') {
    return (
      <Container sx={{ mt: '-3%' }}>
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
            Agregar un empleado
          </Typography>


          <Box
            component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <TextField required 
            id="email" 
            label="e-mail" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            disabled={loading}
            error={!!formErrors.email}
            helperText={formErrors.email}
             />
            <TextField
              id="password"
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              autoComplete="current-password"
              error={!!formErrors.password}
              helperText={formErrors.password}
              disabled={loading}
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
            />
            <TextField
              id="verify-password"
              label="Confirmar contraseña"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              autoComplete="current-password"
              error={!!formErrors.password}
              helperText={formErrors.password}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Mostrar">
                      <IconButton onClick={toggleShowConfirmPassword} edge="end" disabled={loading}>
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />


            <TextField 
            required 
            id="first-name" 
            label="Nombre(s)" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            disabled={loading} 
            error={!!formErrors.firstName}
            helperText={formErrors.firstName}
            />
            <TextField 
            required 
            id="last-name" 
            label="Apellido(s)" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            disabled={loading} 
            error={!!formErrors.lastName}
            helperText={formErrors.lastName}
            />
            <TextField 
            required 
            id="address" 
            label="Dirección" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            disabled={loading} 
            error={!!formErrors.address}
            helperText={formErrors.address}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DatePicker
                label="Fecha de nacimiento (DD/MM/YYYY)"
                value={dob}
                dayOfWeekFormatter={(date) => <Typography fontSize={'0.8rem'} color='#0ff0fc'>{['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].at(date.getDay())}</Typography>}
                onChange={(newValue) => setDob(newValue)}
                renderInput={(params) => <TextField {...params} required />}
                format="dd/MM/yyyy"
                disabled={loading}
                error={!!formErrors.dateOfBirth}
                helperText={formErrors.dateOfBirth}
              />
            </LocalizationProvider>
            <Typography align='center' my={-1}>Documento de identidad</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              <Autocomplete
                id="country-origin-select"
                sx={{flex: '0.375'}}
                options={countries}
                disableClearable
                value={selectedIDCountry}
                onChange={(event, newValue) => {
                  setIDCountry(newValue);
                }}
                autoHighlight
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => (
                  <Box component="li" {...props} key={option.code}> 
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
                  <TextField
                    {...params}
                    label="País"
                    value={selectedIDCountry}
                    onChange={(e) => setIDCountry(e.target.value)}
                  />
                )}
              />
              <Autocomplete
                id="id-type-select"
                options={idTypes}
                sx={{flex: '0.25'}}
                disableClearable
                autoHighlight
                value={selectedIDType}
                onChange={(event, newValue) => {
                  setSelectedIDType(newValue);
                }}
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => (
                  <Box component="li" {...props} key={option.code}> 
                    <Typography fontSize={15} marginLeft={-0.6}>{option.label}</Typography>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Tipo" disabled={loading}/>
                )}
              />
              <TextField 
              id="id-number" 
              label="Número" 
              sx={{ flex: '0.375' }} 
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)} 
              disabled={loading} 
              />
            </Box>
            {!!formErrors.idType && <Typography color="error">{formErrors.idType}</Typography>}
            {!!formErrors.idNumber && <Typography color="error">{formErrors.idNumber}</Typography>}

            <Typography align='center' my={-1}>Teléfono de contacto</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              <Autocomplete
                id="phone-country-code-select"
                options={countries}
                sx={{flex: '1'}}
                autoHighlight
                value={selectedPhoneCountry}
                onChange={(event, newValue) => {
                  setSelectedPhoneCountry(newValue);
                }}
                getOptionLabel={(option) => `+${option.phone}`}
                renderOption={(props, option) => (
                  <Box component="li" {...props} key={option.code}> 
                    <img
                      loading="lazy"
                      width="20"
                      src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                      alt=""
                      style={{ marginRight: 10, marginLeft: -10 }}
                    />
                    <Typography fontSize={13} marginLeft={-0.5}>{`${option.label} (+${option.phone})`}</Typography>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Código de país"
                    value={selectedPhoneCountry}
                    onChange={(e) => setSelectedPhoneCountry(e.target.value)}
                  />
                )}
              />
              <TextField
                id="phone-number"
                label="Número"
                sx={{flex: '1'}}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={loading}
                error={!!formErrors.celNumber}
                helperText={formErrors.celNumber}
              />
            </Box>

            {serverError && <Typography color="error">{serverError}</Typography>}

            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!isFormValid || loading}
              sx={{ fontWeight: 'bold', fontSize: 17 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Enviar'}
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  } else {
    return (
      <NotFound></NotFound>
    );

  }
}
