import { Box } from "@mui/material";
import Purchases from "../components/Purchases";

export default function PurchaseHistory() {
    return (
      <Box display={'flex'} justifyContent={'center'} padding={3}>
        <Purchases/>
      </Box>
    );
  }