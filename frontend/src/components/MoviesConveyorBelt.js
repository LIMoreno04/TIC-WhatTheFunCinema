import React, { useEffect, useState } from "react";
import { Box, Button, ButtonGroup, IconButton, Typography, useMediaQuery } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MovieDisplay from "./MovieDisplay";

const MovieConveyorBelt = ({itemHeightInFHD}) => {
  const isSmallScreen = useMediaQuery('(max-width:1150px)');
  const isMediumScreen = useMediaQuery('(max-width:1280px)');
  const [onDisplayIds, setOnDisplayIds] = useState([]);
  const [comingSoonIds, setComingSoonIds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const glowColor = "#0ff0fc";
  const itemHeight = isMediumScreen ? `calc(1280px  * (${itemHeightInFHD}/1920) - clamp(40px,3vw,3vw))` : `calc(100vw * (${itemHeightInFHD}/1920) - clamp(40px,3vw,3vw))`;
  const [visibleCount, setVisibleCount] = useState(0);
  const [filter, setFilter] = useState("all"); // 'all', 'onDisplay', 'comingSoon'

  const totalMovies = filter==='onDisplay' ? onDisplayIds.length : filter==='comingSoon' ? comingSoonIds.length : onDisplayIds.length + comingSoonIds.length


  useEffect(() => {
    const calculateItemHeight = () => {
      const tempDiv = document.createElement('div');
      tempDiv.style.height = isMediumScreen
        ? 'calc(1280px * (400/1920) - clamp(40px,3vw,3vw))'
        : 'calc(100vw * (400/1920) - clamp(40px,3vw,3vw))';
      document.body.appendChild(tempDiv);
      const resolvedHeight = parseFloat(window.getComputedStyle(tempDiv).height);
      document.body.removeChild(tempDiv);
      return resolvedHeight;
    };

    const calculateClampValue = () => {
      const tempDiv = document.createElement('div');
      tempDiv.style.height = 'clamp(25px, 2vw, 2vw)';
      document.body.appendChild(tempDiv);
      const resolvedClamp = parseFloat(window.getComputedStyle(tempDiv).height);
      document.body.removeChild(tempDiv);
      return resolvedClamp;
    };

    const updateVisibleCount = () => {
      const itemHeight = calculateItemHeight();
      const clampValue = calculateClampValue();
      const containerWidth = window.innerWidth * 0.95; // 95vw
      
      const calculatedCount = containerWidth / ((2 / 3) * itemHeight + clampValue);
      setVisibleCount(Math.floor(calculatedCount));
    };

    // Initial calculation
    updateVisibleCount();

    // Recalculate on resize
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, [isMediumScreen]);

  
  const fetchOnDisplayIds = () => {
    fetch("http://localhost:8080/api/movies/allOnDisplay")
      .then((response) => response.json())
      .then((data) => {
        setOnDisplayIds(data);
      })
      .catch((error) => {
        console.error("Error fetching on display IDs:", error);
      });
  };

  const fetchComingSoonIds = () => {
    fetch("http://localhost:8080/api/movies/allComingSoon")
      .then((response) => response.json())
      .then((data) => {
        setComingSoonIds(data);
      })
      .catch((error) => {
        console.error("Error fetching coming soon IDs:", error);
      });
  };


  useEffect(() => {
    fetchOnDisplayIds();
    fetchComingSoonIds();
  }, []);

  const handleLeftClick = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 3, 0));
  };

  const handleRightClick = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 3, totalMovies - Math.floor(visibleCount) + 1)
    );
  };


  return (
    <Box sx={{
      paddingTop:2,
      gap:3,
      display:'flex',
      flexDirection:'column',
      maxHeight:'inherit',
      height:'100%',
      width:'100%',
    }}>
      <Box sx={{position:'relative', marginLeft:'4vw'}}>
      <ButtonGroup>
            {["all", "onDisplay", "comingSoon"].map((key) => (
              <Button
                key={key}
                onClick={() => {setFilter(key); setCurrentIndex(0)}}
                sx={{
                  color: filter === key ? "#fff" : "#aaa",
                  background: filter === key ? "rgba(15, 15, 30, 0.95)" : "rgba(15, 15, 30, 0.7)",
                  boxShadow:
                    filter === key
                      ? `0 0 8px ${glowColor}, 0 0 15px ${glowColor}`
                      : "none",
                  "&:hover": {
                    background: "rgba(20, 20, 40, 0.8)",
                    color: "#fff",
                  },
                  fontSize: "clamp(14px, 1vw, 16px)",
                  fontFamily: "InfinityRegular",
                  borderRadius: "10px",
                  border: `1px solid ${glowColor}`,
                }}
              >
                {key === "all"
                  ? "TODO"
                  : key === "onDisplay"
                  ? "CARTELERA"
                  : "PRÓXIMAMENTE"}
              </Button>
            ))}
          </ButtonGroup>
          </Box>

      <Box
      className='conveyorBelt'
        sx={{
          alignSelf:'center',
          maxHeight:'inherit',
          height:'80%',
          position: "relative", // Relative for arrow positioning
          width: "96%",
          paddingBottom: "clamp(15px,1vw,1vw)",
          paddingX:'clamp(60px,4vw,4vw)',
          boxSizing:'border-box',
          boxShadow: 'inset 0 0 18px #a805ad, 0 0 15px #a805ad, 0 0 20px #a805ad',
          borderRadius: '40px',
          border: `2px solid #e4b4e6`,
          background: "rgba(0, 0, 15, 0.7)",
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
            backgroundColor:'rgba(100,0,100,0.5)',    
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
            height:'100%',
            display: "flex",
            alignItems:'center',
            gap:'clamp(25px,4vw,4vw)',
            transform: `translateX(calc(-${currentIndex}*(2/3)*${itemHeight}))`, // Slide horizontally
            transition: "transform 0.5s ease-in-out", // Smooth sliding animation
            width: `calc((${totalMovies} - 1)*clamp(25px,4vw,4vw) + ${totalMovies}*(2/3)*${itemHeight})`, // Dynamic width based on movie count
          }}
        >
          { filter!='comingSoon' && (
          onDisplayIds.map((id) => (
            <Box sx={{
              marginTop:'clamp(-1vw,-1vw,-15px)',
              display:'flex',
              flexDirection:'column',
              justifyContent:'center',
              alignItems:'center',
              gap:'clamp(5px,0.5vw,0.5vw)'
            }}>
              <Typography gutterBottom fontFamily={'InfinityRegular'} fontSize={'clamp(20px,1.4vw,1.4vw)'} variant="neonCyan">
                EN CARTELERA
              </Typography>
              <Box
                key={id}
                sx={{
                  flex: "0 0 auto", // Prevent resizing of items
                  height: itemHeight,
                  width: `calc((2/3)*${itemHeight})`
                }}
              >
                <MovieDisplay movieId={id} onDisplay={true} detailsOnHover={true}/>
              </Box>
            </Box>
          )))
        }
          { filter!='onDisplay' && (
          comingSoonIds.map((id) => (
            <Box sx={{
              marginTop:'clamp(-1vw,-1vw,-15px)',
              display:'flex',
              flexDirection:'column',
              justifyContent:'center',
              alignItems:'center',
              gap:'clamp(5px,0.5vw,0.5vw)'
            }}>
              <Typography gutterBottom fontFamily={'InfinityRegular'} fontSize={'clamp(20px,1.4vw,1.4vw)'} variant="neonPink">
                PRÓXIMAMENTE
              </Typography>
              <Box
                key={id}
                sx={{
                  flex: "0 0 auto", // Prevent resizing of items
                  height: itemHeight,
                  width: `calc((2/3)*${itemHeight})`
                }}
              >
                <MovieDisplay movieId={id} onDisplay={false} detailsOnHover={true}/>
              </Box>
            </Box>
          )))
        }

        </Box>

        {/* Right Arrow */}
        <Box  sx={{     
            height:'100%',
            display:'flex',
            flexDirection:'column',
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:'rgba(100,0,100,0.5)',    
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
            disabled={currentIndex >= totalMovies - Math.floor(visibleCount)+1}
          >
            <ArrowForwardIosIcon sx={{ fontSize: "3rem" }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default MovieConveyorBelt;
