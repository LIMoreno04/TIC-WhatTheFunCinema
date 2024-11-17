import React, { useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MovieDisplay from "./MovieDisplay";

const MovieConveyorBelt = () => {
  const [movieIds, setMovieIds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const glowColor = "#0ff0fc";
  const outlineColor = "#b4e2e6";
  const itemWidth = 350; // Approximate width of a single movie card
  const visibleCount = 3; // Number of movies visible at once

  const fetchMovieIds = () => {
    fetch("http://localhost:8080/api/movies/allOnDisplay")
      .then((response) => response.json())
      .then((data) => {
        setMovieIds(data);
      })
      .catch((error) => {
        console.error("Error fetching movie IDs:", error);
      });
  };

  useEffect(() => {
    fetchMovieIds();
  }, []);

  const handleLeftClick = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleRightClick = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, movieIds.length - visibleCount)
    );
  };

  return (
    <Box
      sx={{
        maxHeight:'100%',
        height:'73%',
        position: "relative", // Relative for arrow positioning
        width: "90%",
        margin: "0 auto",
        padding: "50px",
        border: `4px solid ${outlineColor}`,
        borderRadius: "50px",
        boxShadow: `inset 0 0 20px ${glowColor}, 0 0 25px ${glowColor}, 0 0 30px ${glowColor}`,
        background: "rgba(0, 0, 0, 0.8)",
        overflow: "hidden", // Hide overflowing movies
      }}
    >
      {/* Left Arrow */}
      <Box sx={{     
          height:'100%',
          display:'flex',
          flexDirection:'column',
          justifyContent:'center',
          alignItems:'center',
          backgroundColor:'rgba(0,0,0,0.7)',    
          zIndex: 2, 
          position: "absolute",
          left: 0, 
          top:0
        }}
          >
        <IconButton
          onClick={handleLeftClick}
          sx={{
            ml:'10px',
            mr:'-10px',
            color: glowColor,
            "&:hover": { color: "#c40249" },
          }}
          disabled={currentIndex == 0}
        >
          <ArrowBackIosIcon sx={{ fontSize: "3rem" }} />
        </IconButton>
      </Box>

      {/* Movie Conveyor */}
      <Box
        sx={{
          display: "flex",
          gap: "20px",
          transform: `translateX(-${currentIndex * itemWidth}px)`, // Slide horizontally
          transition: "transform 0.5s ease-in-out", // Smooth sliding animation
          width: `${movieIds.length * itemWidth}px`, // Dynamic width based on movie count
        }}
      >
        {movieIds.map((id) => (
          <Box
            key={id}
            sx={{
              flex: "0 0 auto", // Prevent resizing of items
              width: `${itemWidth}px`, // Fixed width for each movie
            }}
          >
            <MovieDisplay movieId={id} />
          </Box>
        ))}
      </Box>

      {/* Right Arrow */}
      <Box  sx={{     
          height:'100%',
          display:'flex',
          flexDirection:'column',
          justifyContent:'center',
          alignItems:'center',
          backgroundColor:'rgba(0,0,0,0.7)',    
          zIndex: 2, 
          position: "absolute",
          right: 0, 
          top:0
        }}>
        <IconButton
          onClick={handleRightClick}
          sx={{
            color: glowColor,
            "&:hover": { color: "#c40249" },
          }}
          disabled={currentIndex >= movieIds.length - visibleCount}
        >
          <ArrowForwardIosIcon sx={{ fontSize: "3rem" }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MovieConveyorBelt;
