import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  ButtonGroup,
  Button,
  TextField,
} from '@mui/material';
import { styled } from '@mui/system';
import MovieDisplay from './MovieDisplay'; // Import the MovieDisplay component

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

  const fetchMovies = async (url, setState) => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setState(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const addOnDisplay = (movie) => {
    setMoviesOnDisplay((prev) =>
      prev.some((m) => m.id === movie.id) ? prev : [...prev, movie]
    );
  };

  const addComingSoon = (movie) => {
    setMoviesComingSoon((prev) =>
      prev.some((m) => m.id === movie.id) ? prev : [...prev, movie]
    );
  };

  const addOther = (movie) => {
    setOtherMovies((prev) =>
      prev.some((m) => m.id === movie.id) ? prev : [...prev, movie]
    );
  };

  const filteredMovies =
    filter === 'all'
      ? [...onDisplayIds, ...comingSoonIds, ...otherMoviesIds]
      : filter === 'onDisplay'
      ? onDisplayIds
      : filter === 'other'
      ? otherMoviesIds
      : comingSoonIds;

  const matchesSearch = (movie) =>
    searchTerm === '' ||
    movie?.title?.toLowerCase().includes(searchTerm.toLowerCase());

  useEffect(() => {
    fetchMovies('http://localhost:8080/api/movies/allOnDisplay', setOnDisplayIds);
    fetchMovies('http://localhost:8080/api/movies/allComingSoon', setComingSoonIds);
    fetchMovies('http://localhost:8080/api/movies/allTheRest', setOtherMoviesIds);
  }, []);

  return (
    <Box position="relative">
      {loading && (
        <Overlay>
          <CircularProgress color="primary" />
        </Overlay>
      )}

      <Box
        sx={{
          boxShadow: 'inset 0 0 18px #a805ad, 0 0 15px #a805ad, 0 0 20px #a805ad',
          borderRadius: '40px',
          border: '2px solid #e4b4e6',
          justifyContent: 'center',
          py: 5,
          px: 5,
          backgroundColor: 'rgba(0,0,0,0.3)',
          width: '85vw',
          minHeight: '65vh',
          overflowY: 'auto',
          opacity: loading ? 0.5 : 1,
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
        }}
      >
        <Box mb={1}>
          <Typography variant="neonPink" fontSize="60px">
            Películas
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={4}>
          <ButtonGroup>
            {['all', 'onDisplay', 'comingSoon', 'other'].map((key) => (
              <Button
                key={key}
                onClick={() => setFilter(key)}
                sx={{
                  color: filter === key ? '#fff' : '#aaa',
                  background: filter === key ? 'rgba(15, 15, 30, 0.95)' : 'rgba(15, 15, 30, 0.7)',
                  boxShadow:
                    filter === key
                      ? `0 0 8px #0ff0fc, 0 0 15px #0ff0fc`
                      : 'none',
                  '&:hover': {
                    background: 'rgba(20, 20, 40, 0.8)',
                    color: '#fff',
                  },
                  fontSize: 'clamp(14px, 1vw, 16px)',
                  borderRadius: '10px',
                  border: `1px solid #0ff0fc`,
                }}
              >
                {key === 'all'
                  ? 'TODO'
                  : key === 'onDisplay'
                  ? 'CARTELERA'
                  : key === 'comingSoon'
                  ? 'PRÓXIMAMENTE'
                  : 'HISTORIA'}
              </Button>
            ))}
          </ButtonGroup>

          <TextField
            variant="outlined"
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: '20vw',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              input: { color: '#fff' },
              '& .MuiOutlinedInput-root': {
                borderColor: '#0ff0fc',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0ff0fc',
              },
            }}
          />
        </Box>

        {filteredMovies.length>0 ? (

        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10, // Space between items
            }}
            >
            {(filter==='onDisplay' || filter==='all') && 
           ( moviesOnDisplay.length === onDisplayIds.length ?
            moviesOnDisplay.filter(matchesSearch).map((movie, index) => (
              <Box sx={{height:'360px', width:'240px'}}>
                  <MovieDisplay
                      onDisplay={true}
                      key={`${index}-OnDisplay-direct`}
                      movie={movie}
                      detailsOnHover={true}
                  />
              </Box>
              )) 
              
              :
               onDisplayIds.map((movie, index) => (
                <Box sx={{height:'360px', width:'240px'}}>
                    <MovieDisplay
                        onDisplay={true}
                        key={`${index}-OnDisplay-id`}
                        movieId={movie}
                        addingFunction={addOnDisplay}
                        detailsOnHover={true}
                    />
                </Box>
                ))
            
            
              )
            }
            
            {(filter==='comingSoon' || filter==='all') && 
           ( moviesComingSoon.length === comingSoonIds.length ?
            moviesComingSoon.filter(matchesSearch).map((movie, index) => (
              <Box sx={{height:'360px', width:'240px'}}>
                  <MovieDisplay
                      onDisplay={false}
                      key={`${index}-ComingSoon-direct`}
                      movie={movie}
                      detailsOnHover={true}
                  />
              </Box>
              )) 
              
              :
               comingSoonIds.map((movie, index) => (
                <Box sx={{height:'360px', width:'240px'}}>
                    <MovieDisplay
                        onDisplay={false}
                        key={`${index}-ComingSoon-id`}
                        movieId={movie}
                        addingFunction={addComingSoon}
                        detailsOnHover={true}
                    />
                </Box>
                ))
            
            
              )
            }

            {(filter==='other' || filter==='all') && 
           ( otherMovies.length === otherMoviesIds.length ?
            otherMovies.filter(matchesSearch).map((movie, index) => (
              <Box sx={{height:'360px', width:'240px'}}>
                  <MovieDisplay
                      onDisplay={null}
                      key={`${index}-other-direct`}
                      movie={movie}
                      detailsOnHover={true}
                  />
              </Box>
              )) 
              
              :
               otherMoviesIds.map((movie, index) => (
                <Box sx={{height:'360px', width:'240px'}}>
                    <MovieDisplay
                        onDisplay={null}
                        key={`${index}-other-id`}
                        movieId={movie}
                        addingFunction={addOther}
                        detailsOnHover={true}
                    />
                </Box>
                ))
            
            
              )
            }
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
      </Box>
    </Box>
  );
};

export default MoviesDisplay;
