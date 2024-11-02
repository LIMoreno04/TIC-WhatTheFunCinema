import { Box, Button, Container, Paper, Typography } from "@mui/material";
import Error404 from "../components/Error404";

export default function NotFound() 
{
    const paperStyle = { padding: '40px 30px', width: 800, margin: '20px auto' };
    return (
        <Box mt={20}>
            <Error404></Error404>
        </Box>
    )
}