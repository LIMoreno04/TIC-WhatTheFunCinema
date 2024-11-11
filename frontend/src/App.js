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

function App() {
  const location = useLocation();

  return (
      <ThemeProvider theme={neonTheme}>
        <ResponsiveAppBar />
        <Routes>
          <Route path='/home' element={<HomePage />} />
          <Route path='/' element={<HomePage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/movies' element={<MoviesPage />} />
          <Route path='/account' element={<MyAccountPage />} />
          <Route path='/addEmployee' element={<AddEmployeePage/>} />
          <Route path='/addTheatre' element={<NewTheatrePage/>} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </ThemeProvider>
  );
}

export default App;
