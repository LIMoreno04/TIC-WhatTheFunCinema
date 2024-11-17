import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';



const pages = ['películas', 'sucursales', 'snacks'];
const paths = ['/movies', '/theatres', '/snacks'];
const customerSettings = ['Detalles de cuenta', 'Historial de compras','Hacer reserva' , 'Comprar snack','Cerrar sesión'];
const employeeSettings = ['Agregar función', 'Agregar película', 'Agregar empleado','Agregar sucursal', 'Agregar snack', 'Cerrar sesión'];
const loggedOutSettings = ['INICIAR SESIÓN', 'REGISTRARSE'];

function ResponsiveAppBar({userRole, onUpdate}) {
  const isSmallScreen = useMediaQuery('(max-width:1200px)');
  const TOOLBAR_HEIGHT_PERCENT = '11vh';
  const TOOLBAR_MIN_HEIGHT = '90px';
  const MARGIN_TOP = '-1.5vh';
  const MIN_MARGIN_TOP = '-30px';

  const LOGO_HEIGHT_PERCENT = '18vh';
  const LOGO_MIN_HEIGHT = '108px';
  const LOGO_MARGIN_LEFT = '-3vw';
  const MIN_LOGO_MARGIN_LEFT = '-60px'
  const LOGO_MARGIN_RIGHT = '-2vw';
  const MIN_LOGO_MARGIN_RIGHT = '-100px'
  const LOGO_MARGIN_TOP = '-3.5vh';
  const MIN_LOGO_MARGIN_TOP = '-105px';

  const BUTTON_MARGIN_X_PERCENT = '0.8vw';
  const BUTTON_MARGIN_Y_PERCENT = '1vh';
  const ACCOUNT_BUTTONS_MARGIN_TOP = '-1.5vh';
  const SMALL_ACCOUNT_BUTTONS_MARGIN_TOP = '-3.5vh'
  const ACCOUNT_BUTTONS_MARGIN_X = '1vw';

  const TEXT_SIZE_PERCENT = '1vw';
  const MIN_TEXT_SIZE = '18px';
  const SPECIAL_TEXT_SIZE_PERCENT = '0.8vw';
  const MIN_SPECIAL_TEXT_SIZE = '10px';

  const MENU_MARGIN_TOP_PERCENT = '5%';

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [scrolled, setScrolled] = React.useState(false);
  
  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 2);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = useNavigate();

  const handleCustomerMenuItemClick = (setting) => {
    if (setting === 'Cerrar sesión') {
      handleLogout();
    } else if (setting === customerSettings[0]) {
      navigate('/account');
      handleCloseUserMenu();
    } else if (setting === customerSettings[1]) {
      navigate('/purchase-history');
      handleCloseUserMenu();
    } else if (setting === customerSettings[2]){
      navigate('/makeReservation');
      handleCloseUserMenu();
    } else if(setting === customerSettings[3]){
      navigate('/buySnack');
      handleCloseUserMenu();
    }
    else {
      handleCloseUserMenu();
    }
  };

  const handleEmployeeMenuItemClick = (setting) => {
    if (setting === 'Cerrar sesión') {
      handleLogout();
    } else if (setting === employeeSettings[0]) {
      navigate('/addScreening');
      handleCloseUserMenu();
    } else if (setting === employeeSettings[1]) {
      navigate('/addMovie');
      handleCloseUserMenu();
    } else if (setting === employeeSettings[2]) {
      navigate('/addEmployee');
      handleCloseUserMenu();
    } else if (setting === employeeSettings[3]) {
      navigate('/addTheatre');
      handleCloseUserMenu();
    } else if (setting === employeeSettings[4]){
      navigate('/addSnack')
    }else {
      handleCloseUserMenu();
    }
  };


  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  React.useEffect(()=> {
    //Periodic update
    console.log("updated appbar.")
    const intervalId = setInterval(onUpdate,600000);
    return () => clearInterval(intervalId);
  }, [])




  const handleLogout = () => {
    fetch('http://localhost:8080/api/user/logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          onUpdate();
          handleCloseUserMenu();
        } else {
          alert('Error en la conexión con el servidor.')
          console.error('Logout failed');
        }
      })
      .catch((error) => console.error('Error during logout:', error));
      navigate("/home");
    };

  return (
    <AppBar sx={{ height: TOOLBAR_HEIGHT_PERCENT, minHeight: TOOLBAR_MIN_HEIGHT }} position="fixed" className = {scrolled ? 'scrolled' : ''}>
      <Container sx={{mt: `clamp(${MIN_MARGIN_TOP}, ${MARGIN_TOP}, ${MARGIN_TOP})`}} maxWidth="false">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: BUTTON_MARGIN_X_PERCENT }}>
            <IconButton href="/home" 
            style={{ 
            marginTop: `clamp(${MIN_LOGO_MARGIN_TOP}, ${LOGO_MARGIN_TOP}, ${LOGO_MARGIN_TOP})`, 
            marginLeft: `clamp(${LOGO_MARGIN_LEFT}, ${MIN_LOGO_MARGIN_LEFT}, ${MIN_LOGO_MARGIN_LEFT})`, 
            marginRight: `clamp(${LOGO_MARGIN_RIGHT}, ${MIN_LOGO_MARGIN_RIGHT}, ${MIN_LOGO_MARGIN_LEFT})`, 
            transition: 'transform 0.2s ease-in-out' 
            }}  
            onMouseEnter={(e) => e.currentTarget.firstChild.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.firstChild.style.transform = 'scale(1)'}>
              <img src={logo} alt="Logo" style={{ height: LOGO_HEIGHT_PERCENT, minHeight: LOGO_MIN_HEIGHT, transition: 'transform 0.2s ease-in-out' }} />
            </IconButton>
          </Box>

          {/* Burger menu for small screens */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'left' }}>
            <IconButton size={LOGO_HEIGHT_PERCENT} onClick={handleOpenNavMenu} color="inherit"
            style={{ 
              marginTop: `clamp(${MIN_LOGO_MARGIN_TOP}, ${LOGO_MARGIN_TOP}, ${LOGO_MARGIN_TOP})`, 
              marginRight: `clamp(${LOGO_MARGIN_RIGHT}, ${MIN_LOGO_MARGIN_RIGHT}, ${MIN_LOGO_MARGIN_RIGHT})`, 
              transition: 'transform 0.2s ease-in-out' 
              }}>
              <MenuIcon style={{ fontSize:'40px', height: LOGO_HEIGHT_PERCENT, minHeight: LOGO_MIN_HEIGHT, transition: 'transform 0.2s ease-in-out' }}/>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              <MenuItem key="Inicio" onClick={handleCloseNavMenu} component="a" href="/home">
                <Typography textAlign="center">Inicio</Typography>
              </MenuItem>
              {pages.map((page, index) => (
                <MenuItem key={page} onClick={handleCloseNavMenu} component="a" href={paths[index]}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Full-size menu for medium and large screens */}
          <Box mt={`clamp(-25px, -1.7vh, -1.7vh)`} sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page, index) => (
              <Button
                key={page}
                onClick={() => {
                  handleCloseNavMenu();
                  navigate(paths[index]);
                }}
                sx={{ fontSize: `clamp(${MIN_TEXT_SIZE}, ${TEXT_SIZE_PERCENT}, ${TEXT_SIZE_PERCENT})`, my: BUTTON_MARGIN_Y_PERCENT, mx: BUTTON_MARGIN_X_PERCENT }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* LoggedIn/LoggedOut buttons */}
          <Box sx={{mt:{xs:SMALL_ACCOUNT_BUTTONS_MARGIN_TOP, md:ACCOUNT_BUTTONS_MARGIN_TOP}}}>
            {(() => {
              switch (userRole) {
                case 'notLoggedIn':
                  return (
                    <Box>
                      {loggedOutSettings.map((setting) => (
                        <Button
                          key={setting}
                          variant={setting === loggedOutSettings[0] ? "outlinedCyan" : "outlinedPink"}
                          href={setting === loggedOutSettings[0] ? '/login' : '/signup'}
                          sx={{ mx: ACCOUNT_BUTTONS_MARGIN_X, fontSize: `clamp(${MIN_SPECIAL_TEXT_SIZE}, ${SPECIAL_TEXT_SIZE_PERCENT}, ${SPECIAL_TEXT_SIZE_PERCENT})`}}
                        >
                          {setting}
                        </Button>
                      ))}
                    </Box>
                  );
                case 'customer':
                  return (
                    <>
                      <Tooltip title="Opciones de cuenta">
                        <Button onClick={handleOpenUserMenu} variant="outlinedCyan" sx={{fontSize: `clamp(${MIN_SPECIAL_TEXT_SIZE}, ${SPECIAL_TEXT_SIZE_PERCENT}, ${SPECIAL_TEXT_SIZE_PERCENT})`}}>CUENTA</Button>
                      </Tooltip>
                      <Menu
                        sx={{ mt: MENU_MARGIN_TOP_PERCENT }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        keepMounted
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                      >
                        {customerSettings.map((setting) => (
                          <MenuItem key={setting} onClick={() => handleCustomerMenuItemClick(setting)}>
                            <Typography textAlign="center">{setting}</Typography>
                          </MenuItem>
                        ))}
                      </Menu>
                    </>
                  );
                case 'employee':
                  return (
                    <>
                      <Tooltip title="Opciones">
                        <Button onClick={handleOpenUserMenu} variant='outlinedCyan' sx={{fontSize: `clamp(${MIN_SPECIAL_TEXT_SIZE}, ${SPECIAL_TEXT_SIZE_PERCENT}, ${SPECIAL_TEXT_SIZE_PERCENT})`}}>OPCIONES DE EMPLEADO</Button>
                      </Tooltip>
                      <Menu
                        sx={{ mt: MENU_MARGIN_TOP_PERCENT }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        keepMounted
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                      >
                        {employeeSettings.map((setting) => (
                          <MenuItem key={setting} onClick={() => handleEmployeeMenuItemClick(setting)}>
                            <Typography textAlign="center">{setting}</Typography>
                          </MenuItem>
                        ))}
                      </Menu>
                    </>
                  );
                default:
                  console.log('Fatal error: User role not identified.');
                  return null;
              }
            })()}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
