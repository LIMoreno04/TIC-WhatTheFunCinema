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
import logo from '../logo.png';

const pages = ['Comparar entradas', 'Cartelera', 'Sucursales', 'Contacto'];
const settings = ['Detalles', 'Historial de compras', 'Cerrar sesión'];
const loggedOutSettings = ['Iniciar sesión', 'Registrarse'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  
  React.useEffect(() => {
    fetch('http://localhost:8080/api/user/auth', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setIsLoggedIn(data); // data should be a boolean
      })
      .catch((error) => {
        console.error('Error fetching login status:', error);
      });
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    fetch('http://localhost:8080/api/user/logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          setIsLoggedIn(false);
          handleCloseUserMenu(); // Close the user menu
        } else {
          console.error('Logout failed');
        }
      })
      .catch((error) => {
        console.error('Error during logout:', error);
      });
  };

  return (
    <AppBar position="fixed" sx={{ height: 80 }}>
      <Container maxWidth="false" sx={{ mt: -3 }}>
        <Toolbar disableGutters>
          {/* Logo */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 / 32 }}>
            <IconButton href='/home'>
              <img src={logo} alt="Logo" style={{ height: 80, marginRight: 5 }} />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
            <IconButton href='/home'>
              <img src={logo} alt="Logo" style={{ height: 40, marginRight: 5 }} />
            </IconButton>
          </Box>

          {/* Burger menu for small screens */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right', 
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              <MenuItem key="Home" onClick={handleCloseNavMenu} component="a" href="/home">
                <Typography textAlign="center">Inicio</Typography>
              </MenuItem>
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
              {/* Add login/signup to the burger menu */}
              {!isLoggedIn && loggedOutSettings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={handleCloseNavMenu}
                  component="a"
                  href={setting === 'Iniciar sesión' ? '/login' : '/signup'}
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Full-size menu for medium and large screens */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, mx: '1%', color: 'white', display: 'block' }}
              >
                <Typography>{page}</Typography>
              </Button>
            ))}
          </Box>

          {/* Conditional rendering based on login status */}
          <Box sx={{ flexGrow: 0 }}>
            {isLoggedIn ? (
              <>
                <Tooltip title="Opciones de cuenta">
                  <Button onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Typography color="white" sx={{ textAlign: 'right' }}>Perfil</Typography>
                  </Button>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem 
                      key={setting} 
                      onClick={setting === 'Cerrar sesión' ? handleLogout : handleCloseUserMenu}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Box sx={{borderRadius:1, flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {loggedOutSettings.map((setting) => (
                  <Button
                    key={setting}
                    variant='outlined'
                    sx={{ mx: 1, my: 2, color: 'white', display: 'block'}}
                    href={setting === 'Iniciar sesión' ? '/login' : '/signup'}
                  >
                    <Typography>{setting}</Typography>
                  </Button>
                ))}
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
