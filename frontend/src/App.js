import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import { Routes, Route } from 'react-router-dom';
import ResponsiveAppBar from './components/Appbar'
import HomePage from './pages/Home'
import SignupPage from './pages/Signup'
import LoginPage from './pages/Login'
import NotFound from './pages/NotFound'
import MoviesPage from './pages/Movies';
import MyAccountPage from './pages/Account';
import neonTheme from './assets/Theme';






function App() {
  return (
    <div className="App">
      <ThemeProvider theme={neonTheme}>
        <ResponsiveAppBar/>
        <Routes>
          <Route path='/home' element={<HomePage/>} ></Route>
          <Route path='/' element={<HomePage/>} ></Route>
          <Route path='/signup' element={<SignupPage/>}></Route>
          <Route path='/login' element={<LoginPage/>}></Route>
          <Route path='/movies' element={<MoviesPage/>}></Route>
          <Route path='/account' element={<MyAccountPage/>}></Route>

          <Route path='*' element={<NotFound/>}></Route>
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
