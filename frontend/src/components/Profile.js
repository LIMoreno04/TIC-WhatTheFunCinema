import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField, CircularProgress, Typography, Box, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, Paper, Divider, InputAdornment, Tooltip } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { Edit as EditIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import neonTheme from '../assets/Theme';
import { DateField } from '@mui/x-date-pickers/DateField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { es } from 'date-fns/locale'; // Use 'es' locale for Spanish
import { format } from 'date-fns';
import PaymentMethodsDisplay from './PaymentMethodsDisplay';


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
  const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentField, setCurrentField] = useState('');
    const [newFieldValue, setNewFieldValue] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newCelData, setNewCelData] = useState({ celCountryCode: '', celNumber: '' });
    
    const [errors, setErrors] = useState({});

    const fieldLabels = {
        firstName: 'Nombre',
        lastName: 'Apellido',
        dateOfBirth: 'Fecha de nacimiento',
        celCountryCode: 'Código de país (celular)',
        celNumber: 'Número de celular',
        cel: 'Número de celular',
        password: 'Contraseña',
    };
    useEffect(() => {
        fetchUserData();
    }, []);


    const fetchUserData = () => {
        setLoading(true);
        fetch('http://localhost:8080/api/customer/current', {
            method: 'GET',
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            setUserData(data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            setLoading(false);
        });
    };

    const handleEditClick = (field) => {
        setCurrentField(field);
        if (field === 'cel') {
            setNewCelData({
                celCountryCode: userData.celCountryCode || '',
                celNumber: userData.celNumber || ''
            });
        } else if (field === 'password') {
            setOldPassword('');
            setNewPassword('');
        } else {
            setNewFieldValue(userData[field] || '');
        }
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setShowNewPassword(false); 
        setShowOldPassword(false);
    };

    const handleConfirmChange = () => {
        setErrors({});
        setLoading(true);
        
        let endpoint = '';
        let bodyData = {};

        if (currentField === 'cel') {
            endpoint = 'change-celnumber';
            bodyData = {
                celCountryCode: newCelData.celCountryCode,
                celNumber: newCelData.celNumber
            };
        } else if (currentField === 'password') {
            endpoint = 'change-password';
            bodyData = {
                oldPassword,
                newPassword
            };
        } else {
            const endpointMap = {
                firstName: 'change-firstname',
                lastName: 'change-lastname',
                dateOfBirth: 'change-dateofbirth'
            };
            endpoint = endpointMap[currentField];
            bodyData = { [currentField]: newFieldValue };
        }

        fetch(`http://localhost:8080/api/user/${endpoint}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        })
        .then(async response => {
            setLoading(false);
            if (response.ok) {
                fetchUserData(); // Fetch user data again to ensure consistency
                setOpenDialog(false);
                setShowNewPassword(false);
                setShowOldPassword(false);
            } else if (response.status === 400) {
                const errorData = await response.json();
                setErrors(errorData);
                console.log(errorData);
            } else {
                console.error(`Error updating ${currentField}:`, response.statusText);
                alert("Error inesperado.");
                setOpenDialog(false);
                setShowNewPassword(false);
                setShowOldPassword(false);
            }
        })
        .catch(error => {
            alert("Error conectándose con el servidor.");
            console.error('Error updating field:', error);
            setOpenDialog(false);
            setShowNewPassword(false);
            setShowOldPassword(false);
        });
    };

    const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const toggleShowOldPassword = () => setShowOldPassword(!showOldPassword);
    
    
    return !userData ? (
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh' 
        }}>
            <CircularProgress size={64} sx={{ color: 'primary' }} />
        </div>
        ) : (
        <ThemeProvider theme={neonTheme}>
            <Paper 
            sx={{
                width: '70vw',
                minWidth: '925px',
                margin: '20px auto',
                paddingX: '2.5vw',
                paddingY: '4vh',
                backgroundColor: '#191331',
                textAlign: 'center',
                boxShadow: 'inset 0 0 15px #a805ad, 0 0 25px #a805ad, 0 0 45px #0ff0fc',
                borderRadius: '80px',
                border: `3px solid #9df8fc`,
                }}>
                <Typography variant="neonPink" fontSize={'60px'}>
                    Perfil {console.log(userData)}
                </Typography>
                
                <Box display={'flex'} flexDirection={'row'}>
                
                    {/*datos del perfil*/}
                    <Box flex={1} display={'flex'} flexDirection={'column'}>
                        <Box display={'flex'} flexDirection={'column'} width={'35vw'} minWidth={'462.5px'}>

                            <Typography variant='neonCyan' fontSize={'30px'} mb={3}>Datos de cuenta</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', my: '1.1vh' }}>
                                    <Box sx={{ alignItems: 'center', display: 'flex', width: '15vw', minWidth: '190px' }}>
                                        <Typography variant="neonCyan">
                                            Correo electrónico:
                                        </Typography>
                                    </Box>
                                    <Paper 
                                        sx={{
                                            width: '15vw',
                                            minWidth: '200px',
                                            padding: 1,
                                            marginLeft: '5px',
                                            marginRight: '-5px',
                                            backgroundColor: '#18181c',
                                            textAlign: 'center',
                                            boxShadow: 'inset 0 0 2px #a805ad, 0 0 5px #a805ad, 0 0 10px #0ff0fc',
                                            borderRadius: '40px',
                                            border: `1px solid #9df8fc`,
                                        }}>
                                        <Typography variant="neonPink">
                                            {userData.email}
                                        </Typography>
                                    </Paper>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', my: '1.1vh' }}>
                                    <Box sx={{ alignItems: 'center', display: 'flex', width: '15vw', minWidth: '190px' }}>
                                        <Typography variant="neonCyan">
                                            Contraseña:
                                        </Typography>
                                    </Box>
                                    <Paper 
                                        sx={{
                                            width: '15vw',
                                            minWidth: '200px',
                                            padding: 1,
                                            marginLeft: '5px',
                                            marginRight: '-5px',
                                            backgroundColor: '#18181c',
                                            textAlign: 'center',
                                            boxShadow: 'inset 0 0 2px #a805ad, 0 0 5px #a805ad, 0 0 10px #0ff0fc',
                                            borderRadius: '40px',
                                            border: `1px solid #9df8fc`,
                                        }}>
                                        <Typography variant="neonPink">
                                            {'*'.repeat(userData.password.length)}
                                        </Typography>
                                    </Paper>
                                    <IconButton onClick={() => handleEditClick('password')} sx={{ ml: 1 }}>
                                        <EditIcon sx={{
                                            color: '#ff007f',
                                            transition: 'color 0.3s ease',
                                            '&:hover': {
                                                transform:'scale(1.02)',
                                                color: '#00ffff',  // Cyan color on hover
                                            }
                                        }}/>
                                    </IconButton>
                            </Box>
                        </Box>

                        <Divider
                            sx={{
                                height: '2px',
                                width: '35vw',
                                minWidth: '462.5px',
                                borderRadius: '20px',
                                backgroundColor: '#ffffff', 
                                boxShadow: '0 0 5px #00ffff, 0 0 10px #00ffff', // Neon glow effect
                                marginTop: 3,
                                marginBottom: 3,
                            }}
                        />      

                        <Box display={'flex'} flexDirection={'column'} width={'35vw'} minWidth={'462.5px'}>
                            <Typography variant='neonCyan' fontSize={'30px'} mb={3}>Datos personales</Typography>

                            {['firstName', 'lastName', 'dateOfBirth'].map((field) => (
                                <Box key={field} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', my: '1.1vh' }}>
                                    <Box sx={{ alignItems: 'center', display: 'flex', width: '15vw', minWidth: '190px' }}>
                                        <Typography variant="neonCyan">
                                            {fieldLabels[field]}:
                                        </Typography>
                                    </Box>
                                    <Paper 
                                        sx={{
                                            width: '15vw',
                                            minWidth: '200px',
                                            padding: 1,
                                            marginLeft: '5px',
                                            marginRight: '-5px',
                                            backgroundColor: '#18181c',
                                            textAlign: 'center',
                                            boxShadow: 'inset 0 0 2px #a805ad, 0 0 5px #a805ad, 0 0 10px #0ff0fc',
                                            borderRadius: '40px',
                                            border: `1px solid #9df8fc`,
                                        }}>
                                        <Typography variant="neonPink">
                                            {field === "dateOfBirth" ? format((new Date(userData[field] + 'T00:00:00')),"dd/MM/yyyy") : userData[field]}
                                        </Typography>
                                    </Paper>
                                    <IconButton onClick={() => handleEditClick(field)} sx={{ ml: 1 }}>
                                        <EditIcon sx={{
                                            color: '#ff007f',
                                            transition: 'color 0.3s ease',
                                            '&:hover': {
                                                transform:'scale(1.02)',
                                                color: '#00ffff',  // Cyan color on hover
                                            }
                                        }}/>
                                    </IconButton>
                                </Box>
                            ))}

                            {/* Cel Country Code and Cel Number Display */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', my: '1.1vh' }}>
                                <Box sx={{ alignItems: 'center', display: 'flex', width: '15vw', minWidth: '190px' }}>
                                    <Typography variant="neonCyan">
                                        {fieldLabels.celNumber}:
                                    </Typography>
                                </Box>
                                <Paper 
                                    sx={{
                                        width: '15vw',
                                        minWidth: '200px',
                                        padding: 1,
                                        marginLeft: '5px',
                                        marginRight: '-5px',
                                        backgroundColor: '#18181c',
                                        textAlign: 'center',
                                        boxShadow: 'inset 0 0 2px #a805ad, 0 0 5px #a805ad, 0 0 10px #0ff0fc',
                                        borderRadius: '40px',
                                        border: `1px solid #9df8fc`,
                                    }}>
                                    <Typography variant="neonPink">
                                        {userData.celCountryCode} {userData.celNumber}
                                    </Typography>
                                </Paper>
                                <IconButton onClick={() => handleEditClick('cel')} sx={{ ml: 1 }}>
                                        <EditIcon sx={{
                                            color: '#ff007f',
                                            transition: 'color 0.3s ease',
                                            '&:hover': {
                                                transform:'scale(1.02)',
                                                color: '#00ffff',  // Cyan color on hover
                                            }
                                        }}/>
                                    </IconButton>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', my: '1.1vh' }}>
                                <Box sx={{ alignItems: 'center', display: 'flex', width: '15vw', minWidth: '190px' }}>
                                    <Typography variant="neonCyan">
                                        Documento de Identidad:
                                    </Typography>
                                </Box>
                                <Paper 
                                    sx={{
                                        width: '15vw',
                                        minWidth: '200px',
                                        padding: 1,
                                        marginLeft: '5px',
                                        marginRight: '-5px',
                                        backgroundColor: '#18181c',
                                        textAlign: 'center',
                                        boxShadow: 'inset 0 0 2px #a805ad, 0 0 5px #a805ad, 0 0 10px #0ff0fc',
                                        borderRadius: '40px',
                                        border: `1px solid #9df8fc`,
                                    }}>
                                    <Typography variant="neonPink">
                                        {userData.idType} - {userData.idNumber}
                                    </Typography>
                                </Paper>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', my: '1.1vh' }}>
                                <Box sx={{ alignItems: 'center', display: 'flex', width: '15vw', minWidth: '190px' }}>
                                    <Typography variant="neonCyan">
                                        País de origen:
                                    </Typography>
                                </Box>
                                <Paper 
                                    sx={{
                                        width: '15vw',
                                        minWidth: '200px',
                                        padding: 1,
                                        marginLeft: '5px',
                                        marginRight: '-5px',
                                        backgroundColor: '#18181c',
                                        textAlign: 'center',
                                        boxShadow: 'inset 0 0 2px #a805ad, 0 0 5px #a805ad, 0 0 10px #0ff0fc',
                                        borderRadius: '40px',
                                        border: `1px solid #9df8fc`,
                                    }}>
                                    <Typography variant="neonPink">
                                        {userData.idCountry}
                                    </Typography>
                                </Paper>
                            </Box>
                        </Box>
                    </Box>
                    
                    <Divider
                            sx={{
                                height: 'auto',
                                width: '3px',
                                marginBottom: '5px',
                                marginTop:'15px',
                                marginRight:'35px',
                                borderRadius:'20px',
                                backgroundColor: '#ffffff', 
                                boxShadow: '0 0 5px #00ffff, 0 0 10px #00ffff', // Neon glow effect
                            }}
                        />
                    
                    {/*tarjetas - card*/}
                    <Box flex={1} display={'flex'} flexDirection={'column'}>
                            <Typography marginBottom={'3vh'} variant='neonCyan' fontSize={'30px'}>Métodos de pago</Typography>
                            <PaymentMethodsDisplay cards={userData.paymentMethods ? userData.paymentMethods : []} onUpdate={fetchUserData}/>
                    </Box>
                
                </Box>

                <Dialog open={openDialog} onClose={handleDialogClose}>
                    <DialogTitle>Editar {fieldLabels[currentField] ? fieldLabels[currentField].toLowerCase() : 'ERROR'}</DialogTitle>
                    <DialogContent>
                        {currentField === 'cel' ? (
                            <>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <TextField
                                        label="País actual"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        value={userData.celCountryCode}
                                        InputProps={{ readOnly: true }}
                                        sx={{ flex: 1 }}
                                    />
                                    <TextField
                                        label="Número actual"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        value={userData.celNumber}
                                        InputProps={{ readOnly: true }}
                                        sx={{ flex: 3 }}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                    <Autocomplete
                                            options={countries}
                                            value={countries.find(country => country.phone === newCelData.celCountryCode.substring(1)) || null}
                                            getOptionLabel={(option) => `+${option.phone}`}
                                            isOptionEqualToValue={(option, value) => option.phone === value.phone}
                                            onChange={(event, newValue) => {
                                                if (newValue) {
                                                    setNewCelData(prev => ({
                                                        ...prev,
                                                        celCountryCode: `+${newValue.phone}`,
                                                    }));
                                                }
                                            }}
                                            renderOption={(props, option) => (
                                                <li {...props}>
                                                    <img
                                                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                                        alt=""
                                                        style={{ marginRight: 8, width: 20, height: 15 }}
                                                    />
                                                    +{option.phone}
                                                </li>
                                            )}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Nuevo país" variant="outlined" margin="normal" />
                                            )}
                                            sx={{ flex: 1 }}
                                            disableClearable
                                        />
                                    <TextField
                                        label="Nuevo número"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        helperText={errors.celNumber}
                                        error={!!errors.celNumber}
                                        value={newCelData.celNumber}
                                        onChange={(e) => setNewCelData(prev => ({ ...prev, celNumber: e.target.value }))}
                                        sx={{ flex: 3 }}
                                    />
                                </Box>
                            </>
                        ) : currentField === 'password' ? (
                            <>
                                <TextField
                                    label="Contraseña actual"
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    value={oldPassword}
                                    error={!!errors.oldPassword}
                                    helperText={errors.oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    type={showOldPassword ? "text" : "password"}
                                    autoComplete='off'
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Tooltip title="Mostrar">
                                                    <IconButton onClick={toggleShowOldPassword} edge="end" disabled={loading}>
                                                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    label="Nueva contraseña"
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    error={!!errors.newPassword}
                                    helperText={errors.newPassword}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    type={showNewPassword ? "text" : "password"}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Tooltip title="Mostrar">
                                                    <IconButton onClick={toggleShowNewPassword} edge="end" disabled={loading}>
                                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </>
                        ) : currentField==="dateOfBirth" ? (
                            <>
                                <TextField
                                    label={'Fecha de nacimiento actual'}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    value={format(new Date(userData[currentField] + 'T00:00:00'),"dd/MM/yyyy")}
                                    InputProps={{ readOnly: true }}
                                />
                                <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                                    <DateField
                                        label={'Nueva Fecha de nacimiento'}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        error={!!errors[currentField]}
                                        helperText={errors[currentField]}
                                        format="dd/MM/yyyy"
                                        value={new Date(newFieldValue + 'T00:00:00')}
                                        onChange={(newValue) => setNewFieldValue(format(new Date(newValue),"yyyy-MM-dd"))}
                                    />
                                </LocalizationProvider>
                            </>
                        ) : (
                            <>
                                <TextField
                                    label={`${fieldLabels[currentField]} actual`}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    value={userData[currentField]}
                                    InputProps={{ readOnly: true }}
                                />
                                <TextField
                                    label={`Nuevo ${fieldLabels[currentField]}`}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    error={!!errors[currentField]}
                                    helperText={errors[currentField]}
                                    value={newFieldValue}
                                    onChange={(e) => setNewFieldValue(e.target.value)}
                                />
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} color="secondary">
                            Cancelar
                        </Button>
                        <Button onClick={handleConfirmChange} color="primary" disabled={loading}>
                            Confirmar
                        </Button>
                    </DialogActions>
                </Dialog>


            </Paper>
        </ThemeProvider>
    );
}

export default Profile;
