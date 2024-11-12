import background from '../assets/background.png';
import { Box, Typography, useMediaQuery } from '@mui/material';

export default function HomePage() {
  // Media query for small screens
  const isSmallScreen = useMediaQuery('(max-width:900px)');

  return (
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
      {/* Background Image */}
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

      {/* Tickets Content Box */}
      <Box
        mt={isSmallScreen ? '41vh' : '25vh'}  // Center vertically on small screens
        ml={isSmallScreen ? 'auto' : '2vw'}   // Center horizontally on small screens
        mr={isSmallScreen ? 'auto' : 0}
        maxWidth={isSmallScreen ? '80vw' : '20vw'}  // Width is more flexible on small screens
        minHeight="60vh"
        display="flex"
        justifyContent="center"
        alignItems="top"
        sx={{
          position: 'relative',
          zIndex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          padding: '3vh',
          borderRadius: '2vw',
        }}
      >
              <Typography
        variant="h1"
        sx={{
          fontFamily: 'InfinityRegular',
          fontSize: isSmallScreen ? '8vw' : '2vw',
          color: '#f7bedf', // Neon pink text color
          textShadow: '0 0 5px #ff0090, 0 0 10px #ff0090, 0 0 15px #ff0090',
        }}
      >
          Comprar entradas
        </Typography>
        {/* Add additional content here */}
      </Box>

      {/* Spacer to push the footer down */}
      <Box flexGrow={1} minHeight="10vh" />

      {/* Footer */}
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
  );
}
