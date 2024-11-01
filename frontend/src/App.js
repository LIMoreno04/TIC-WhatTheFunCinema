import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Routes, Route } from 'react-router-dom';
import ResponsiveAppBar from './components/Appbar'
import HomePage from './pages/Home'
import SignupPage from './pages/Signup'
import LoginPage from './pages/Login'
import NotFound from './pages/NotFound'
import { Box } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#a805ad', // Neon purple
      contrastText: '#0ff0fc', // Neon cyan for contrast
    },
    background: {
      default: '#191331', // Dark background
    },
  },
  typography: {
    fontFamily: 'Monospace, Arial',
    neonCyan: {
      fontFamily: 'conthrax',
      color: '#ffffff', // Neon cyan color
      textShadow: '0 0 5px #0ff0fc, 0 0 10px #0ff0fc, 0 0 15px #0ff0fc', // Cyan glow
    },
    neonPink: {
      fontFamily: 'conthrax',
      color: '#ffffff', // Neon pink color
      textShadow: '0 0 5px #ff0090, 0 0 10px #ff0090, 0 0 15px #ff0090', // Pink glow
    },
    allVariants: {
      color: '#ffffff', // Default text color
    },
    h1: { fontSize: '3.5rem' },
    button: {
      fontWeight: 'bold',
    },
    body1: { fontSize: '1rem' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '1.2rem', // Larger button font size
          fontFamily: 'monospace', // Button font family
          textTransform: 'none',
          color: '#ffffff', // White color
          textShadow: '0 0 20px #ff0090, 0 0 10px #ff0090, 0 0 10px #ff0090', // Pink glow
          '&:hover': {
            color: '#0ff0fc', // Neon cyan hover color
            textShadow: '0 0 5px #0ff0fc, 0 0 10px #0ff0fc, 0 0 15px #0ff0fc', // Neon glow for hover state
          },
          '&.Mui-disabled': {
            color: '#52566a', // Custom muted color for disabled state
            textShadow: 'none', // No glow effect on disabled state
            backgroundColor: '#2c2f41', // Distinct, darker background for disabled buttons
          },
        },
        outlinedPink: {
          fontSize: '1rem',
          fontFamily: 'monospace',
          borderRadius: '50px', // Rounded shape for outline buttons
          border: `3px solid #fc42ab`, // Neon pink outline
          boxShadow: '0 0 20px #ff0090, 0 0 10px #ff0090, 0 0 10px #ff0090', // Neon glow for button outline
          textShadow: '0 0 5px #ff0090, 0 0 5px #ff0090, 0 0 10px #ff0090',
          '&:hover': {
            color: '#ff0090', 
            textShadow: '0 0 15px #ff0090, 0 0 20px #ff0090, 0 0 10px #ff0090',
          },
          '&.Mui-disabled': {
            color: '#52566a',
            borderColor: '#52566a',
            boxShadow: 'none',
          },
        },
        outlinedCyan: {
          fontSize: '1rem',
          fontFamily: 'monospace',
          borderRadius: '50px',
          border: `3px solid #0ff0fc`, 
          boxShadow: '0 0 20px #0ff0fc, 0 0 10px #0ff0fc, 0 0 10px #0ff0fc',
          textShadow: '0 0 5px #0ff0fc, 0 0 5px #0ff0fc, 0 0 10px #0ff0fc',
          '&:hover': {
            color: '#0ff0fc', 
            textShadow: '0 0 15px #0ff0fc, 0 0 20px #0ff0fc, 0 0 10px #0ff0fc',
          },
          '&.Mui-disabled': {
            color: '#52566a',
            borderColor: '#52566a',
            boxShadow: 'none',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          transition: 'background-color 0.3s ease',
          '&.scrolled': {
            backgroundColor: '#191331', // Solid dark background on scroll
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#191331', // Dark background for Paper
          color: '#ffffff', // Text color for better contrast
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#252d3a', // Initial background color
            color: '#0ff0fc', // Neon cyan text color
            '& fieldset': {
              borderColor: '#0ff0fc', // Neon cyan border color
            },
            '&:hover fieldset': {
              borderColor: '#ff0090', // Neon pink border on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ff0090', // Neon pink border when focused
            },
            '& input:-webkit-autofill': {
              WebkitBoxShadow: '0 0 0 100px #252d3a inset', // Prevents white background on autofill
              WebkitTextFillColor: '#0ff0fc', // Keeps autofilled text in neon cyan color
            },
            '& .MuiInputLabel-root.MuiInputLabel-shrink': {
              color: '#ffffff', // Ensure the hint text color is set
            },
          },
        },
      },
    },    
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#252d3a', // Slightly lighter dark background
            color: '#0ff0fc', // Neon cyan text color
            '& fieldset': {
              borderColor: '#0ff0fc', // Neon cyan border color
            },
            '&:hover fieldset': {
              borderColor: '#ff0090', // Neon pink border on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ff0090', // Neon pink border when focused
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#ff0090', // Neon pink color for icon buttons
          textShadow: '0 0 5px #ff0090, 0 0 10px #ff0090, 0 0 15px #ff0090', // Pink glow
          '&:hover': {
            color: '#ff66c4', // Slightly lighter pink for hover state
            textShadow: '0 0 8px #ff66c4, 0 0 12px #ff66c4, 0 0 18px #ff66c4', // Enhanced glow on hover
          },
        },
      },
    },
  },
});




function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <ResponsiveAppBar/>
        <Box mt={20}>
        <Routes>
          <Route path='/home' element={<HomePage/>} ></Route>
          <Route path='/' element={<HomePage/>} ></Route>
          <Route path='/signup' element={<SignupPage/>}></Route>
          <Route path='/login' element={<LoginPage/>}></Route>


          <Route path='*' element={<NotFound/>}></Route>
        </Routes>
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default App;
