import { Box } from "@mui/material";
import TheatresDisplay from "../components/TheatresDisplay";

export default function TheatresPage({userRole}) {
    return (
      <Box display={'flex'} justifyContent={'center'} mt={3}>
        <TheatresDisplay userRole={userRole}/>
      </Box>
    );
  }
