import React, { useEffect, useState } from "react";
import SnackDisplay from "./SnackDisplay";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";

const Overlay = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
});

const SnacksDisplay = () => {
  const [snackIds, setSnackIds] = useState([]);
  const [loading, setLoading] = useState(false);


  const fetchSnackIds = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/snacks/AllIds", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
      setSnackIds(data);
    } catch (error) {
      console.error("Error fetching snack ids:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    console.log("SNACK IDS: ",snackIds)
  },[snackIds])

  useEffect(() => {
    fetchSnackIds();
  }, []);

  return (
    <Box position="relative">
      {loading && (
        <Overlay>
          <CircularProgress color="primary" />
        </Overlay>
      )}

      <Box
        sx={{
            display:'flex', flexDirection:'column',
          boxShadow: "inset 0 0 18px #a805ad, 0 0 15px #a805ad, 0 0 20px #a805ad",
          borderRadius: "20px",
          border: "2px solid #e4b4e6",
          p: 5,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          width: "88vw",
          minHeight: "65vh",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
        }}
      >
        <Typography variant="neonPink" fontSize="60px" mb={4} gutterBottom>
          Snacks
        </Typography>

        <Box display="flex" flexWrap="wrap" gap={4}>
          {snackIds.map((snack) => (
            <SnackDisplay id={snack}> 
            </SnackDisplay>
          
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SnacksDisplay;
