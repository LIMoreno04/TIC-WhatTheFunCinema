import { Box } from "@mui/material";
import MovieProfile from "../components/MovieProfile";

const MoviePage = () => {
return (
    <Box marginBottom={7} paddingY={'clamp(20px,2vh,2vh)'}>
        <MovieProfile></MovieProfile>
    </Box>
)
}
export default MoviePage;