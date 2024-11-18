import { Box, Button, Typography, useMediaQuery } from "@mui/material";

const EmployeeOptions = () => {
    const isSmallScreen = useMediaQuery('(max-width:1150px)');

    return (
        <Box
        sx={{
          boxSizing:'border-box',
          padding: isSmallScreen ? '30px' : '1.5vw', width: "100%",
          display:'flex',
          flexDirection:'column',
          alignItems:'center', 
          overflowY:'auto', 
          height:'100%',
          }}>
    
    
          <Typography
              variant="neonCyan"
              sx={{
                marginBottom: isSmallScreen ? '20px' : '1vw',
                fontSize: isSmallScreen ? 'clamp(20px,8vw,40px)' : '2vw',
              }}
              >
                Opciones de admin
          </Typography>

          <Button href="/addScreening" variant="outlined" sx={{
            fontSize: '1vw',
            height:'3vw', 
            marginBottom:'1vw', width:'95%'
          }}>
            Agregar una función
          </Button>
    
          
        </Box>
  );
};

export default EmployeeOptions;