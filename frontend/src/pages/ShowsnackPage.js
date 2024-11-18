import { Box, Typography } from "@mui/material";
import MovieDisplay from "../components/MovieDisplay";
import MovieConveyorBelt from "../components/MoviesConveyorBelt";
import SnackDisplay from "../components/SnacksDisplay";

export default function ShowsnackPage() {

    return (
        <Box
            sx={{
                padding: 10,
                paddingBottom:15,
                }}
        >
            <Box>
                <SnackDisplay></SnackDisplay>
            </Box>
        </Box>
    )


}