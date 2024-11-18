
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  TextField,
  Divider,
} from "@mui/material";
import { format, isBefore, startOfDay } from "date-fns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import SeatIcon from "@mui/icons-material/EventSeat";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

const ScreeningsBox = ({ movieId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reservationData, setReservationData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [openSeatSelector, setOpenSeatSelector] = useState(false);
  const [tickets, setTickets] = useState(1);
  const [selectedScreening, setSelectedScreening] = useState(null);

  

  // Fetch screenings on component mount
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/movies/screenings/${movieId}`)
      .then((response) => response.json())
      .then((data) => {setScreenings(data); console.log(data);})
      .catch((error) => console.error("Error fetching screenings:", error))
      .finally(() => setLoading(false));
  }, [movieId]);

  // Handle date selection
  const handleDateChange = (date) => {
    if (!isBefore(date, startOfDay(new Date()))) {
      setSelectedDate(date);
    }
  };

  // Filter screenings for the selected date
  const filteredScreenings = screenings.filter((screening) =>
    screening.date_and_time.startsWith(format(selectedDate, "yyyy-MM-dd"))
  );

  const groupedScreenings = filteredScreenings.reduce((acc, screening) => {
    const { theatre, date_and_time, language } = screening;
    const time = date_and_time.split("T")[1];
    const theatreGroup = acc[theatre] || [];
    theatreGroup.push({ time, language, screening });
    acc[theatre] = theatreGroup;
    return acc;
  }, {});


  // Handle seat selection logic
  const toggleSeatSelection = (row, col) => {
    const seatIndex = selectedSeats.findIndex(
      (seat) => seat[0] === row && seat[1] === col
    );
    if (seatIndex >= 0) {
      setSelectedSeats((prevSeats) =>
        prevSeats.filter((_, index) => index !== seatIndex)
      );
    } else if (selectedSeats.length < tickets) {
      setSelectedSeats((prevSeats) => [...prevSeats, [row, col]]);
    }
  };


  // Handle reservation data fetching
  const handleTimeClick = async (screening) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/theatre/getReservations/${encodeURIComponent(
          screening.theatre
        )}/${encodeURIComponent(screening.roomNumber)}/${encodeURIComponent(
          screening.date_and_time
        )}`
      );
      const data = await response.json();
      setReservationData(data);
      setSelectedScreening(screening);
      setOpenSeatSelector(true);
    } catch (error) {
      console.error("Error fetching reservation data:", error);
    } finally {
      setLoading(false);
    }
  };
   


  const handleReservation = async () => {
    if (!reservationData || selectedSeats.length !== Number(tickets)) return;
    setLoading(true);
    const failures = [];

    for (const [row, col] of selectedSeats) {
      const screeningDTO = {
        theatre: selectedScreening.theatre,
        roomNumber: reservationData[3],
        date_and_time: selectedScreening.date_and_time,
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
        `Some seats could not be reserved: ${failures
          .map((f) => `Row ${f.seat[0]}, Col ${f.seat[1]}`)
          .join(", ")}`
      );
    } else {
      alert("All seats reserved successfully!");
      setSelectedSeats([]);
      setOpenSeatSelector(false);
    }
  };



  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>


    <Box
      sx={{
        marginTop:'3%',
        width:'100%',
        maxHeight:'100%',
        maxWidth:'100%',
        overflowY:'auto'
      }}
    >
      <DatePicker
        value={selectedDate}
        onChange={handleDateChange}
        format="dd/MM/yyyy"
        disablePast
        sx={{
          width:'150px',
          position: "absolute",
          top: "15px",
          right: "15px",
          backgroundColor: "white",
          borderRadius: "4px",
        }}
      />
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          

        {Object.keys(groupedScreenings).length > 0 ? (
        Object.entries(groupedScreenings).map(([theatre, screenings]) => (
            <Box key={theatre} sx={{ display:'flex', flexDirection:'column', marginBottom: "16px", padding:'15px', gap:3 }}>
            <Typography variant="neonCyan" fontSize={'25px'}>
                {theatre}:
            </Typography>
            <Box sx={{display:'flex', flexDirection:'row', flexWrap:'wrap'}}>
            {screenings.map(({ time, language, screening }) => (
                <Button
                key={`${theatre}-${time}`}
                onClick={() => handleTimeClick(screening)}
                variant="outlinedPink"
                sx={{fontSize:'0.6vw', padding:1}}
                >
                {time.substring(0,5)} ({language})
                </Button>
            ))}
            </Box>
            </Box>
        ))
        ) : (
        <Typography marginLeft={'5%'} marginTop={'4%'} fontSize={'1.2rem'} color="error">No tenemos funciones ese día. Lo sentimos!</Typography>
        )}


        </>
      )}
      <Dialog
          open={openSeatSelector}
          onClose={() => {setOpenSeatSelector(false);setSelectedSeats([])}}
        >
          <DialogTitle>Selecciona tus asientos</DialogTitle>
          <DialogContent>
            <Box sx={{display:'flex', flexDirection:'row', maxWidth:'55vw', gap:3}}>
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
            {selectedScreening && (
              <Box sx={{display:'flex', flexDirection:'column', flexGrow:1, gap:4}}>
                <Typography variant="h6" gutterBottom>
                  <strong>Película:</strong> {selectedScreening.movieTitle}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <strong>Sucursal:</strong> {selectedScreening.theatre}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                  <strong>Sala:</strong> {selectedScreening.roomNumber}
                  </Typography>
                <Typography variant="h6" gutterBottom>
                  <strong>Fecha:</strong> {format(new Date(selectedScreening.date_and_time.substring(0,10) + 'T00:00:00'),"dd/MM/yyyy")}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <strong>Hora:</strong> {selectedScreening.date_and_time.substring(11,16)}
                </Typography>
                <TextField
                  label="¿Cuántos asientos?"
                  type="number"
                  value={tickets}
                  onChange={(e) =>
                    setTickets(Math.max(1, Math.min(e.target.value, 10)))
                  }
                  fullWidth
                />
              </Box>
            )}
            </Box>
          </DialogContent>
          <DialogActions>
          <Button
              onClick={()=>{setOpenSeatSelector(false); setSelectedSeats([])}}
              disabled={selectedSeats.length !== Number(tickets)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleReservation}
              disabled={selectedSeats.length !== Number(tickets)}
            >
              Reservar
            </Button>
          </DialogActions>
        </Dialog>

    </Box>

</LocalizationProvider>

  );
};

export default ScreeningsBox;
