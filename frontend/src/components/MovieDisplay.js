import { Box, CircularProgress, Paper, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import { format, parseISO } from "date-fns";

const PGRatingTooltips = {
  G: "Para toda la familia!",
  PG: "Se recomienda acompañamiento parental.",
  "PG-13": "Apropiado para mayores de 13 años.",
  R: "+18. Se le permite la entrada a menores de 17 sólo bajo compañía de un adulto.",
  "NC-17": "+18. No se le permite la entrada a menores de 17 bajo ningún término.",
};

const MovieDisplay = ({ movieId, movie: propMovie, onDisplay }) => {
  const [movie, setMovie] = useState(propMovie || null);
  const [loading, setLoading] = useState(!propMovie); // Skip loading if movie is provided.
  const [detailsDisplay, setDetailsDisplay] = useState("none");

  const fetchMovie = () => {
    setLoading(true);
    fetch(`http://localhost:8080/api/movies/preview/${movieId}`)
      .then((response) => response.json())
      .then((data) => {
        setMovie(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!propMovie && movieId) {
      // Fetch movie only if propMovie is not provided
      setMovie(null);
      setDetailsDisplay("none");
      fetchMovie();
    }
  }, [movieId, propMovie]);

  useEffect(() => {
    if (!loading && movie) {
      const timeoutId = setTimeout(() => {
        setDetailsDisplay("flex");
      }, 1);

      return () => clearTimeout(timeoutId); // Cleanup timeout if component unmounts or loading state changes.
    }
  }, [loading, movie]);

  const glowColor =
    onDisplay === true
      ? "#0ff0fc"
      : onDisplay === false
      ? "#c40249"
      : "#a805ad";

  const outlineColor =
    onDisplay === true
      ? "#b4e2e6"
      : onDisplay === false
      ? "#e6b4d4"
      : "#e4b4e6";

  return (
    <Paper
      sx={{
        aspectRatio: '2/3',
        maxHeight: "100%",
        position: "relative",
        borderRadius: "15px",
        border: `4px solid ${outlineColor}`,
        boxShadow: `inset 0 0 20px ${glowColor}, 0 0 25px ${glowColor}, 0 0 30px ${glowColor}`,
        overflow: "hidden",
        backgroundImage: movie ? `url(${movie.poster})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        cursor: "pointer",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: `inset 0 0 30px ${glowColor}, 0 0 45px ${glowColor}, 0 0 40px ${glowColor}`,
          "& .movie-details": {
            opacity: 1,
            visibility: "visible",
            pointerEvents: "auto",
          },
        },
      }}
    >
      {loading ? (
        <Box>
          <CircularProgress sx={{ color: glowColor }} />
          <Typography
            sx={{ color: outlineColor, marginTop: "15px", fontSize: "1rem" }}
          >
            Cargando película...
          </Typography>
        </Box>
      ) : (
        movie && (
          <>
            <Box
              className="movie-details"
              sx={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                height: "40%",
                background: "rgba(0, 0, 0, 0.8)",
                padding: "20px",
                boxSizing: "border-box",
                display: detailsDisplay,
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                color: "white",
                opacity: 0,
                visibility: "hidden",
                pointerEvents: "none",
                transition: "opacity 0.35s ease-in-out, visibility 0.35s ease-in-out",
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
                Estreno: {format(parseISO(movie.releaseDate), "dd/MM/yyyy")}
              </Typography>
              <Typography fontSize="1rem" sx={{ marginBottom: "5px" }}>
                Duración:{" "}
                {`${parseInt(movie.duration.split(":")[0])} hr ${parseInt(
                  movie.duration.split(":")[1]
                )} min`}
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography fontSize="1rem" sx={{ marginRight: "5px" }}>
                  Restricción: {movie.PGRating}
                </Typography>
                <Tooltip
                  sx={{ fontSize: "5rem" }}
                  title={
                    <h2>{PGRatingTooltips[movie.PGRating]}</h2> || "Unknown"
                  }
                >
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
        )
      )}
    </Paper>
  );
};

export default MovieDisplay;
