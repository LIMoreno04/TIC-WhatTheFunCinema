import { Box, Typography } from "@mui/material";
import MovieDisplay from "../components/MovieDisplay";
import MovieConveyorBelt from "../components/MoviesConveyorBelt";
import MoviesDisplay from "../components/MoviesDisplay";

export default function MoviesPage() {

    return (
        <Box
            sx={{
                display:'flex',
                justifyContent:'center'
            }}
        >
                <MoviesDisplay></MoviesDisplay>
        </Box>
    )


}