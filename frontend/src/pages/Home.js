import background from '../assets/background.png';
import { Box, Typography } from '@mui/material';

export default function HomePage() {
  return (
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
          backgroundSize: '100vw auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Tickets Content Box */}
      <Box
        mt={30}
        ml={5}
        maxWidth={400}
        minHeight={500}
        display="flex"
        justifyContent="center"
        alignItems="top"
        sx={{
          position: 'relative',
          zIndex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          padding: 3,
          borderRadius: 5,
        }}
      >
        <Typography variant="neonCyan" fontSize={45}>Comprar entradas</Typography>
        {/* Add additional content here */}
      </Box>

      {/* Spacer to push the footer down */}
      <Box flexGrow={1} minHeight={120} />

      {/* Footer */}
      <Box
        component="footer"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          width: '100%',
          padding: 2,
          backgroundColor: '#0e0d1a',
          color: 'white',
          zIndex: 1,
        }}
      >
        <Typography variant="body2">Contact us: info@whatthefuncinema.com</Typography>
        <Typography variant="body2">Phone: +1 (123) 456-7890</Typography>
        <Typography variant="body2" mr={2}>© 2024 What The Fun Cinema</Typography>
      </Box>
    </div>
  );
}
