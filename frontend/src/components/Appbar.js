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

const pages = ['cartelera', 'sucursales', 'contacto'];
const paths = ['/movies', '/theatres', '/contact'];
const settings = ['Detalles de cuenta', 'Historial de compras', 'Cerrar sesión'];
const loggedOutSettings = ['INICIAR SESIÓN', 'REGISTRARSE'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [userRole, setUserRole] = React.useState('notLoggedIn');
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = useNavigate();

  const handleMenuItemClick = (setting) => {
    if (setting === 'Cerrar sesión') {
      handleLogout();
    } else if (setting === settings[0]) {
      navigate('/account');
      handleCloseUserMenu();
    } else if (setting === settings[1]) {
      navigate('/purchase-history');
      handleCloseUserMenu();
    } else {
      handleCloseUserMenu();
    }
  };

  React.useEffect(() => {
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
  }, []);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = () => {
    fetch('http://localhost:8080/api/user/logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          setUserRole('notLoggedIn');
          handleCloseUserMenu();
        } else {
          alert('Error en la conexión con el servidor.')
          console.error('Logout failed');
        }
      })
      .catch((error) => console.error('Error during logout:', error));
  };

  return (
    <AppBar sx={{height: 130}} position="fixed" className={scrolled ? 'scrolled' : ''}>
      <Container sx={{mt: 0.5}} maxWidth="false">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }}>
            <IconButton href="/home" style={{ transition: 'transform 0.2s ease-in-out' }} 
            onMouseEnter={(e) => e.currentTarget.firstChild.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.firstChild.style.transform = 'scale(1)'}>
              <img src={logo} alt="Logo" style={{ height: 200, marginTop: -60, marginLeft: -40, marginRight: -20, transition: 'transform 0.2s ease-in-out' }} />
            </IconButton>
          </Box>

          {/* Burger menu for small screens */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'left' }}>
            <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
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
                <MenuItem
                  key={page}
                  onClick={handleCloseNavMenu}
                  component="a"
                  href={
                    index === 0 ? '/movies' : 
                    index === 1 ? '/theatres' : 
                    index === 2 ? '/contact' : 
                    '#'
                  }
                >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>

          </Box>

          {/* Full-size menu for medium and large screens */}
          <Box mt={-4} sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page,index) => (
              <Button 
              key={page} 
              onClick={() => {
                handleCloseNavMenu();
                navigate(paths[index]);
              }}
               sx={{ my: 2, mx: '1%' }}
               >
                {page}
              </Button>
            ))}
          </Box>

          {/* LoggedIn/LoggedOut buttons */}
          <Box mt={-4} sx={{ flexGrow: 0 }}>
            {(() => {
              switch (userRole) {
                case 'notLoggedIn':
                  return (
                    <Box >
                      {loggedOutSettings.map((setting) => (
                        <Button
                          key={setting}
                          variant={setting === loggedOutSettings[0] ? "outlinedCyan" : "outlinedPink"}
                          href={setting === loggedOutSettings[0] ? '/login' : '/signup'}
                          sx={{ mx: 2}}
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
                        <Button onClick={handleOpenUserMenu} variant="outlinedCyan">CUENTA</Button>
                      </Tooltip>
                      <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        keepMounted
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                      >
                        {settings.map((setting) => (
                          <MenuItem key={setting} onClick={() => handleMenuItemClick(setting)}>
                            <Typography textAlign="center">{setting}</Typography>
                          </MenuItem>
                        ))}
                      </Menu>
                    </>

                  );
                case 'employee':
                  return (
                    <>
                      <Tooltip title="Opciones de cuenta">
                        <Button onClick={handleOpenUserMenu} variant='outlinedCyan'>CUENTA DE EMPLEADO</Button>
                      </Tooltip>
                      <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        keepMounted
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                      >
                        {settings.map((setting) => (
                          <MenuItem key={setting} onClick={setting === 'Cerrar sesión' ? handleLogout : handleCloseUserMenu}>
                            <Typography textAlign="center">{setting}</Typography>
                          </MenuItem>
                        ))}
                      </Menu>
                    </>
                  );
                case 'admin':
                  return (
                    <>
                      <Tooltip title="Opciones de cuenta">
                        <Button onClick={handleOpenUserMenu} variant='outlinedCyan'>ADMIN</Button>
                      </Tooltip>
                      <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        keepMounted
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                      >
                        {settings.map((setting) => (
                          <MenuItem key={setting} onClick={setting === 'Cerrar sesión' ? handleLogout : handleCloseUserMenu}>
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
