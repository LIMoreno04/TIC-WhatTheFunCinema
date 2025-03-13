import React from 'react';
import { Box, Paper, Typography, useMediaQuery } from '@mui/material';
import background from '../assets/background.png'; // Update with your image path
import TicketsForm from '../components/TicketsForm';
import MovieConveyorBelt from '../components/MoviesConveyorBelt';
import Footer from '../components/Footer';
import MovieDisplay from '../components/MovieDisplay';
import EmployeeOptions from '../components/EmployeeOptions';
import { useEffect, useRef, useState } from "react";



const HomePage = ({ userRole, fetchRole }) => {
  const isSmallScreen = useMediaQuery("(max-width:1000px)");
  const conveyorBeltHeight = 600;
  const conveyorBeltPostersPadding = 240;

  return (
    <Box
      mt={-17}
      mb="-60px"
      sx={{
        position: 'relative',
        minHeight: isSmallScreen ? '150vh' : 'calc(99vw*(1620/1920))', 
        paddingBottom:'5vh',
        minWidth: 'auto',
        width: 'auto',
        overflowY: 'hidden', 
        overflowX: 'hidden',
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: isSmallScreen ? "100%" : 'calc(99vw*(1620/1920))',
          backgroundImage: isSmallScreen ? "none" : `url(${background})`,
          backgroundPosition: "top left",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
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
          marginTop: isSmallScreen ? 20 : 'calc(100vw * (220/1920))',
          marginRight: isSmallScreen ? 'auto' : 'none',
          marginLeft: isSmallScreen ? 'auto' : 'calc(100vw * (40/1920))',
          maxWidth: isSmallScreen ? '90vw' : 'calc(100vw * (410/1920))',
          height: isSmallScreen ? 'auto' : 'calc(100vw * (575/1920))',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          boxShadow: 'inset 0 0 18px #a805ad, 0 0 15px #a805ad, 0 0 20px #a805ad',
          borderRadius: '40px',
          border: `2px solid #e4b4e6`,
          }}
      >
        
        <>
          <div style={{ display: userRole === 'employee' ? 'none' : 'block' }}>
            <TicketsForm userRole={userRole} fetchRole={fetchRole} />
          </div>
          {userRole === 'employee' && <EmployeeOptions />}
        </>

      </Paper>
          <Box sx={{
            display:'flex',
            position:'relative', 
            width:'100%',
            height: `clamp(500px,calc(100vw * (${conveyorBeltHeight}/1920)),calc(100vw * (${conveyorBeltHeight}/1920)))`,
            marginTop: isSmallScreen ? 10 : 'calc(100vw * (20/1920))'

             }}>
              <MovieConveyorBelt itemHeightInFHD={conveyorBeltHeight} itemPadding={conveyorBeltPostersPadding}></MovieConveyorBelt>
          </Box>
          


    </Box>
  );
  

}
export default HomePage;