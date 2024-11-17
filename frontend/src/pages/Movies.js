import { Box, Typography } from "@mui/material";
import MovieDisplay from "../components/MovieDisplay";
import MovieConveyorBelt from "../components/MoviesConveyorBelt";

export default function MoviesPage() {

    return (
        <Box
            sx={{
                padding: 5,
                paddingBottom:15,
                maxWidth: '100vw', // Maximum width for the image
                height: 'auto', // Keeps the aspect ratio
                overflow: 'hidden', // Prevents overflow if image is too large
                display: 'flex',
                flexDirection:'column',
                justifyContent: 'center', // Center the image horizontally
                }}
        >
        <Box>
            <MovieConveyorBelt></MovieConveyorBelt>
        </Box>
        </Box>
    )


}