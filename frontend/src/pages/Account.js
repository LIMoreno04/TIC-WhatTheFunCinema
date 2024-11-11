import { Box, Container, Paper, Typography } from "@mui/material";
import * as React from 'react';
import Profile from "../components/Profile";
import NotLoggedInPage from "./NotLoggedInPage";

export default function MyAccountPage() {

    const [userRole, setUserRole] = React.useState('notLoggedIn')
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

      if (userRole==='notLoggedIn') {
        return (
        <Box mt={20}>
            <NotLoggedInPage></NotLoggedInPage>
        </Box>
        )
      } 
      else if (userRole==='employee') {
        return (
        <Container
          sx={{
            width: '800px',
            margin: '0 auto',
            mt: 20,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Paper
            sx={{
              width: '500px',
              padding: 4,
              backgroundColor: '#191331',
              textAlign: 'center',
              boxShadow: '0 0 15px #a805ad, 0 0 25px #0ff0fc',
            }}
          >
            <Typography
              variant="neonPink"
              fontSize={'3.2rem'}
            >
              ¿Por qué no estás trabajando?
            </Typography>
          </Paper>
        </Container>
    )
      } 
      else {
        return (
            
            <Box mt={16}>
                <Profile></Profile>
            </Box>
        )
      }

}