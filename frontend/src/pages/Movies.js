import { Box, Typography } from "@mui/material";
import MovieDisplay from "../components/MovieDisplay";

export default function MoviesPage() {

    return (
        <Box
            sx={{
                paddingX: '10',
                maxWidth: '300px', // Maximum width for the image
                height: 'auto', // Keeps the aspect ratio
                overflow: 'hidden', // Prevents overflow if image is too large
                display: 'flex',
                flexDirection:'column',
                justifyContent: 'center', // Center the image horizontally
                }}
        >
        <Typography variant="neonPink" fontSize={60}>Peliculas</Typography>
        <MovieDisplay movieId={6}/>
        </Box>
    )


}