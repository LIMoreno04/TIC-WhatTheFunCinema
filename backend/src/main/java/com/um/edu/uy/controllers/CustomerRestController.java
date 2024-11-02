package com.um.edu.uy.controllers;

import com.um.edu.uy.entities.plainEntities.Customer;
import com.um.edu.uy.entities.DTOs.UserDTO;
import com.um.edu.uy.entities.plainEntities.Reservation;
import com.um.edu.uy.entities.plainEntities.Screening;
import com.um.edu.uy.enums.CountryCode;
import com.um.edu.uy.enums.IdDocumentType;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.services.CustomerService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/customer")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CustomerRestController {

    @Autowired
    private CustomerService customerService;


    @PostMapping("/signup")
    public ResponseEntity<?> customerSignUp(@Valid @RequestBody UserDTO userDTO, HttpSession session) {
        // Extract valid enum values to avoid invalid data in the `addCustomer` method
        String realCelCountryCode = CountryCode.valueOf(userDTO.getCelCountryCode().toUpperCase()).getCountryName();
        String realIdType = IdDocumentType.valueOf(userDTO.getIdType()).getType();
        String realIdCountryCode = CountryCode.valueOf(userDTO.getIdCountry().toUpperCase()).getCountryName();

        // Call the service to add a new customer
        Customer newCustomer = customerService.addCustomer(
                userDTO.getEmail(),
                userDTO.getFirstName(),
                userDTO.getLastName(),
                userDTO.getDateOfBirth(),
                realCelCountryCode,
                userDTO.getCelNumber(),
                realIdType,
                realIdCountryCode,
                userDTO.getIdNumber(),
                userDTO.getPassword()
        );

        // Set session attributes
        session.setAttribute("user", newCustomer);
        session.setAttribute("role", "customer");
        System.out.println("Session ID: " + session.getId());

        return ResponseEntity.ok(newCustomer);
    }


    @PostMapping("/makeReservation")
    public ResponseEntity<Reservation> makeReservation(@RequestParam String email, @RequestParam Integer col, @RequestParam Integer row, @RequestBody Screening screening) throws InvalidDataException {
        Reservation reservation = customerService.makeReservation(email, col, row, screening);
        return ResponseEntity.ok(reservation);
    }
    @DeleteMapping("/reservations")
    public ResponseEntity<String> cancelReservation(@RequestParam String email, @RequestParam Integer col, @RequestParam Integer row, @RequestBody Screening screening) {
        try {
            customerService.cancelReservation(email, col, row, screening);
            return ResponseEntity.ok("Reservation canceled successfully.");
        } catch (InvalidDataException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Exception handler for validation errors
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