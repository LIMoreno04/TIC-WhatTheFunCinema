import { Box } from "@mui/material";
import TicketsForm from "../components/TicketsForm"
 
 
export default function MakeReservationPage(userRole) {
 
    return (
        <Box>
        <TicketsForm userRole={userRole}></TicketsForm>
        </Box>
    )
 
 
}