package com.um.edu.uy.controllers;
import com.um.edu.uy.entities.DTOs.ScreeningDTO;
import com.um.edu.uy.entities.plainEntities.Reservation;
import com.um.edu.uy.entities.plainEntities.Screening;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.services.MovieService;
import com.um.edu.uy.services.RoomService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("api/rooms")
public class RoomRestController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private MovieService movieService;

    @PostMapping("/addScreening")
    public ResponseEntity<?> addScreening(@RequestBody @Valid ScreeningDTO screeningDTO, HttpSession session) {
        if (session.getAttribute("role")!=null && session.getAttribute("role").equals("employee")) {
            Map<String, String> errors = new HashMap<>();

            String language = screeningDTO.getLanguage();
            long movieId = screeningDTO.getMovieId();
            String theatre = screeningDTO.getTheatre();
            LocalDateTime date_and_time = screeningDTO.getDate_and_time();
            int roomNumber = screeningDTO.getRoomNumber();
            int price = screeningDTO.getScreeningPrice();


            if (!Pattern.matches("^(Inglés|Español)$", language)) {
                errors.put("language", "Lenguaje inválido.");
            }

            if (date_and_time.isBefore(LocalDateTime.now())) {
                errors.put("dateAndTime", "Fecha y hora inválidas. Debe ser una fecha a futuro.");
            }

            if (screeningDTO.getScreeningPrice() < 0) {
                errors.put("screeningPrice", "Ingrese un valor positivo para el precio.");
            }

            if (!errors.isEmpty()) {
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }
            try {
                if (roomService.isRoomAvailable(date_and_time, date_and_time.plus(movieService.getDurationByID(movieId)), theatre, roomNumber)) {
                    roomService.addScreening(movieId, price, date_and_time, roomNumber, theatre, language);
                    return ResponseEntity.ok("Screening added.");
                } else {
                    errors.put("room", "Sala ocupada en ese horario.");
                    return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
                }

            } catch (InvalidDataException e) {
                if (e.getMessage().contains("Movie")) {
                    errors.put("movieId", "Película no encontrada.");
                } else {
                    errors.put("Unexpected", "Error inesperado: " + e.getMessage());
                }
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
            }
        } else {return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso denegado.");}

    }

    @PostMapping("/getAllReservations")
    public ResponseEntity<List<Reservation>> getAllReservations(@RequestBody Screening screening) {
        try {
            List<Reservation> reservations = roomService.getAllReservations(screening);
            return ResponseEntity.ok(reservations);
        } catch (InvalidDataException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/checkIfAvailable")
    public ResponseEntity<Boolean> checkIfAvailable(@RequestBody Screening screening, @RequestParam int col, @RequestParam int row) {
        try {
            boolean available = roomService.checkIfSeatIsAvailable(screening, col, row);
            return ResponseEntity.ok(available);
        } catch (InvalidDataException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }


}
