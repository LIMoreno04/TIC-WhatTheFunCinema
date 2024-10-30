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
      main: '#191331',  // Customize your primary color
    },
    secondary: {
      main: '#a805ad',  // Customize your secondary color
    },
  },
  typography: {
    fontFamily: 'Monospace, Arial',  // Customize your font family
    h1: {
      fontSize: '2.5rem',  // Customize font size for headings
    },
    
  },
  spacing: 5
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
