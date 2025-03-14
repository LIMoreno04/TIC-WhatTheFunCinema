import React, { useState } from 'react';
import { es } from 'date-fns/locale';
import {
  TextField, Button, Typography, Box, Paper, CircularProgress,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { styled } from '@mui/system';
import ImageIcon from '@mui/icons-material/Image';

const ErrorMessage = styled(Typography)({
  color: '#fc7d7d',
  fontWeight: 'bold',
  textShadow: '0 0 10px#ca1e1e, 0 0 10px #b44545, 0 0 10px #ff6666',
  marginBottom: '10px',
});

const NewSnackForm = () => {
  const MAX_FILE_SIZE = 16 * 1024 * 1024; // 16MB in bytes

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError('El archivo de imagen no puede exceder los 16Mb.');
        setImage(null);
        return;
      }
      setImage(file);
      setError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !description || !price || !image) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("picture", image);

      const response = await fetch('http://localhost:8080/api/snacks/addSnack', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData || 'Error inesperado.');
      } else {
        alert("Snack agregado con éxito.");
        setName('');
        setDescription('');
        setPrice('');
        setImage(null);
      }
    } catch (err) {
      setError('No se pudo conectar al servidor.');
    }

    setLoading(false);
  };

  const allFieldsFilled = name && description && price && image;

  return (
    <Box position="relative">
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        {loading && (
          <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            backgroundColor="rgba(0, 0, 0, 0.7)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={9999}
          >
            <CircularProgress />
          </Box>
        )}

        <Paper sx={{
          border: '2px solid #ff66b2',
          borderRadius: '30px',
          padding: '40px',
          maxWidth: '850px',
          flexDirection: 'column',
          margin: 'auto',
          opacity: loading ? 0.5 : 1,
        }}>
          <Box align="center" maxWidth={850} sx={{ margin: 'auto' }}>
            <Box ml={3} display="flex" mt={-2} mb={3}>
              <Typography
                variant="h5"
                fontSize="50px"
                sx={{
                  color: '#fff',
                  textShadow: '0 0 10px #ff66b2, 0 0 20px #ff66b2',
                  fontWeight: 'bold',
                }}
              >
                Agregar Snack
              </Typography>
            </Box>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Box sx={{ paddingY: 2, display: 'flex', gap: 2, maxWidth: 800, margin: 'auto' }}>
              {/* Sección para la imagen */}
              <Box sx={{ flex: 0.75, maxWidth: '50%' }}>
                <Paper
                  elevation={3}
                  sx={{
                    border: isDragging ? '2px dashed #e4b4e6' : '2px solid #e4b4e6',
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    height: 292,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isDragging ? 'rgba(228, 180, 230, 0.1)' : 'transparent',
                  }}
                  onClick={() => document.getElementById('file-input').click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <ImageIcon fontSize="large" />
                  <Typography variant="subtitle1">
                    {image ? image.name : 'Arrastre o elija el archivo de la imagen'}
                  </Typography>
                </Paper>
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                  required
                />
              </Box>

              {/* Sección de campos */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <TextField
                  label="Descripción"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                <TextField
                  label="Precio"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </Box>
            </Box>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!allFieldsFilled}
            >
              Enviar
            </Button>
          </Box>
        </Paper>
      </LocalizationProvider>
    </Box>
  );
};

export default NewSnackForm;
