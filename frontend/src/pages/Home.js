import React from 'react';
import { Box, Paper, useMediaQuery } from '@mui/material';
import background from '../assets/background.png'; // Update with your image path
import TicketsForm from '../components/TicketsForm';



const HomePage = () => {
  const isSmallScreen = useMediaQuery('(max-width:1150px)');
  return (
    <Box mt={-17}
    sx={{
      position: 'relative',
      minHeight: isSmallScreen ? '150vh' : '1500px', 
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

      </Box>
      <Paper
        sx={{
          position:'relative',
          marginTop: isSmallScreen ? 20 : 25,
          marginRight: isSmallScreen ? 'auto' : 'none',
          marginLeft: isSmallScreen ? 'auto' : 5,
          padding:'10px',
          width: isSmallScreen ? '90vw' : '410px',
          height: isSmallScreen ? '70vh' : '530px',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          boxShadow: 'inset 0 0 18px #a805ad, 0 0 15px #a805ad, 0 0 20px #a805ad',
          borderRadius: '40px',
          border: `2px solid #e4b4e6`,
          }}
      >
        <TicketsForm />
      </Paper>



    </Box>
  );
  
  
  /*
    <Box mt={-17}>
    <div
      style={{
        position: 'relative',
        minHeight: '127vh',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover', 
          backgroundPosition: isSmallScreen ? 'top left 56%' : 'top center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <Box     
      mt={isSmallScreen ? '41vh' : '17vh'}  // Center vertically on small screens
      ml={isSmallScreen ? 'auto' : '2vw'}   // Center horizontally on small screens
      mr={isSmallScreen ? 'auto' : 0}>     
      
        <TicketsBox></TicketsBox>
      
      </Box>
      <Box flexGrow={1} minHeight="10vh" />

      <Box
        component="footer"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          width: '100%',
          padding: '2vh 4vw',
          backgroundColor: '#0e0d1a',
          color: 'white',
          zIndex: 1,
          flexDirection: isSmallScreen ? 'column' : 'row', // Stack vertically on small screens
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" fontSize={isSmallScreen ? '3vw' : '1vw'}>
          Contact us: info@whatthefuncinema.com
        </Typography>
        <Typography variant="body2" fontSize={isSmallScreen ? '3vw' : '1vw'}>
          Phone: +1 (123) 456-7890
        </Typography>
        <Typography variant="body2" fontSize={isSmallScreen ? '3vw' : '1vw'} mr={isSmallScreen ? 0 : '2vw'}>
          © 2024 What The Fun Cinema
        </Typography>
      </Box>
    </div>
    </Box>
      */

}
export default HomePage;