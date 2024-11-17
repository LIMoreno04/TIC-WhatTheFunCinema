import { Box, Typography } from "@mui/material";
import MovieDisplay from "../components/MovieDisplay";
import MovieConveyorBelt from "../components/MoviesConveyorBelt";
import MoviesDisplay from "../components/MoviesDisplay";

export default function MoviesPage() {

    return (
        <Box
            sx={{
                padding: 10,
                paddingTop:1,
                paddingBottom:15,
                }}
        >
            <Box>
                <MoviesDisplay></MoviesDisplay>
            </Box>
        </Box>
    )


}