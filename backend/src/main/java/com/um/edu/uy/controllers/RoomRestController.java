package com.um.edu.uy.controllers;

import com.um.edu.uy.entities.DTOs.UserDTO;
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
    public ResponseEntity<?> getAllReservations(@RequestParam Screening screening){

    }
}
