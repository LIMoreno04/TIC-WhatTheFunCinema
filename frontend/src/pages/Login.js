import { Box } from "@mui/material";
import LoginForm from "../components/LoginForm";

export default function LoginPage({fetchRole}) {
    return (
      <Box>
        <LoginForm fetchRole={fetchRole}/>
      </Box>
    );
  }
