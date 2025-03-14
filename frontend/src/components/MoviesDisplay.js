import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  ButtonGroup,
  Button,
  TextField,
} from '@mui/material';
import { styled, useMediaQuery } from '@mui/system';
import MovieDisplay from './MovieDisplay';

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

const StyledContainer = styled(Box)({
  boxShadow: 'inset 0 0 18px #a805ad, 0 0 15px #a805ad, 0 0 20px #a805ad',
  borderRadius: '40px',
  border: '2px solid #e4b4e6',
  justifyContent: 'center',
  padding: '5vh 5vw',
  backgroundColor: 'rgba(0,0,0,0.3)',
  width: '80vw',
  minWidth: '445px',
  minHeight: '65vh',
  overflowY: 'auto',
  '&::-webkit-scrollbar': { display: 'none' },
  scrollbarWidth: 'none',
});

const buttonStyles = (isActive) => ({
  color: isActive ? '#fff' : '#aaa',
  background: isActive ? 'rgba(15, 15, 30, 0.95)' : 'rgba(15, 15, 30, 0.7)',
  boxShadow: isActive ? '0 0 8px #0ff0fc, 0 0 15px #0ff0fc' : 'none',
  '&:hover': { background: 'rgba(20, 20, 40, 0.8)', color: '#fff' },
  fontSize: 'clamp(14px, 1vw, 16px)',
  borderRadius: '10px',
  border: '1px solid #0ff0fc',
});

const textFieldStyles = {
  width: '20vw',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  input: { color: '#fff' },
  '& .MuiOutlinedInput-root': { borderColor: '#0ff0fc' },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#0ff0fc' },
};


const MoviesDisplay = () => {
  const [onDisplayIds, setOnDisplayIds] = useState([]);
  const [comingSoonIds, setComingSoonIds] = useState([]);
  const [otherMoviesIds, setOtherMoviesIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [moviesOnDisplay, setMoviesOnDisplay] = useState([]);
  const [moviesComingSoon, setMoviesComingSoon] = useState([]);
  const [otherMovies, setOtherMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const isSmallScreen = useMediaQuery('(max-width:1000px)');
  const isMediumScreen = useMediaQuery('(max-width:1650px)');
  
  const moviesPerRow = isSmallScreen ? 3 : isMediumScreen ? 4 : 5
  
  const movieBoxStyle = {
    height: `calc(((clamp(440px,80vw,80vw) - (${moviesPerRow} - 1)*5vw) / ${moviesPerRow})) * 1.5)`,
    width: `calc(((clamp(440px,80vw,80vw) - (${moviesPerRow} - 1)*5vw) / ${moviesPerRow}))`,
  };


  useEffect(() => {
    fetchMovies('http://localhost:8080/api/movies/allOnDisplay', setOnDisplayIds);
    fetchMovies('http://localhost:8080/api/movies/allComingSoon', setComingSoonIds);
    fetchMovies('http://localhost:8080/api/movies/allTheRest', setOtherMoviesIds);
  }, []);

  useEffect(() => {
    console.log('moviesOnDisplay:', moviesOnDisplay);
    console.log('onDisplayIds:', onDisplayIds);
  }, [moviesOnDisplay, onDisplayIds]);
  

  const fetchMovies = async (url, setState) => {
    setLoading(true);
    try {
      const response = await fetch(url, { method: 'GET', credentials: 'include' });
      if (!response.ok) throw new Error('Network response was not ok');
      setState(await response.json());
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMovie = (setState) => (movie) =>
    setState((prev) => (prev.some((m) => m.id === movie.id) ? prev : [...prev, movie]));

  const movieLists = [
    { key: 'onDisplay', ids: onDisplayIds, movies: moviesOnDisplay, add: addMovie(setMoviesOnDisplay) },
    { key: 'comingSoon', ids: comingSoonIds, movies: moviesComingSoon, add: addMovie(setMoviesComingSoon) },
    { key: 'other', ids: otherMoviesIds, movies: otherMovies, add: addMovie(setOtherMovies) },
  ];

  const matchesSearch = (movie) => searchTerm === '' || movie?.title?.toLowerCase().includes(searchTerm.toLowerCase());

  const filteredMovies =
    filter === 'all' ? [...onDisplayIds, ...comingSoonIds, ...otherMoviesIds] : movieLists.find((m) => m.key === filter)?.ids || [];

  return (
    <Box position="relative">
      {loading && (
        <Overlay>
          <CircularProgress color="primary" />
        </Overlay>
      )}

      <StyledContainer sx={{ opacity: loading ? 0.5 : 1 }}>
        <Typography variant="neonPink" fontSize="60px" mb={1}>
          Películas
        </Typography>

        <Box display="flex" justifyContent="space-between" mb={4}>
          <ButtonGroup>
            {['all', 'onDisplay', 'comingSoon', 'other'].map((key) => (
              <Button key={key} onClick={() => setFilter(key)} sx={buttonStyles(filter === key)}>
                {{
                  all: 'TODO',
                  onDisplay: 'CARTELERA',
                  comingSoon: 'PRÓXIMAMENTE',
                  other: 'HISTORIA',
                }[key]}
              </Button>
            ))}
          </ButtonGroup>

          <TextField variant="outlined" placeholder="Buscar por título..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={textFieldStyles} />
        </Box>

        {filteredMovies.length > 0 ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5vw' }}>
            {movieLists
              .filter(({ key }) => filter === 'all' || filter === key)
              .map(({ key, ids, movies, add }) =>
                movies.length === ids.length
                  ? movies.filter(matchesSearch).map((movie, index) => (
                      <Box key={`${index}-${key}-direct`} sx={movieBoxStyle}>
                        <MovieDisplay onDisplay={key === 'onDisplay' ? true : key === 'comingSoon' ? false : null} movie={movie} detailsOnHover />
                      </Box>
                    ))
                  : ids.map((movie, index) => (
                      <Box key={`${index}-${key}-id`} sx={movieBoxStyle}>
                        <MovieDisplay
                          onDisplay={key === 'onDisplay' ? true : key === 'comingSoon' ? false : null}
                          movieId={movie}
                          addToCategory={add}
                          detailsOnHover
                        />
                      </Box>
                    ))
              )}
          </Box>
        ) : (
          !loading && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Typography variant="neonCyan" fontSize="1.8vh" align="center">
                No hay películas disponibles en esta categoría.
              </Typography>
            </Box>
          )
        )}
      </StyledContainer>
    </Box>
  );
};

export default MoviesDisplay;
