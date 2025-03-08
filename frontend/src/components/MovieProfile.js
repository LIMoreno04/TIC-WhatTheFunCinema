import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Chip,
  Tooltip,
} from '@mui/material';
import InfoIcon from "@mui/icons-material/Info";
import { styled } from '@mui/system';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import ScreeningsBox from './ScreeningsBox';

const PGRatingTooltips = {
    G: "Para toda la familia!",
    PG: "Se recomienda acompañamiento parental.",
    "PG-13": "Apropiado para mayores de 13 años.",
    R: "+18. Se le permite la entrada a menores de 17 sólo bajo compañía de un adulto.",
    "NC-17": "+18. No se le permite la entrada a menores de 17 bajo ningún término.",
  };

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

const MovieProfile = () => {
  const {id} = useParams()  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMovie = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/movies/${id}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      setMovie(data);
    } catch (error) {
      console.error('Error fetching movie:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <Overlay>
        <CircularProgress color="primary" />
      </Overlay>
    );
  }

  if (!movie) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <Typography variant="neonPink" fontSize={'3rem'}>Ups... Parece que no tenemos la película que buscabas!</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: 7,
        margin: 'auto',
        width: '70vw',
        maxWidth: '1200px',
        minHeight:'600px',
        boxShadow: 'inset 0 0 30px #a805ad, 0 0 25px #a805ad, 0 0 35px #a805ad',
        borderRadius: '40px',
        border: `4px solid #e4b4e6`,
        backgroundColor: 'rgba(0,0,0,0.8)',
      }}
    >
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4} sx={{minHeight:'600px'}}>
        {/* Movie Poster */}
        <Box
          sx={{
            flexGrow:1,
            width: '100%',
            maxWidth: { xs: '100%', md: '40%' },
            height: 0,
            paddingTop: 'calc(100% * (2/3))', // Adjust the aspect ratio if necessary (150% is for a 2:3 ratio).
            borderRadius: '20px',
            border: '2px solid #9df8fc', 
            boxShadow: `
              inset 0 0 15px #0ff0fc,   
              0 0 15px #0ff0fc,         
              0 0 5px #0ff0fc`,
            backgroundImage: `url(${movie.poster})`,
            backgroundSize: 'cover', // Ensures the image covers the area.
            backgroundPosition: 'center', // Centers the image.
            backgroundRepeat: 'no-repeat', // Prevents tiling of the image.
          }}
          alt={`${movie.title} Poster`}
        ></Box>


        {/* Movie Details */}
        <Box flex={1} sx={{display:'flex',flexDirection:'column'}}>
          <Typography variant="neonPink" fontSize={'4rem'} sx={{ marginBottom: 2 }} className="neonPink">
            {movie.title}
          </Typography>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            <strong>Dirigido por:</strong> {movie.director}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            <strong>Duración:</strong> {`${parseInt(movie.duration.split(":")[0])} hr ${parseInt(movie.duration.split(":")[1])} min`}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            <strong>Fecha de estreno:</strong> {format(new Date(movie.releaseDate),'dd/MM/yyyy')}
          </Typography>
          <Box display={'flex'} marginBottom={2} flexDirection={'row'} alignItems={'center'} justifyContent={'left'} gap={1}>
            <Typography variant="body1">
                <strong>Restricción de edad:</strong> {movie.PGRating}
            </Typography>
            <Tooltip
                    title={
                        <h3>{PGRatingTooltips[movie.PGRating]}</h3> || "Unknown"
                    }
                    >
                    <InfoIcon
                        sx={{
                        fontSize: "clamp(10px,110%,110%)",
                        color: "#ff4081",
                        cursor: "pointer",
                        }}
                    />
                </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 2 }}>
            {movie.genres.map((genre, index) => (
              <Chip
                key={index}
                label={genre}
                sx={{
                  alignContent:'center',
                  alignItems:'center',
                  justifyContent:'center',
                  backgroundColor: '#252d3a',
                  color: '#0ff0fc',
                  border: '2px solid #0ff0fc',
                  boxShadow: 'inset 0 0 5px #0ff0fc,0 0 5px #0ff0fc, 0 0 10px #0ff0fc',
                }}
              />
            ))}
          </Box>
          <Box sx={{
            mt:5,
            padding:'20px',
            borderRadius: '20px',
            border: '2px solid #9df8fc', 
            boxShadow: `
              inset 0 0 15px #0ff0fc,   
              0 0 15px #0ff0fc,         
              0 0 5px #0ff0fc`,
          }}>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
                {movie.description}
            </Typography>
          </Box>
          
          <Box
          sx={{
            position:'relative',
            mt: 5,
            flexGrow: 1, // Make the box take up the remaining space in the parent
            overflowY: 'auto', // Allow scrolling for overflow content
            borderRadius: '10px',
            border: '2px solid #9df8fc',
            boxShadow: `
              inset 0 0 15px #0ff0fc,
              0 0 15px #0ff0fc,
              0 0 5px #0ff0fc`,
            display: 'flex', // Ensure flexible layout
            flexDirection: 'column', // Maintain proper layout for children
          }}
        >
          <ScreeningsBox movieId={id} />
        </Box>


        </Box>
      </Box>
    </Box>
  );
};

export default MovieProfile;
