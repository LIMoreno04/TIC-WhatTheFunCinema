package com.um.edu.uy.controllers;

import com.um.edu.uy.entities.DTOs.CardDTO;
import com.um.edu.uy.entities.plainEntities.Card;
import com.um.edu.uy.entities.plainEntities.Customer;
import com.um.edu.uy.entities.DTOs.UserDTO;
import com.um.edu.uy.entities.plainEntities.Reservation;
import com.um.edu.uy.entities.plainEntities.Screening;
import com.um.edu.uy.enums.CardType;
import com.um.edu.uy.enums.CountryCode;
import com.um.edu.uy.enums.IdDocumentType;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.services.CardService;
import com.um.edu.uy.services.CustomerService;
import com.um.edu.uy.services.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;

@RestController
@RequestMapping("api/customer")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CustomerRestController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private UserService userService;

    @Autowired
    private CardService cardService;

    @PostMapping("/signup")
    public ResponseEntity<?> customerSignUp(@Valid @RequestBody UserDTO userDTO, HttpSession session) {
        if (userService.ExistsById(userDTO.getEmail().toLowerCase())) {
            Map<String, String> errors = new HashMap<>();
            errors.put("email","Ya existe una cuenta con ese e-mail.");
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
        if (Objects.equals(userDTO.getIdType(), "CI") && !Objects.equals(userDTO.getIdCountry().toUpperCase(),"UY")) {
            Map<String, String> errors = new HashMap<>();
            errors.put("idType","Solo se aceptan cédulas uruguayas. Si no posee una, utilice pasaporte.");
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
        if ((Objects.equals(userDTO.getIdType(), "CI") && !Pattern.matches("^\\d{7,8}$",userDTO.getIdNumber())) ||
                (Objects.equals(userDTO.getIdType(), "Pasaporte") && !Pattern.matches("^[A-Z]{1,2}[0-9]{6,7}$",userDTO.getIdNumber()))) {
            Map<String, String> errors = new HashMap<>();
            errors.put("idNumber","Número de documento inválido. Ingrese sin puntos ni guiones y verifique que el tipo de documento seleccionado coincida.");
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        String realCelNumber = (Character.getNumericValue(userDTO.getCelNumber().charAt(0))==0) ? userDTO.getCelNumber().substring(1) : userDTO.getCelNumber();
        String realCelCountryCode = CountryCode.valueOf(userDTO.getCelCountryCode().toUpperCase()).getCelCode();
        String realIdType = IdDocumentType.valueOf(userDTO.getIdType()).getType();
        String realIdCountryCode = CountryCode.valueOf(userDTO.getIdCountry().toUpperCase()).getCountryName();


        Customer newCustomer = customerService.addCustomer(
                userDTO.getEmail().toLowerCase(),
                userDTO.getFirstName(),
                userDTO.getLastName(),
                userDTO.getDateOfBirth(),
                realCelCountryCode,
                realCelNumber,
                realIdType,
                realIdCountryCode,
                userDTO.getIdNumber(),
                userDTO.getPassword()
        );

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
    @DeleteMapping("/cancelReservation")
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


    @PostMapping("/addCard")
    public ResponseEntity<?> addCard(@Valid @RequestBody CardDTO cardDTO) {
        YearMonth expirationDate = YearMonth.parse(cardDTO.getExpirationDate());
        String cardType = CardType.valueOf(cardDTO.getCardType()).getType();

        //Chequear que sea valido y tirar errores si no (longitudes de los numeros, si no expiró, etc)


        try {
            Card newCard = cardService.addCard(cardType, cardDTO.getHolderName(), cardDTO.getCardNumber(), expirationDate, cardDTO.getCvv());
            return new ResponseEntity<>(newCard, HttpStatus.CREATED);
        } catch (InvalidDataException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/removeCard")
    public ResponseEntity<?> removeCard(@PathVariable long cardNumber) {
        cardService.removeCard(cardNumber);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}