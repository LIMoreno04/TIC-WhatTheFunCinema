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
import { format } from "date-fns";
import PaymentMethodsDisplay from "./PaymentMethodsDisplay";

const ReservationForm = ({userRole}) => {
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
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false); // Manage payment dialog visibility
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false); // Track payment confirmation


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
    if (!(reservationData)) return;

    setLoading(true);
    const failures = [];

    for (const [row, col] of selectedSeats) {
      const screeningDTO = {
        theatre: selectedTheatre,
        roomNumber: reservationData[3],
        date_and_time: `${selectedDate}T${selectedTime}`,
      };

      try {
        const response = await fetch(
          `http://localhost:8080/api/customer/makeReservation/${encodeURIComponent(
            col
          )}/${encodeURIComponent(row)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(screeningDTO),
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          failures.push({ seat: [row, col], error: errorData.error });
        }
      } catch (error) {
        failures.push({ seat: [row, col], error: "Network error" });
      }
    }

    setLoading(false);

    if (failures.length > 0) {
      alert(
        `Error haciendo la reserva de los siguientes asientos: ${failures
          .map((f) => `Row ${f.seat[0]}, Col ${f.seat[1]}`)
          .join(", ")}`
      );
    } else {
      alert("Reserva exitosa!");
      setSelectedSeats([]);
      setOpenSeatSelector(false);
      setOpenPaymentDialog(false); // Close payment dialog
    }
  };

  const handlePaymentSelect = () => {
    setIsPaymentConfirmed(true);
  };

  useEffect(() => {
    if (isPaymentConfirmed) {
      handleReservation();
      setIsPaymentConfirmed(false); // Reset after handling
    }
  }, [isPaymentConfirmed]);

  const isSmallScreen = useMediaQuery('(max-width:1150px)');


  return (
    <Box component="form" onSubmit={handleSubmit} 
    sx={{
      boxSizing:'border-box',
      padding: isSmallScreen ? '30px' : '1.5vw', width: "100%",
      display:'flex',
      flexDirection:'column',
      alignItems:'center', 
      overflowY:'auto', 
      height:'100%',
      }}>


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
            marginBottom: isSmallScreen ? '20px' : '1vw',
            fontSize: isSmallScreen ? 'clamp(20px,8vw,40px)' : '2vw',
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
        renderInput={(params) => (
          <TextField
            {...params}
            label="Película"
            required
            sx={{
              "& .MuiInputLabel-root": { fontSize: isSmallScreen ? "auto" : "1vw" },
              "& .MuiInputBase-root": {
                fontSize: isSmallScreen ? "auto" : "1vw",
              },
            }}
          />
        )}
        sx={{
          marginBottom: "1vw",
          "& .MuiInputBase-root": {
            height: isSmallScreen ? "auto" : "3vw",
          },
        }}
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
            sx={{
              "& .MuiInputLabel-root": { fontSize: isSmallScreen ? "auto" : "1vw" },
              "& .MuiInputBase-root": {
                fontSize: isSmallScreen ? "auto" : "1vw",
              },
            }}
          />
        )}
        sx={{
          marginBottom: "1vw",
          "& .MuiInputBase-root": {
            height: isSmallScreen ? "auto" : "3vw",
          },
        }}
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
            sx={{
              "& .MuiInputLabel-root": { fontSize: isSmallScreen ? "auto" : "1vw" },
              "& .MuiInputBase-root": {
                fontSize: isSmallScreen ? "auto" : "1vw",
              },
            }}
          />
        )}
        sx={{
          marginBottom: "1vw",
          "& .MuiInputBase-root": {
            height: isSmallScreen ? "auto" : "3vw",
          },
        }}
      />

      <Autocomplete
        fullWidth
        options={availableTimes}
        value={selectedTime}
        onChange={(e, newValue) => setSelectedTime(newValue)}
        getOptionLabel={(option) => option.slice(0, 5)} // Display only the first 5 characters
        renderInput={(params) => (
          <TextField
            {...params}
            label="Hora"
            required
            disabled={!selectedDate}
            sx={{
              "& .MuiInputLabel-root": { fontSize: isSmallScreen ? "auto" : "1vw" },
              "& .MuiInputBase-root": {
                fontSize: isSmallScreen ? "auto" : "1vw",
              },
            }}
          />
        )}
        sx={{
          marginBottom: "1vw",
          "& .MuiInputBase-root": {
            height: isSmallScreen ? "auto" : "3vw",
          },
        }}
      />


        <TextField
          fullWidth
          label="¿Cuántas entradas?"
          type="number"
          value={tickets}
          onChange={(e) => {
            // Allow only positive integers
            const value = e.target.value;
            const positiveInteger = value === "" ? "" : Math.max(0, Math.floor(Number(value)));
            setTickets(positiveInteger);
          }}
          required
          disabled={!selectedTime}
          sx={{
            marginBottom: "1vw",
            "& .MuiInputLabel-root": { fontSize: isSmallScreen ? "auto" : "1vw" },
            "& .MuiInputBase-root": {
              height: isSmallScreen ? "auto" : "3vw",
              fontSize: isSmallScreen ? "auto" : "1vw",
            },
          }}
        />



      {serverError && <Typography color="error">{serverError}</Typography>}

      {userRole === 'customer' &&
        <Button sx={{width:'90%', height: isSmallScreen ? 'auto' : '3vw'}} variant="superFancy" type="submit" disabled={!isFormValid || loading}>
        Comprar
      </Button>}
      {userRole != 'customer' &&
        <Button sx={{fontSize:'1vw', width:'90%', height: isSmallScreen ? 'auto' : '3vw'}} variant="superFancy" href="/login" disabled={loading}>
        Iniciar sesión para comprar
        </Button>
      
      }

        <Dialog
          open={openPaymentDialog}
          onClose={() => setOpenPaymentDialog(false)}
          width='40vw'
        >
          <DialogTitle>Elige un método de pago</DialogTitle>
          <DialogContent>
            <Box width={'40vw'} padding={5}>
            <PaymentMethodsDisplay onUpdate={handlePaymentSelect} onSelect={handlePaymentSelect} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPaymentDialog(false)}>Cancelar</Button>
          </DialogActions>
        </Dialog> 


        {/* Seat Selector Dialog */}
        <Dialog open={openSeatSelector} onClose={() => {setOpenSeatSelector(false); setSelectedSeats([])}} maxWidth="lg">
        <DialogTitle>Selecciona tus asientos</DialogTitle>
          <DialogContent>
            <Box sx={{display:'flex', flexDirection:'row', maxWidth:'80vw', gap:3}}>
            <Box overflow={'auto'} maxWidth={'60%'}
                sx={{overflow:'auto',
                    maxWidth:'60%',
                }}>
            <Grid container spacing={1}>
              {reservationData &&
                Array.from({ length: reservationData[0] }).map((_, row) => (
                  <Grid key={row} container>
                    {Array.from({ length: reservationData[1] }).map((_, col) => {
                      const isReserved = reservationData[2].some(
                        (seat) => seat.row === row && seat.col === col
                      );
                      const isSelected = selectedSeats.some(
                        (seat) => seat[0] === row && seat[1] === col
                      );
                      return (
                        <IconButton
                          key={`${row}-${col}`}
                          onClick={() =>
                            !isReserved && toggleSeatSelection(row, col)
                          }
                          disabled={isReserved}
                          sx={{
                            color: isReserved
                              ? "red"
                              : isSelected
                              ? "green"
                              : "gray", '&:disabled':{color:'red'}
                          }}
                        >
                          <SeatIcon />
                        </IconButton>
                      );
                    })}
                  </Grid>
                ))}
            </Grid>
            </Box>
            <Divider
                sx={{
                    width: '2px',
                    backgroundColor: '#ffffff', // Neon cyan color
                    boxShadow: '0 0 5px #00ffff, 0 0 10px #00ffff', // Neon glow effect
                    marginLeft:-3,
                }}
                />  
            {(selectedMovie && selectedTheatre && reservationData && selectedDate &&selectedTime) && (
              <Box sx={{display:'flex', flexDirection:'column', flexGrow:1, gap:4}}>
                <Typography variant="h6" gutterBottom>
                  <strong>Película:</strong> {selectedMovie.movieTitle}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <strong>Sucursal:</strong> {selectedTheatre}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                  <strong>Sala:</strong> {reservationData[3]}
                  </Typography>
                <Typography variant="h6" gutterBottom>
                  <strong>Fecha:</strong> {format(new Date(selectedDate.substring(0,10) + 'T00:00:00'),"dd/MM/yyyy")}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <strong>Hora:</strong> {selectedTime.substring(0,5)}
                </Typography>
                <TextField
                  label="¿Cuántos asientos?"
                  type="number"
                  value={tickets}
                  onChange={(e) =>
                    {setTickets(Math.max(0, Math.min(e.target.value, 10))); if (Math.max(0, Math.min(e.target.value, 10)) < selectedSeats.length){setSelectedSeats([])} }
                  }
                  fullWidth
                />
              </Box>
            )}
            </Box>
          </DialogContent>
          <DialogActions>
          <Button
            onClick={() => {
              setOpenSeatSelector(false);
              setSelectedSeats([]);
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => setOpenPaymentDialog(true)} // Open payment dialog instead of direct reservation
            disabled={selectedSeats.length !== Number(tickets)}
          >
            Confirmar y Pagar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReservationForm;