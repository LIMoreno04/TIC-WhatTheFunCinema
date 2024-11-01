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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("api/customer")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CustomerRestController {

    @Autowired
    private CustomerService customerService;

//    @PostMapping("/signup")
//    public ResponseEntity<Customer> customerSignUp(@RequestBody String email, HttpSession session) throws InvalidDataException {
//       Customer newCustomer = customerService.addCustomer(email);
//       session.setAttribute("role", "customer");
//       return ResponseEntity.ok(newCustomer);
//    }

    @PostMapping("/signup")
    public ResponseEntity<Customer> customerSignUp(@RequestBody UserDTO userDTO, HttpSession session) {
        System.out.println(userDTO.toString());

        String realCelCountryCode = CountryCode.valueOf(userDTO.getCelCountryCode().toUpperCase()).getCountryName();
        String realIdType = IdDocumentType.valueOf(userDTO.getIdType()).getType();
        String realIdCountryCode = CountryCode.valueOf(userDTO.getIdCountry().toUpperCase()).getCountryName();
        LocalDate realDateOfBirth = LocalDate.parse(userDTO.getDateOfBirth());

        Customer newCustomer = customerService.addCustomer(
                userDTO.getEmail(),
                userDTO.getFirstName(),
                userDTO.getLastName(),
                realDateOfBirth,
                realCelCountryCode,
                userDTO.getCelNumber(),
                realIdType,
                realIdCountryCode,
                userDTO.getIdNumber(),
                userDTO.getPassword()
        );
        session.setAttribute("user", newCustomer);
        session.setAttribute("role", "customer");
        session.setAttribute("auth", true);
        System.out.println("Session ID: " + session.getId());

        return ResponseEntity.ok(newCustomer);
    }

    @PostMapping("/makeReservation")
    public ResponseEntity<Reservation> makeReservation(@RequestParam String email, @RequestParam Integer col, @RequestParam Integer row, @RequestBody Screening screening) throws InvalidDataException {
        Reservation reservation = customerService.makeReservation(email, col, row, screening);
        return ResponseEntity.ok(reservation);
    }
    @DeleteMapping("/cancelReservation")
    public ResponseEntity<String> cancelReservation(@RequestParam String email, @RequestBody Reservation reservation) throws InvalidDataException {
        customerService.cancelReservation(email, reservation);
        return ResponseEntity.ok("Reservation canceled successfully.");
    }
}