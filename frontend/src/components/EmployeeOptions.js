import { Box, Button, Typography, useMediaQuery } from "@mui/material";

const EmployeeOptions = () => {
    const isSmallScreen = useMediaQuery('(max-width:1000px)');

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
            border:'2px solid #0ff0fc',
            fontSize: isSmallScreen ? 'clamp(10px,5vw,20px)' : '1vw',
            height: isSmallScreen ? '15%' : '3vw', 
            marginBottom:'1vw', width:'95%'
          }}>
            Agregar una función
          </Button>
          <Button href="/addMovie" variant="outlined" sx={{
            border:'2px solid #0ff0fc',
            fontSize: isSmallScreen ? 'clamp(10px,5vw,20px)' : '1vw',
            height: isSmallScreen ? '15%' : '3vw', 
            marginBottom:'1vw', width:'95%'
          }}>
            Agregar una película
          </Button>
          <Button href="/addSnack" variant="outlined" sx={{
            border:'2px solid #0ff0fc',
            fontSize: isSmallScreen ? 'clamp(10px,5vw,20px)' : '1vw',
            height: isSmallScreen ? '15%' : '3vw', 
            marginBottom:'1vw', width:'95%'
          }}>
            Agregar una snack
          </Button>
          <Button href="/addTheatre" variant="outlined" sx={{
            border:'2px solid #0ff0fc',
            fontSize: isSmallScreen ? 'clamp(10px,5vw,20px)' : '1vw',
            height: isSmallScreen ? '15%' : '3vw',  
            marginBottom:'1vw', width:'95%'
          }}>
            Agregar una sucursal
          </Button>
          <Button href="/addEmployee" variant="outlined" sx={{
            border:'2px solid #0ff0fc',
            fontSize: isSmallScreen ? 'clamp(10px,5vw,20px)' : '1vw',
            height: isSmallScreen ? '15%' : '3vw',  
            marginBottom:'1vw', width:'95%'
          }}>
            Agregar un empleado
          </Button>
          
        </Box>
  );
};

export default EmployeeOptions;