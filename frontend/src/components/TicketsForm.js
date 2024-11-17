import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  useMediaQuery,
  Divider
} from "@mui/material";
import SeatIcon from "@mui/icons-material/EventSeat";

const ReservationForm = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [screenings, setScreenings] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [tickets, setTickets] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [serverError, setServerError] = useState("");
  const [reservationData, setReservationData] = useState(null);
  const [openSeatSelector, setOpenSeatSelector] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Fetch movies on component mount
  useEffect(() => {
    fetch("http://localhost:8080/api/movies/allOnDisplayWithTitles")
      .then((response) => response.json())
      .then((data) => {setMovies(data)})
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  // Fetch screenings when a movie is selected
  useEffect(() => {
    if (selectedMovie) {
      fetch(`http://localhost:8080/api/movies/screenings/${selectedMovie.movieId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setScreenings(data);
          const uniqueTheatres = [
            ...new Set(data.map((screening) => screening.theatre)),
          ];
          setTheatres(uniqueTheatres);
          setSelectedTheatre(null);
          setAvailableDates([]);
          setSelectedDate(null);
          setAvailableTimes([]);
          setSelectedTime(null);
        })
        .catch((error) => console.error("Error fetching screenings:", error));
    }
  }, [selectedMovie]);

  // Filter dates when a theatre is selected
  useEffect(() => {
    if (selectedTheatre) {
      const filteredDates = [
        ...new Set(
          screenings
            .filter((screening) => screening.theatre === selectedTheatre)
            .map((screening) => screening.date_and_time.split("T")[0])
        ),
      ];
      setAvailableDates(filteredDates);
      setSelectedDate(null);
      setAvailableTimes([]);
      setSelectedTime(null);
    }
  }, [selectedTheatre, screenings]);

  // Filter times when a date is selected
  useEffect(() => {
    if (selectedDate) {
      const filteredTimes = screenings
        .filter(
          (screening) =>
            screening.theatre === selectedTheatre &&
            screening.date_and_time.startsWith(selectedDate)
        )
        .map((screening) => screening.date_and_time.split("T")[1]);
      setAvailableTimes(filteredTimes);
      setSelectedTime(null);
    }
  }, [selectedDate, selectedTheatre, screenings]);

  // Validate form
  useEffect(() => {
    const allFieldsFilled =
      selectedMovie &&
      selectedTheatre &&
      selectedDate &&
      selectedTime &&
      tickets;
    setIsFormValid(allFieldsFilled);
  }, [selectedMovie, selectedTheatre, selectedDate, selectedTime, tickets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const selectedScreening = screenings.find(
      (screening) =>
        screening.theatre === selectedTheatre &&
        screening.date_and_time === `${selectedDate}T${selectedTime}`
    );
    console.log(selectedScreening.roomNumber);
    console.log("aaaaaaaa");

    try {
      const response = await fetch(
        `http://localhost:8080/api/theatre/getReservations/${encodeURIComponent(
          selectedTheatre
        )}/${encodeURIComponent(selectedScreening.roomNumber)}/${encodeURIComponent(
          selectedScreening.date_and_time
        )}`
      );
      const data = await response.json();
      setReservationData(data);
      setOpenSeatSelector(true); // Open seat selector
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSeatSelection = (row, col) => {
    const seatIndex = selectedSeats.findIndex(
      (seat) => seat[0] === row && seat[1] === col
    );

    if (seatIndex >= 0) {
      // Deselect seat
      setSelectedSeats((prevSeats) =>
        prevSeats.filter((_, index) => index !== seatIndex)
      );
    } else {
      // Select seat
      setSelectedSeats((prevSeats) => {
        const newSeats = [...prevSeats, [row, col]];
        // If too many seats selected, remove oldest
        if (newSeats.length > tickets) {
          newSeats.shift();
        }
        return newSeats;
      });
    }
  };

  const handleReservation = async () => {
    if (!(reservationData) ) return;
      setLoading(true);
      const failures = [];
    
      for (const [row, col] of selectedSeats) {
        console.log(selectedTheatre);
        console.log(reservationData[1]);
        console.log(`${selectedDate}T${selectedTime}`);
        const screeningDTO = {
          theatre:selectedTheatre, 
          roomNumber: reservationData[3],
          date_and_time: `${selectedDate}T${selectedTime}`,
        };
    
        try {
          const response = await fetch(`http://localhost:8080/api/customer/makeReservation/${encodeURIComponent(col)}/${encodeURIComponent(row)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(screeningDTO),
            credentials: "include",
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData)
            failures.push({ seat: [row, col], error: errorData.error });
          }
        } catch (error) {
          failures.push({ seat: [row, col], error: "Network error" });
        }
      }
    
      setLoading(false);
    
      if (failures.length > 0) {
        alert(`Some seats could not be reserved: ${failures.map(f => `Row ${f.seat[0]}, Col ${f.seat[1]}`).join(", ")}`);
      } else {
        alert("All seats reserved successfully!");
        setSelectedSeats([]);
        setOpenSeatSelector(false);
      }
    };

  const isSmallScreen = useMediaQuery('(max-width:1150px)');


  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", display:'flex',flexDirection:'column',alignItems:'center'}}>
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
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Typography
          variant="neonCyan"
          sx={{
            marginBottom: isSmallScreen ? '4vw' : '2vw',
          fontSize: isSmallScreen ? '8vw' : '2.4vw',
          }}
          >
          Comprar entradas
      </Typography>

      <Autocomplete
      fullWidth
        options={movies}
        getOptionLabel={(option) => option.movieTitle}
        value={selectedMovie}
        onChange={(e, newValue) => setSelectedMovie(newValue)}
        renderInput={(params) => <TextField {...params} label="Película" required />}
        sx={{ marginBottom: 2 }}
      />

      <Autocomplete
      fullWidth
        options={theatres}
        value={selectedTheatre}
        onChange={(e, newValue) => setSelectedTheatre(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Sucursal"
            required
            disabled={!selectedMovie}
          />
        )}
        sx={{ marginBottom: 2 }}
      />

      <Autocomplete
      fullWidth
        options={availableDates}
        value={selectedDate}
        onChange={(e, newValue) => setSelectedDate(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Cuando"
            required
            disabled={!selectedTheatre}
          />
        )}
        sx={{ marginBottom: 2 }}
      />

      <Autocomplete
      fullWidth
        options={availableTimes}
        value={selectedTime}
        onChange={(e, newValue) => setSelectedTime(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Hora"
            required
            disabled={!selectedDate}
          />
        )}
        sx={{ marginBottom: 2 }}
      />

      <TextField
      fullWidth
        label="¿Cuántos boletos?"
        type="number"
        value={tickets}
        onChange={(e) => setTickets(e.target.value)}
        required
        disabled={!selectedTime}
        sx={{ marginBottom: 2 }}
      />

      {serverError && <Typography color="error">{serverError}</Typography>}

      <Button fullWidth variant="contained" type="submit" disabled={!isFormValid || loading}>
        Consultar
      </Button>

        {/* Seat Selector Dialog */}
        <Dialog open={openSeatSelector} onClose={() => setOpenSeatSelector(false)} maxWidth="lg">
        <DialogTitle>Selecciona tus asientos</DialogTitle>
        <DialogContent>
          {reservationData && (
            <>
              <Grid container spacing={1} justifyContent="center">
                {Array.from({ length: reservationData[0] })
                  .reverse()
                  .map((_, row) => (
                    <Grid container key={row} justifyContent="center">
                      {Array.from({ length: reservationData[1] }).map((_, col) => {
                        const isReserved = reservationData[2].some(
                          (r) => r.row === row && r.col === col
                        );
                        const isSelected = selectedSeats.some(
                          (seat) => seat[0] === row && seat[1] === col
                        );

                        return (
                          <IconButton
                            key={`${row}-${col}`}
                            onClick={() => !isReserved && toggleSeatSelection(row, col)}
                            disabled={isReserved}
                            sx={{
                              color: isReserved
                                ? "red"
                                : isSelected
                                ? "green"
                                : "gray",
                              margin: 0.5,
                            }}
                          >
                            <SeatIcon />
                          </IconButton>
                        );
                      })}
                    </Grid>
                  ))}
              </Grid>
              <Divider sx={{ marginTop: 2, marginBottom: 1}} />
              <Typography align="center" variant="subtitle1">
                Pantalla
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReservation} disabled={selectedSeats.length !== Number(tickets)}>
            Comprar
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default ReservationForm;
