import { Box } from "@mui/material";
import TheatresDisplay from "../components/TheatresDisplay";

export default function TheatresPage({userRole}) {
    return (
      <Box mt={20} display={'flex'} justifyContent={'center'}>
        <TheatresDisplay userRole={userRole}/>
      </Box>
    );
  }
