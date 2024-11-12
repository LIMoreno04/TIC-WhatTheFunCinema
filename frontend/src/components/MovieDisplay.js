import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';

const MovieDisplay = ({ movieId }) => {
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/movies/${movieId}`)
            .then((response) => response.json())
            .then((data) => setMovie(data))
            .catch((error) => console.error("Error:", error));
    }, [movieId]);

    return (
        <Box sx={{backgroundColor:'red', padding:'10px'}}>
            {movie && (
                <>
                    <h1>{movie.title}</h1>
                    <img src={movie.poster} alt={`${movie.title} Poster`} style={{width:'100%', height:'auto', objectFit:'contain'}} />
                </>
            )}
        </Box>
    );
};

export default MovieDisplay;
