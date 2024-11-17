package com.um.edu.uy.controllers;


import com.um.edu.uy.entities.DTOs.SnackDTO;
import com.um.edu.uy.entities.plainEntities.Genre;
import com.um.edu.uy.entities.plainEntities.Movie;
import com.um.edu.uy.entities.plainEntities.Snack;
import com.um.edu.uy.services.SnackService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("api/snacks")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")

public class SnackRestController {
    @Autowired
    private SnackService snackService;



    @PostMapping(value = "/addSnack", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addSnack( HttpSession session,
                                       @RequestParam("name") String name,
                                       @RequestParam("price") int price,
                                       @RequestParam("description") String description,
                                       @RequestParam("picture") MultipartFile picture) {
        if (session.getAttribute("role").equals("employee")) {

            Map<String, String> errors = new HashMap<>();

            if (name.isEmpty()) {
                errors.put("name", "El nombre no es valido.");
            }

            if (description.isEmpty()) {
                errors.put("description", "La descripcion no es valido.");
            }

            if (price < 0) {
                errors.put("price", "Precio invalido.");
            }

            byte[] posterBytes;
            try {
                posterBytes = picture.getBytes();
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error reading file.");
            }

            Snack newSnack = snackService.addSnack(name, description, posterBytes, price);

            return ResponseEntity.ok("Snack agregado.");
        } else { return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Sin permisos."); }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Snack>> showAllSnacks() {
        List<Snack> allSnacks = snackService.allSnacks();

        if (allSnacks.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(allSnacks);
        }
    }

    @GetMapping("/snackName")
    public ResponseEntity<List<Snack>> showAllSnacksByName(@RequestBody String name) {
        List<Snack> snacksFound = snackService.findSnackByName(name);

        if (snacksFound.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(snacksFound);
        }
    }

    @GetMapping("/price")
    public ResponseEntity<List<Snack>> showAllSnacksByPrice(@RequestBody int price) {
        List<Snack> snacksFound = snackService.findSnackByPrice(price);

        if (snacksFound.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(snacksFound);
        }
    }

    @PostMapping("/deleteSnack")
    public ResponseEntity<Snack> deleteSnack(@RequestBody long snackID) {
        Snack snack = snackService.findById(snackID);

        if (snack == null) {
            return ResponseEntity.notFound().build();
        } else {
            snackService.deleteSnack(snack);
            return ResponseEntity.ok(snack);
        }
    }
    @GetMapping("/{snackId}")
    public ResponseEntity<Snack> getSnackById(@PathVariable Long snackId) {
        // Buscar el snack por ID
        Snack snack = snackService.findById(snackId);

        // Si el snack no se encuentra, devolver un código 404 (Not Found)
        if (snack == null) {
            return ResponseEntity.notFound().build();
        }

        // Si el snack existe, devolverlo con un código 200 (OK)
        return ResponseEntity.ok(snack);
    }
}

