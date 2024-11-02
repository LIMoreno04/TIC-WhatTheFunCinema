import React, { useState, useEffect } from 'react';
import { TextField, CircularProgress, Typography, Box } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import neonTheme from '../assets/Theme';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch user data from backend
    useEffect(() => {
        fetch('http://localhost:8080/api/user/current', {
            method: 'GET',
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => setUserData(data))
        .catch(error => console.error('Error fetching user data:', error));
    }, []);

    const handleFieldChange = (field, value) => {
        setUserData(prevData => ({ ...prevData, [field]: value }));
    };

    const handleFieldBlur = (field) => {
        // Map of endpoints for each editable field
        const endpointMap = {
            firstName: 'change-firstname',
            lastName: 'change-lastname',
            dateOfBirth: 'change-dateofbirth',
            celCountryCode: 'change-celcountrycode',
            celNumber: 'change-celnumber',
            password: 'change-password',
        };

        const endpoint = endpointMap[field];
        if (!endpoint) return;

        setLoading(true);

        fetch(`http://localhost:8080/api/user/${endpoint}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ [field]: userData[field] })
        })
        .then(response => {
            setLoading(false);
            if (!response.ok) {
                console.error(`Error updating ${field}:`, response.statusText);
            }
        })
        .catch(error => {
            setLoading(false);
            console.error('Error updating field:', error);
        });
    };

    return !userData ? (
        <CircularProgress size={64} color="inherit" />
    ) : (
        <ThemeProvider theme={neonTheme}>
            <Box sx={{ p: 3, backgroundColor: '#191331', borderRadius: '10px' }}>
                <Typography variant="h2" sx={{ mb: 2, ...neonTheme.typography.neonPink }}>
                    Perfil
                </Typography>
                
                <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={userData.email}
                    InputProps={{ readOnly: true }}
                />
                <TextField
                    label="Nombre"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={userData.firstName}
                    onChange={(e) => handleFieldChange('firstName', e.target.value)}
                    onBlur={() => handleFieldBlur('firstName')}
                />
                <TextField
                    label="Apellido"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={userData.lastName}
                    onChange={(e) => handleFieldChange('lastName', e.target.value)}
                    onBlur={() => handleFieldBlur('lastName')}
                />
                <TextField
                    label="Fecha de nacimiento"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={userData.dateOfBirth}
                    onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
                    onBlur={() => handleFieldBlur('dateOfBirth')}
                />
                <TextField
                    label="Código de país"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={userData.celCountryCode}
                    onChange={(e) => handleFieldChange('celCountryCode', e.target.value)}
                    onBlur={() => handleFieldBlur('celCountryCode')}
                />
                <TextField
                    label="Número de celular"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={userData.celNumber}
                    onChange={(e) => handleFieldChange('celNumber', e.target.value)}
                    onBlur={() => handleFieldBlur('celNumber')}
                />
                <TextField
                    label="Tipo de ID"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={userData.idType}
                    InputProps={{ readOnly: true }}
                />
                <TextField
                    label="País de ID"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={userData.idCountry}
                    InputProps={{ readOnly: true }}
                />
                <TextField
                    label="Número de ID"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={userData.idNumber}
                    InputProps={{ readOnly: true }}
                />
                <TextField
                    label="Contraseña"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    type="password"
                    value={userData.password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    onBlur={() => handleFieldBlur('password')}
                />
                
                {loading && <CircularProgress size={24} sx={{ mt: 2 }} />}
            </Box>
        </ThemeProvider>
    );
}

export default Profile;
