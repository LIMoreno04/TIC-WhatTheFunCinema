package com.um.edu.uy.controllers;

import com.um.edu.uy.entities.plainEntities.Theatre;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.services.TheatreService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;

@RestController("/api/theatre")
public class TheatreRestController {

    @Autowired
    TheatreService theatreService;

    @GetMapping("/all")
    public ResponseEntity<List<Theatre>> findAll() { return ResponseEntity.ok(theatreService.findAll()); }


    @PostMapping("/addTheatre")
    public ResponseEntity<?> addTheatre(@Valid @RequestBody Theatre theatre, HttpSession session) {
        if (Objects.equals(session.getAttribute("role"), "employee")) {
            try {
                Theatre addedTheatre = theatreService.addTheatre(theatre.getLocation());
                return ResponseEntity.ok(addedTheatre);
            } catch (InvalidDataException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso denegado.");
        }
    }
    @PostMapping("/addTheatreWithRooms")
    public ResponseEntity<?> addTheatreWithRooms(@Valid @RequestBody Theatre theatre, int numberOfRooms, HttpSession session){
        if (Objects.equals(session.getAttribute("role"), "employee")) {
            try {
                theatreService.addTheatreWithRooms(theatre.getLocation(), numberOfRooms);
                return ResponseEntity.ok(theatreService.findByLocation(theatre.getLocation()));
            } catch (InvalidDataException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso denegado.");
        }
    }

        }
