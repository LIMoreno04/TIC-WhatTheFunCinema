import { Box, Paper, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import InfoIcon from "@mui/icons-material/Info";

const PGRatingTooltips = {
  "G": "Para toda la familia!",
  "PG": "Se recomienda acompañamiento parental.",
  "PG-13": "Apropiado para mayores de 13 años.",
  "R": "+18. Se le permite la entrada a menores de 17 sólo bajo compañía de un adulto.",
  "NC-17": "+18. No se le permite la entrada a menores de 17 bajo ningún término.",
};

const MovieDisplay = ({ movieId }) => {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/movies/preview/${movieId}`)
      .then((response) => response.json())
      .then((data) => setMovie(data))
      .catch((error) => console.error("Error:", error));
  }, [movieId]);

  return (
    <Paper
        sx={{
            width: "300px",
            height: "450px",
            position: "relative",
            borderRadius: "15px",
            border: `3px solid #e4b4e6`,
            boxShadow: 'inset 0 0 10px #a805ad, 0 0 15px #a805ad, 0 0 20px #a805ad',
            overflow: "hidden",
            backgroundImage: movie ? `url(${movie.poster})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            cursor: "pointer",
            "&:hover": {
            transform: "scale(1.02)",
            boxShadow: 'inset 0 0 5px #a805ad, 0 0 35px #a805ad, 0 0 40px #a805ad',
            "& .movie-details": { 
                opacity: 1,
                pointerEvents: "auto",
            },
            },
        }}
        >
        {movie && (
            <>
            <Box
                className="movie-details" // Add a class to make it easier to target
                sx={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                height:'40%',
                background: "rgba(0, 0, 0, 0.8)",
                padding: "20px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                color: "white",
                opacity: 0, // Start hidden
                pointerEvents: "none", // Prevent interactions when hidden
                transition: "opacity 0.35s ease-in-out", // Smooth transition
                }}
            >
                <Typography
                variant="neonCyan"
                fontSize="2rem"
                sx={{ marginBottom: "15px" }}
                >
                {movie.title}
                </Typography>
                <Typography fontSize="1rem" sx={{ marginBottom: "5px" }}>
                Estreno: {movie.releaseDate}
                </Typography>
                <Typography fontSize="1rem" sx={{ marginBottom: "5px" }}>
                Duración: {`${parseInt(movie.duration.split(":")[0])} hr ${parseInt(movie.duration.split(":")[1])} min`}
                </Typography>
                <Box display="flex" alignItems="center">
                <Typography fontSize="1rem" sx={{ marginRight: "5px" }}>
                Restricción: {movie.PGRating}
                </Typography>
                <Tooltip sx={{fontSize:'5rem'}} title={<h2>{PGRatingTooltips[movie.PGRating]}</h2> || "Unknown"}>
                    <InfoIcon
                    sx={{
                        fontSize: "1rem",
                        color: "#ff4081",
                        cursor: "pointer",
                    }}
                    />
                </Tooltip>
                </Box>
            </Box>
            </>
        )}
        </Paper>

  );
};

export default MovieDisplay;
