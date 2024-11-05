package com.um.edu.uy.controllers;

import com.um.edu.uy.entities.DTOs.UserDTO;
import com.um.edu.uy.entities.plainEntities.Reservation;
import com.um.edu.uy.entities.plainEntities.Screening;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.services.CustomerService;
import com.um.edu.uy.services.RoomService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("api/rooms")
public class RoomRestController {
    @Autowired
    private RoomService roomService;

    @PostMapping("/addScreeningToRoom")
    public ResponseEntity<?> addScreeningToRoom(@RequestParam String theatreLocation, @RequestParam int roomNumber, @RequestParam long movieID, @RequestParam String language, @RequestParam String dateTime) {

        try {
            LocalDateTime date_and_time = LocalDateTime.parse(dateTime);
            roomService.addScreeningToRoom(theatreLocation, roomNumber, movieID, language, date_and_time);
            return ResponseEntity.status(HttpStatus.CREATED).body("Screening added successfully.");
        } catch (InvalidDataException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while adding the screening.");
        }
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
            boolean available = roomService.checkIfAvailable(screening, col, row);
            return ResponseEntity.ok(available);
        } catch (InvalidDataException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }


}
