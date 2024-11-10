import React, { useState, useEffect } from 'react';
import { TextField, CircularProgress, Typography, Box, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, Paper } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { Edit as EditIcon } from '@mui/icons-material';
import neonTheme from '../assets/Theme';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentField, setCurrentField] = useState('');
    const [newFieldValue, setNewFieldValue] = useState('');
    const [newCelCountryCode, setNewCelCountryCode] = useState('');
    const [newCelNumber, setNewCelNumber] = useState('');

    const fieldLabels = {
        firstName: 'Nombre',
        lastName: 'Apellido',
        dateOfBirth: 'Fecha de nacimiento',
        password: 'Contraseña',
        celular: 'Celular'
    };

    useEffect(() => {
        fetch('http://localhost:8080/api/user/current', {
            method: 'GET',
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => setUserData(data))
        .catch(error => console.error('Error fetching user data:', error));
    }, []);

    const handleEditClick = (field) => {
        setCurrentField(field);
        if (field === 'celular') {
            setNewCelCountryCode(userData.celCountryCode || '');
            setNewCelNumber(userData.celNumber || '');
        } else {
            setNewFieldValue(userData[field] || '');
        }
        setOpenDialog(true);
    };

    const handleConfirmChange = () => {
        setLoading(true);

        const updateUserField = (endpoint, body) => {
            return fetch(`http://localhost:8080/api/user/${endpoint}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
        };

        const requests = [];
        if (currentField === 'celular') {
            requests.push(updateUserField('change-celcountrycode', { newCelCountryCode }));
            requests.push(updateUserField('change-celnumber', { newCelNumber }));
        } else {
            const endpointMap = {
                firstName: 'change-firstname',
                lastName: 'change-lastname',
                dateOfBirth: 'change-dateofbirth',
                password: 'change-password',
            };
            const endpoint = endpointMap[currentField];
            if (endpoint) {
                requests.push(updateUserField(endpoint, { [`new${currentField.charAt(0).toUpperCase()}${currentField.slice(1)}`]: newFieldValue }));
            }
        }

        Promise.all(requests)
            .then(() => {
                setLoading(false);
                setUserData(prevData => ({
                    ...prevData,
                    celCountryCode: newCelCountryCode,
                    celNumber: newCelNumber,
                    [currentField]: newFieldValue
                }));
                setOpenDialog(false);
            })
            .catch(error => {
                setLoading(false);
                console.error('Error updating field:', error);
                setOpenDialog(false);
            });
    };

    return !userData ? (
        <CircularProgress size={64} color="inherit" />
    ) : (
        <ThemeProvider theme={neonTheme}>
            <Paper
                sx={{
                    width: '70vw',
                    minWidth: '800px',
                    margin: '20px auto',
                    padding: 4,
                    backgroundColor: '#191331',
                    textAlign: 'center',
                    boxShadow: 'inset 0 0 15px #a805ad, 0 0 25px #a805ad, 0 0 45px #0ff0fc',
                    borderRadius: '80px',
                    border: `3px solid #9df8fc`,
                }}
            >
                <Typography variant="neonPink" fontSize={'6vh'}>
                    Perfil
                </Typography>

                {['firstName', 'lastName', 'dateOfBirth', 'password'].map((field) => (
                    <Box key={field} sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                        <Typography sx={{ width: '15vw' }} variant="neonCyan">
                            {fieldLabels[field]}:
                        </Typography>
                        <Paper
                            sx={{
                                width: '20vw',
                                minWidth: '230px',
                                padding: 1,
                                marginX: '2vw',
                                backgroundColor: '#18181c',
                                textAlign: 'center',
                                boxShadow: 'inset 0 0 2px #a805ad, 0 0 5px #a805ad, 0 0 10px #0ff0fc',
                                borderRadius: '40px',
                                border: `1px solid #9df8fc`,
                            }}
                        >
                            <Typography variant="neonPink">
                                {userData[field]}
                            </Typography>
                        </Paper>
                        <IconButton onClick={() => handleEditClick(field)} sx={{ ml: 1 }}>
                            <EditIcon color="primary" />
                        </IconButton>
                    </Box>
                ))}

                <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                    <Typography sx={{ width: '15vw' }} variant="neonCyan">
                        {fieldLabels['celular']}:
                    </Typography>
                    <Paper
                        sx={{
                            width: '20vw',
                            minWidth: '230px',
                            padding: 1,
                            marginX: '2vw',
                            backgroundColor: '#18181c',
                            textAlign: 'center',
                            boxShadow: 'inset 0 0 2px #a805ad, 0 0 5px #a805ad, 0 0 10px #0ff0fc',
                            borderRadius: '40px',
                            border: `1px solid #9df8fc`,
                        }}
                    >
                        <Typography variant="neonPink">
                            {userData.celCountryCode} {userData.celNumber}
                        </Typography>
                    </Paper>
                    <IconButton onClick={() => handleEditClick('celular')} sx={{ ml: 1 }}>
                        <EditIcon color="primary" />
                    </IconButton>
                </Box>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Edit {currentField === 'celular' ? 'Celular' : fieldLabels[currentField]}</DialogTitle>
                    <DialogContent sx={{ display: 'flex', gap: 2 }}>
                        {currentField === 'celular' ? (
                            <>
                                <TextField
                                    label="Código de país"
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    value={newCelCountryCode}
                                    onChange={(e) => setNewCelCountryCode(e.target.value)}
                                />
                                <TextField
                                    label="Número de celular"
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    value={newCelNumber}
                                    onChange={(e) => setNewCelNumber(e.target.value)}
                                />
                            </>
                        ) : (
                            <TextField
                                label="New Value"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                value={newFieldValue}
                                onChange={(e) => setNewFieldValue(e.target.value)}
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmChange} color="primary" disabled={loading}>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>

                {loading && <CircularProgress size={24} sx={{ mt: 2 }} />}
            </Paper>
        </ThemeProvider>
    );
};

export default Profile;
