package com.um.edu.uy.controllers;

import com.um.edu.uy.entities.DTOs.NewTheatreDTO;
import com.um.edu.uy.entities.plainEntities.Room;
import com.um.edu.uy.entities.plainEntities.Theatre;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.services.TheatreService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("api/theatre")
public class TheatreRestController {

    @Autowired
    TheatreService theatreService;


    @GetMapping("/rooms/{theatre}")
    public ResponseEntity<?> getAllRooms(@PathVariable String theatre) {
        try {
            return ResponseEntity.ok(theatreService.findAllRooms(theatre));
        } catch (InvalidDataException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Sucursal no encontrada.");
        }
    }

    @GetMapping("/allLocations")
    public ResponseEntity<List<String>> findAll() { return ResponseEntity.ok(theatreService.findAllLocations()); }


    @PostMapping("/add")
    public ResponseEntity<?> addTheatre(@Valid @RequestBody NewTheatreDTO theatre, HttpSession session) {
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
    @PostMapping("/addWithRooms")
    public ResponseEntity<?> addTheatreWithRooms(@Valid @RequestBody NewTheatreDTO theatre, HttpSession session){
        if (Objects.equals(session.getAttribute("role"), "employee")) {
            try {
                theatreService.addTheatreWithRooms(theatre.getLocation(), theatre.getNumberOfRooms());
                return ResponseEntity.ok(theatreService.findByLocation(theatre.getLocation()));
            } catch (InvalidDataException e) {
                HashMap<String,String> error = new HashMap<>();
                error.put("message",e.getMessage());
                return ResponseEntity.badRequest().body(error);
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso denegado.");
        }
    }

        }
