import React from 'react';
import { Box, Paper, Typography, useMediaQuery } from '@mui/material';
import background from '../assets/background.png'; // Update with your image path
import TicketsForm from '../components/TicketsForm';
import MovieConveyorBelt from '../components/MoviesConveyorBelt';
import Footer from '../components/Footer';
import MovieDisplay from '../components/MovieDisplay';



const HomePage = () => {
  const isSmallScreen = useMediaQuery('(max-width:1150px)');
  const isMediumScreen = false;
  const conveyorBeltHeight = isSmallScreen ? 600 : 500;
  return (
    <Box mt={-17}
    sx={{
      position: 'relative',
      minHeight: isSmallScreen ? '150vh' : isMediumScreen ? '891px' : 'calc(99vw*(1620/1920))', 
      minWidth: 'auto',
      width: 'auto',
      height:'auto',
      overflowY: 'hidden', 
      overflowX: 'hidden',
      
    }}

    >
      <Box
      sx={{
        position:'absolute',
        width:'100%',
        height:'100%',
        backgroundImage: isSmallScreen ? 'none' : `url(${background})`,
        backgroundPosition: 'top left', 
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
      >
        <Box sx={{
          display: isSmallScreen ? 'none' : '',
          width:'8.2%',
          height:'16.4%',
          marginTop:'16%',
          marginLeft:'28.7%'
        }}>
          <MovieDisplay movieId={4} onDisplay={true}></MovieDisplay>
        </Box>
        <Box sx={{
          display: isSmallScreen ? 'none' : '',
          width:'8.2%',
          height:'16.4%',
          marginTop:'-5.5%',
          marginLeft:'70%'
        }}>
          <MovieDisplay movieId={1} onDisplay={false}></MovieDisplay>
        </Box>

      </Box>
      
      <Paper
        sx={{
          position:'relative',
          marginTop: isSmallScreen ? 20 : isMediumScreen ? 'calc(1280px * (220/1920))' : 'calc(100vw * (220/1920))',
          marginRight: isSmallScreen ? 'auto' : 'none',
          marginLeft: isSmallScreen ? 'auto' : isMediumScreen ? 'calc(1280px * (40/1920))' : 'calc(100vw * (40/1920))',
          maxWidth: isSmallScreen ? '90vw' : isMediumScreen ? 'calc(1280px * (410/1920))' : 'calc(100vw * (410/1920))',
          height: isSmallScreen ? '70vh' : isMediumScreen ? 'calc(1280px * (575/1920))' : 'calc(100vw * (575/1920))',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          boxShadow: 'inset 0 0 18px #a805ad, 0 0 15px #a805ad, 0 0 20px #a805ad',
          borderRadius: '40px',
          border: `2px solid #e4b4e6`,
          }}
      >
        <TicketsForm /> 
      </Paper>
          <Box sx={{
            display:'flex',
            position:'relative', 
            width:'100%',
            height: isMediumScreen ? `calc(1280px * (${conveyorBeltHeight}/1920)/0.8)` : `calc(100vw * (${conveyorBeltHeight}/1920)/0.8)`,
            marginTop: isSmallScreen ? 10 : isMediumScreen ? 'calc(1280px  * (20/1920))' : 'calc(100vw * (20/1920))'

             }}>
              <MovieConveyorBelt itemHeightInFHD={conveyorBeltHeight-70}></MovieConveyorBelt>
          </Box>
          


    </Box>
  );
  

}
export default HomePage;