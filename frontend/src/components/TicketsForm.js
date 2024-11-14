
import { Box, Typography, useMediaQuery } from '@mui/material';

function TicketsForm(){
    const isSmallScreen = useMediaQuery('(max-width:1150px)');
    return(
    <Box
    height={'100%'}
    width={'100%'}    
    display="flex"
    paddingTop={1}
    justifyContent="center"
    alignItems="top"
    sx={{
    position: 'relative',
    zIndex: 1,
}}
    >
        <Typography
    variant="neonCyan"
    sx={{
    fontSize: isSmallScreen ? '8vw' : '40px',
    }}
    >
    Comprar entradas
    </Typography>
    {/* Add additional content here */}
    </Box>
    );

}

export default TicketsForm;