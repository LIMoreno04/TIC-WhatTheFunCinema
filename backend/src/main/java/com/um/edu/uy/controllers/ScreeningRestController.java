package com.um.edu.uy.controllers;

import com.um.edu.uy.entities.DTOs.ScreeningDTO;
import com.um.edu.uy.entities.plainEntities.Screening;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.services.ScreeningService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("api/screening")
public class ScreeningRestController {
    @Autowired
    private ScreeningService screeningService;

    @PostMapping("/add")
    public ResponseEntity<?> addScreening(@RequestBody @Valid ScreeningDTO screeningDTO) {

        Map<String, String> errors = new HashMap<>();

        String language = screeningDTO.getLanguage();
        long movieId = screeningDTO.getMovieId();
        String theatre = screeningDTO.getTheatre();
        LocalDateTime date_and_time = screeningDTO.getDate_and_time();
        int roomNumber = screeningDTO.getRoomNumber();
        int price = screeningDTO.getScreeningPrice();


        if (!Pattern.matches("^(E|S)$", language)) {
            errors.put("language", "Lenguaje invalido.");
        }

        if (date_and_time.isBefore(LocalDateTime.now())) {
            errors.put("date_and_time", "Fecha invalida. Debe ser una fecha a futuro.");
        }
        if (!errors.isEmpty()) {
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
        try {
            Screening screening = screeningService.addScreening(movieId,price,date_and_time,roomNumber,theatre,language);
            return ResponseEntity.ok(screening);
        }
        catch (InvalidDataException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

    }


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        // Collect all field validation errors
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }

        // Return error map with a BAD_REQUEST status
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }
}
