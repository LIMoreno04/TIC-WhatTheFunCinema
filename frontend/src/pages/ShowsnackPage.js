import { Box, Typography } from "@mui/material";
import MovieDisplay from "../components/MovieDisplay";
import MovieConveyorBelt from "../components/MoviesConveyorBelt";
import ShowSnacks from "../components/ShowSnacks"

export default function ShowsnackPage() {

    return (
        <Box
            sx={{
                padding: 10,
                paddingBottom:15,
                }}
        >
            <Box>
                <ShowSnacks></ShowSnacks>
            </Box>
        </Box>
    )


}