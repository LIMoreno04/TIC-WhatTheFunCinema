import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import { Routes, Route, useLocation } from 'react-router-dom';
import ResponsiveAppBar from './components/Appbar';
import HomePage from './pages/Home';
import SignupPage from './pages/Signup';
import LoginPage from './pages/Login';
import NotFound from './pages/NotFound';
import MoviesPage from './pages/Movies';
import MyAccountPage from './pages/Account';
import neonTheme from './assets/Theme';
import AddEmployeePage from './pages/AddEmployee';
import NewTheatrePage from './pages/AddTheatre';
import { useEffect, useState } from 'react';
import TheatresPage from './pages/Theatres';
import NewMoviePage from './pages/AddMovie';
import { Box } from '@mui/material';
import AddScreeningPage from './pages/AddScreening';
import NewSnackPage from './pages/AddSnack';
import MoviePage from './pages/SingleMoviePage';
import Footer from './components/Footer';
import MakeReservationPage from './components/TicketsForm';
import ShowsnackPage from './pages/ShowsnackPage';
import PurchaseHistory from './pages/PurchaseHistory';


function App() {
  const location = useLocation();
  const [userRole, setUserRole] = useState('notLoggedIn');

  const fetchRole = () => {
    fetch('http://localhost:8080/api/user/role', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.text(); // Expecting a string response for the role
      })
      .then((role) => setUserRole(role))
      .catch((error) => console.error('Error fetching user role:', error));
  };

  useEffect(() => {
    fetchRole();
    if(!userRole) {setUserRole('notLoggedIn')};
  }, []);

  return (
    <ThemeProvider theme={neonTheme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <ResponsiveAppBar userRole={userRole} onUpdate={fetchRole} />
        <Box
          component="main"
          sx={{
            flex: 1,
            pt: 'clamp(90px,11vh,11vh)',
          }}
        >
          <Routes>
            <Route path='/home' element={<HomePage userRole={userRole} />} /> 
            <Route path='/' element={<HomePage />} />
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/movies' element={<MoviesPage />} />
            <Route path='/account' element={<MyAccountPage userRole={userRole} />} />
            <Route path='/theatres' element={<TheatresPage userRole={userRole} />} />
            <Route path='/addEmployee' element={userRole === "employee" ? <AddEmployeePage /> : <NotFound />} />
            <Route path='/addTheatre' element={userRole === "employee" ? <NewTheatrePage /> : <NotFound />} />
            <Route path='/addMovie' element={userRole === "employee" ? <NewMoviePage /> : <NotFound />} />
            <Route path='/addScreening' element={userRole === "employee" ? <AddScreeningPage /> : <NotFound />} />
            <Route path='/movie/:id' element={<MoviePage />} />
            <Route path='/addSnack' element={userRole === "employee" ? <NewSnackPage /> : <NotFound />} />
            <Route path='/makeReservation' element={userRole === "customer" ? <MakeReservationPage userRole={userRole}/> : <NotFound />}/>
            <Route path='/purchase-history' element={userRole==='customer' ? <PurchaseHistory/> : <NotFound/>}/>
            <Route path='/snacks' element={<ShowsnackPage />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Box>
        <Box height={'60px'}></Box>
        <Box
          sx={{
            backgroundColor: '#191331',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 'auto',
            py: 2, // Padding for the footer
          }}
        >
          <Footer />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
