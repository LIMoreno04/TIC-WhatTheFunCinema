import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Autocomplete,
  Paper,
  CircularProgress,
} from "@mui/material";

const MakeReservationForm = () => {
  const [screenings, setScreenings] = useState([]);
  const [selectedScreening, setSelectedScreening] = useState("");
  const [seatRow, setSeatRow] = useState("");
  const [seatCol, setSeatCol] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    // Fetch all screenings
    fetch("http://localhost:8080/api/screenings/all")
      .then((response) => response.json())
      .then((data) => setScreenings(data))
      .catch((error) => console.error("Error fetching screenings:", error));
  }, []);

  useEffect(() => {
    const allFieldsFilled = selectedScreening && seatRow && seatCol;
    setIsFormValid(allFieldsFilled);
  }, [selectedScreening, seatRow, seatCol]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const reservationData = {
      screeningId: selectedScreening,
      seatRow: Number(seatRow),
      seatCol: Number(seatCol),
    };

    try {
      const response = await fetch("http://localhost:8080/api/reservations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          console.error("Error:", errorData);
          setFormErrors(errorData);
        } else {
          setServerError("Error conectándose con el servidor.");
        }
      } else {
        alert("Reserva realizada con éxito!");
        setSelectedScreening("");
        setSeatRow("");
        setSeatCol("");
        setFormErrors({});
        setServerError("");
      }
    } catch (error) {
      console.error("Failed to submit:", error);
      setServerError("Error al realizar la reserva.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box position="relative">
      {loading && (
        <Box
          sx={{
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
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Paper
        sx={{
          padding: "40px",
          maxWidth: "600px",
          margin: "auto",
          border: "2px solid #9df8fc",
          borderRadius: "20px",
        }}
      >
        <Typography marginLeft={1} variant="neonCyan" fontSize="50px" gutterBottom>
          Hacer una Reserva
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Autocomplete
            options={screenings.map((screening) => screening.id)}
            value={selectedScreening}
            onChange={(e, newValue) => setSelectedScreening(newValue)}
            renderInput={(params) => <TextField {...params} label="Función" required />}
          />

          <TextField
            label="Fila del asiento"
            type="number"
            value={seatRow}
            onChange={(e) => setSeatRow(e.target.value)}
            required
            error={!!formErrors.seatRow}
            helperText={formErrors.seatRow}
          />

          <TextField
            label="Columna del asiento"
            type="number"
            value={seatCol}
            onChange={(e) => setSeatCol(e.target.value)}
            required
            error={!!formErrors.seatCol}
            helperText={formErrors.seatCol}
          />

          {serverError && <Typography color="error">{serverError}</Typography>}

          <Button variant="contained" type="submit" disabled={!isFormValid || loading}>
            Reservar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default MakeReservationForm;
