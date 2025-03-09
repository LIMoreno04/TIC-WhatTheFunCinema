import { Box, Typography } from "@mui/material";
import SnacksDisplay from "../components/SnacksDisplay";
import SnackDisplay from "../components/SnackDisplay";

export default function ShowsnackPage() {

    return (
        <Box
            sx={{
                display:'flex',
                justifyContent:'center',
                paddingX: 10,
                paddingTop:1,
                paddingBottom:15,
                }}
        >
            <Box>
                <Typography variant="neonPink" fontSize={'70px'} ml={'20px'} >
                          Snacks
                </Typography>
                <SnacksDisplay></SnacksDisplay>
            </Box>
        </Box>
    )


}