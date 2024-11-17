import React, { useState, useEffect } from 'react';
import { es } from 'date-fns/locale'; // Use 'es' locale for Spanish
import {
  TextField, Button, Typography, Box, Autocomplete, Paper, CircularProgress,
  IconButton, Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  InputAdornment
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';
import { DateField } from '@mui/x-date-pickers/DateField';
import { format, parse } from 'date-fns';

const ErrorMessage = styled(Typography)({
  color: 'pink',
  fontWeight: 'bold',
  textShadow: '0 0 5px cyan',
  marginBottom: '10px',
});

const PGRatings = ["G", "PG", "PG-13", "R", "NC-17"];

const NewMovieForm = () => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(null); // Start with null for empty field
  const [description, setDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState(null); // Start with null for empty field
  const [director, setDirector] = useState('');
  const [genres, setGenres] = useState([]);
  const [newGenre, setNewGenre] = useState('');
  const [poster, setPoster] = useState(null);
  const [PGRating, setPGRating] = useState('');
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState({});
  const [loading, setLoading] = useState(false);
  const [openGenres, setOpenGenres] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [allGenres, setAllGenres] = useState([]);
  const [filteredGenres, setFilteredGenres] = useState([]);
  const [genreDialogOpen, setGenreDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [emptyGenreError,setEmptyGenreError] = useState('');
  const [serverError, setServerError] = useState('');
  
  const Overlay = styled(Box)({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  });

  const fetchGenres = () => {    
    fetch('http://localhost:8080/api/movies/allGenres')
    .then(response => response.json())
    .then(data => {
      setAllGenres(data);
      setFilteredGenres(data);
    })
    .catch(error => console.error("Error fetching genres:", error));
}

  useEffect(() => {
    fetchGenres();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!title || !duration || !description || !releaseDate || !director || genres.length === 0 || !PGRating) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("duration", format(duration, "HH:mm")); // Convert to HH:mm
      formData.append("description", description);
      formData.append("releaseDate", format(releaseDate, "yyyy-MM-dd")); // Convert to yyyy-MM-dd
      formData.append("director", director);
      
      genres.forEach((genre, index) => {
        formData.append('genres', genre.trim());
      });

      formData.append("poster", poster);
      formData.append("PGRating", PGRating);
      console.log(formData)
      const response = await fetch('http://localhost:8080/api/movies/addMovie', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status===400) {
        const errorData = await response.json();
        console.log('Error: ', errorData);
        setErrorMessage(errorData);
        } else if(response.status===403) {
          setServerError('Acceso denegado.')
        } 
        else {
          setServerError('Error conectándose con el servidor.')
        }
      } else {
        alert("Película agregada con éxito.");
        setTitle('');
        setDuration(null);
        setDescription('');
        setReleaseDate(null);
        setDirector('');
        setGenres([]);
        setPoster(null);
        setPGRating('');
        fetchGenres();
        setErrorMessage({});
        setServerError('');
      }
    } catch (err) {
      setError('Failed to connect to server.');
    }
    
    setLoading(false);
  };

  const handleOpenGenreDialog = () => setGenreDialogOpen(true);
  const handleCloseGenreDialog = () => {setGenreDialogOpen(false); setNewGenre('');};


  const handleFileChange = (e) => {
    const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
    if (file) setPoster(file);
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

  const handleAddGenre = (genre) => {
    if (genre) {
      if (!genres.includes(genre)) {
        setGenres([...genres, genre]);
      }
      setEmptyGenreError('');
      handleCloseGenreDialog();
    } else {
        setEmptyGenreError('El género a agregar no puede ser vacío.')
    }
  };
  

  const handleRemoveGenre = (index) => {
    setGenres(genres.filter((_, i) => i !== index));
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchTerm(query);
    setFilteredGenres(
      allGenres.filter(genre =>
        genre.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .includes(query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
      )
    );
  };
  

  const allFieldsFilled = title && duration && description && releaseDate && director && genres.length > 0 && PGRating && poster;

  return (
    <Box position="relative">
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      {loading && (
        <Overlay>
          <CircularProgress />
        </Overlay>
      )}
    <Paper sx={{ border:'2px solid #9df8fc', borderRadius:'30px', padding: '40px',maxWidth:'850px' ,flexDirection: 'column', margin: 'auto', opacity: loading ? 0.5 : 1 }}>
    
    <Box align={'center'} maxWidth={850} sx={{margin:'auto'}}>
        <Box ml={3} display={'flex'} mt={-2} mb={3}>
            <Typography variant='neonCyan' fontSize={'50px'}>Agregar película</Typography>
        </Box>
    {error && <ErrorMessage>{error}</ErrorMessage>}
      <Box sx={{paddingY: 2, display: 'flex', gap: 2, maxWidth: 800, margin: 'auto' }}>
        {/* Poster section */}
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
            <ImageIcon fontSize="large"/>
            <Typography variant="subtitle1">{poster ? poster.name : 'Arrastre o elija el archivo del poster'}</Typography>
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

        {/* Fields section */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          
          <TextField label="Título" value={title} onChange={(e) => setTitle(e.target.value)} required/>
          
          <TimeField
            label="Duración"
            value={duration}
            onChange={(newValue) => setDuration(newValue)}
            format="HH:mm"
            required
          />

            <DatePicker
                label="Fecha de estreno"
                format="dd/MM/yyyy"
                dayOfWeekFormatter={(date) => <Typography fontSize={'0.8rem'} color='#0ff0fc'>{['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].at(date.getDay())}</Typography>}
                renderInput={(params) => <TextField {...params} required />}
                value={releaseDate}
                onChange={(newValue) => setReleaseDate(newValue)}
            />

          <TextField label="Dirigida por" value={director} onChange={(e) => setDirector(e.target.value)} required />

          <Autocomplete
            options={PGRatings}
            value={PGRating}
            onChange={(e, newValue) => setPGRating(newValue)}
            renderInput={(params) => <TextField {...params} label="PG Rating" required />}
          />
        </Box>
      </Box>

      {/* Description and Genres section */}
      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 800, margin: 'auto' }}>
        <TextField
          label="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          multiline
          rows={4}
          fullWidth
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Paper onClick={() => setOpenGenres(!openGenres)}      
            sx={{
              padding: 1,
              backgroundColor: '#18181c',
              textAlign: 'center',
              borderRadius: '5px',
              border: '1px solid #e4b4e6',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.02)' },
              cursor: 'pointer',
            }}> 
            <Box display={'flex'} flexDirection={'column'}>
              <Typography>Géneros</Typography>
            </Box>
          </Paper>
          {openGenres && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 1 }}>
              {genres.map((genre, index) => (
                <Box key={index} display="flex" flexDirection={'row'} justifyContent={'space-between'} paddingX={2.2}>
                  <Typography>{genre}</Typography>
                  <IconButton onClick={() => handleRemoveGenre(index)} size="small">
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              {/* Genre Selection Dialog */}
              <Dialog open={genreDialogOpen} onClose={handleCloseGenreDialog}>
                    <DialogTitle>Seleccionar géneros</DialogTitle>
                    <DialogContent>
                      <Box paddingBottom={3}>
                      <TextField
                        label="Buscar género"
                        value={searchTerm}
                        onChange={handleSearch}
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                      </Box>
                      
                      <List sx={{ maxHeight: 300, overflowY: 'auto','&::-webkit-scrollbar': {display: 'none',}, scrollbarWidth: 'none',  }}>
                        {filteredGenres.map((genre, index) => (
                          <Paper onClick={() => handleAddGenre(genre)}      
                              sx={{
                                my: 1,
                                backgroundColor: '#18181c',
                                textAlign: 'center',
                                borderRadius: '5px',
                                border: '1px solid #e4b4e6',
                                '&:hover': { backgroundColor:'#221d24' },
                                cursor: 'pointer',
                              }}>                           
                              <ListItem key={index} button onClick={() => handleAddGenre(genre)}>
                            <ListItemText primary={genre} />
                          </ListItem>
                          </Paper>
                        ))}
                      </List>
                      <Box paddingTop={3}>
                      <TextField
                        label="Nuevo"
                        value={newGenre}
                        onChange={(e) => setNewGenre(e.target.value)}
                        fullWidth
                        error={!!emptyGenreError}
                        helperText={emptyGenreError}
                        InputProps={{
                          endAdornment: (
                            <IconButton onClick={() => handleAddGenre(newGenre)}>
                              <AddIcon />
                            </IconButton>
                          ),
                        }}
                      />
                      </Box>
                    </DialogContent>
                  </Dialog>

                  <Button variant='outlined' sx={{'&:hover': {transform: 'scale(1.01)'}}} onClick={handleOpenGenreDialog}>
                    Agregar género
                  </Button>            
            </Box>
          )}
        </Box>
        
        {serverError && <Typography color="error">{serverError}</Typography>}

        <Button variant="contained" onClick={handleSubmit} disabled={!allFieldsFilled}>Enviar</Button>
      </Box>
      </Box>
      </Paper>
    </LocalizationProvider>
    </Box>
  );
};

export default NewMovieForm;
