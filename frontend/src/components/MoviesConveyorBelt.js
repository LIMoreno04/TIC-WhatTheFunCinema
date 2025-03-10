import React, { useEffect, useState } from "react";
import { Box, Button, ButtonGroup, IconButton, Typography, useMediaQuery } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MovieDisplay from "./MovieDisplay";

const MovieConveyorBelt = ({itemHeightInFHD, itemPadding}) => {
  const [onDisplayIds, setOnDisplayIds] = useState([]);
  const [comingSoonIds, setComingSoonIds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMediumScreen = useMediaQuery('(max-width:1280px)');

  const glowColor = "#0ff0fc";
  const itemHeight = `clamp(300px, calc(100vw * (${itemHeightInFHD} - ${itemPadding})/1920), calc(100vw * (${itemHeightInFHD} - ${itemPadding})/1920))`;
  const itemWidth = `calc((2/3)*${itemHeight})`;
  const [visibleCount, setVisibleCount] = useState(0);
  const [filter, setFilter] = useState("all"); // 'all', 'onDisplay', 'comingSoon'
  const [translationAmount,setTranslationAmount] = useState(0);


  const totalMovies = filter==='onDisplay'
    ? onDisplayIds.length
    : filter==='comingSoon'
      ? comingSoonIds.length
      : onDisplayIds.length + comingSoonIds.length

  useEffect(() => {
    console.log("index: ", currentIndex);
    console.log("total movies: ", totalMovies);
    console.log("visibles: ", visibleCount);
  }, [currentIndex, totalMovies, visibleCount])

  useEffect(()=>{
    setTranslationAmount(`calc(-${currentIndex}*(${itemWidth}))`)
    console.log("aaaaaaaaaaaaaaaaaaaaa:",translationAmount)
  },[currentIndex])



  useEffect(() => {
    const updateVisibleCount = () => {
      const viewportWidth = window.innerWidth;

      // Compute item height similar to CSS clamp: choose the candidate value, but not less than 300px.
      const candidateHeight = (viewportWidth * (itemHeightInFHD - itemPadding)) / 1920;
      const computedItemHeight = Math.max(300, candidateHeight);

      // Compute item width as 2/3 of the computed height.
      const computedItemWidth = (2 / 3) * computedItemHeight;

      // Compute the spacing from clamp(25px, 4vw, 4vw):
      // 4vw in pixels is (viewportWidth * 0.04). Ensure it is at least 25px.
      const spacing = Math.max(30, viewportWidth * 0.045);

      // Calculate visible count:
      const count = (0.95 * viewportWidth) / (spacing + computedItemWidth);
      
      // Optionally round down if you want a whole number of items.
      setVisibleCount(Math.floor(count));

      console.log("visible count updated: ", Math.floor(count));
    };

    // Run on mount and add resize listener.
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, [itemHeightInFHD, itemPadding]);
  
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
    setCurrentIndex((prevIndex) => Math.max(prevIndex - Math.ceil(visibleCount/2), 0));
  };

  const handleRightClick = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + Math.ceil(visibleCount/2), totalMovies - Math.floor(visibleCount))
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
            transform: `translateX(${translationAmount})`, // Slide horizontally
            transition: "transform 0.5s ease-in-out", // Smooth sliding animation
            width: `calc((${totalMovies} - 1)*clamp(25px,4vw,4vw) + ${totalMovies}*(2/3)*${itemHeight})`, // Dynamic width based on movie count
          }}
        >
          { filter!='comingSoon' && (
          onDisplayIds.map((id) => (
            <Box 
            key={`onDisplay-${id}`}
            sx={{
              marginTop:'clamp(-1vw,-1vw,-15px)',
              display:'flex',
              flexDirection:'column',
              justifyContent:'center',
              alignItems:'center',
              gap:'clamp(5px,0.5vw,0.5vw)'
            }}>
              <Typography gutterBottom fontFamily={'InfinityRegular'} fontSize={'clamp(23px,1.4vw,1.4vw)'} variant="neonCyan">
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
            <Box 
            key={`comingSoon-${id}`}
            sx={{
              marginTop:'clamp(-1vw,-1vw,-15px)',
              display:'flex',
              flexDirection:'column',
              justifyContent:'center',
              alignItems:'center',
              gap:'clamp(5px,0.5vw,0.5vw)'
            }}>
              <Typography gutterBottom fontFamily={'InfinityRegular'} fontSize={'clamp(23px,1.4vw,1.4vw)'} variant="neonPink">
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
            disabled={currentIndex >= totalMovies - Math.floor(visibleCount)}
          >
            <ArrowForwardIosIcon sx={{ fontSize: "3rem" }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default MovieConveyorBelt;
