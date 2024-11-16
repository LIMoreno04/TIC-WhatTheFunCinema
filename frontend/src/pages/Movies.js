import { Box, Typography } from "@mui/material";
import MovieDisplay from "../components/MovieDisplay";

export default function MoviesPage() {

    return (
        <Box
            sx={{
                padding: 5,
                maxWidth: '100vw', // Maximum width for the image
                height: 'auto', // Keeps the aspect ratio
                overflow: 'hidden', // Prevents overflow if image is too large
                display: 'flex',
                flexDirection:'column',
                justifyContent: 'center', // Center the image horizontally
                }}
        >
        <Typography variant="neonPink" fontSize={60} gutterBottom>Peliculas</Typography>
        <Box>
        <MovieDisplay movieId={6}/>
        </Box>
        </Box>
    )


}