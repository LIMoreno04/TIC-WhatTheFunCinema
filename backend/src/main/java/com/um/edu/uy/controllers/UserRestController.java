package com.um.edu.uy.controllers;

import com.um.edu.uy.entities.DTOs.BirthdateDTO;
import com.um.edu.uy.entities.DTOs.CelNumberDTO;
import com.um.edu.uy.entities.DTOs.PasswordChangeDTO;
import com.um.edu.uy.entities.plainEntities.User;
import com.um.edu.uy.entities.DTOs.UserDTO;
import com.um.edu.uy.exceptions.InvalidDataException;
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
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("api/user")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserRestController {

    @Autowired
    private UserService userService;


    @PostMapping("/login")
    public ResponseEntity<?> userLogIn(@RequestBody UserDTO loginDTO, HttpSession session) {


        try {
            User user = userService.findUser(loginDTO.getEmail(), loginDTO.getPassword());

            // Store user in session
            session.setAttribute("user", user);
            session.setAttribute("role", userService.getRole(user.getEmail()));

            System.out.println("login");


            User savedUser = (User) session.getAttribute("user");

            System.out.println("Nombre login: " + savedUser.getFirstName());

            System.out.println("Session ID: " + session.getId());

            return ResponseEntity.ok(user);
        } catch (InvalidDataException e) {
            String errorMessage = e.getMessage();
            if (errorMessage.contains("email")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "email"));
            } else if (errorMessage.contains("password")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "password"));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "unknown"));
            }
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate(); // Invalidate the session
        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/role")
    public ResponseEntity<String> getSessionRole(HttpSession session) {
        System.out.println("getRole");
        System.out.println("Session ID: " + session.getId() + "\nRole: " + session.getAttribute("role"));

        String role = (String) session.getAttribute("role");
        return ResponseEntity.ok(Objects.requireNonNullElse(role, "notLoggedIn"));
    }


    @PutMapping("/change-firstname")
    public ResponseEntity<?> updateFirstName(
            HttpSession session,
            @RequestBody Map<String,String> payload) throws InvalidDataException {
        String newFirstName = payload.get("newFirstName");
        if (newFirstName.isBlank()) {
            HashMap<String,String> errors = new HashMap<>();
            errors.put("firstName", "El campo no puede estar vacío.");
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
        else {
            User user = (User) session.getAttribute("user");
            String email = user.getEmail();
            String password = user.getPassword();
            if (!Objects.equals(user.getFirstName(), newFirstName)) {
                userService.updateFirstName(email, password, newFirstName);
                session.setAttribute("user", userService.findUser(email, password));
            }
            return ResponseEntity.ok(session.getAttribute("user"));
        }
    }

    @PutMapping("/change-lastname")
    public ResponseEntity<?> updateLastName(
            HttpSession session,
            @RequestBody Map<String,String> payload) throws InvalidDataException {
        String newLastName = payload.get("newLastName");
        if (newLastName.isBlank()) {
            HashMap<String, String> errors = new HashMap<>();
            errors.put("firstName", "El campo no puede estar vacío.");
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
        else {
            User user = (User) session.getAttribute("user");
            String email = user.getEmail();
            String password = user.getPassword();
            if (!Objects.equals(user.getLastName(), newLastName)) {
                userService.updateLastName(email, password, newLastName);
                session.setAttribute("user", userService.findUser(email, password));

            }
            return ResponseEntity.ok(session.getAttribute("user"));
        }
    }

    @PutMapping("/change-dateofbirth")
    public ResponseEntity<?> updateDateOfBirth(
            HttpSession session,
            @RequestBody @Valid BirthdateDTO payload) throws InvalidDataException {
        LocalDate newDateOfBirth = payload.getDateOfBirth();
        User user = (User) session.getAttribute("user");
        String email = user.getEmail();
        String password = user.getPassword();
        if (!Objects.equals(user.getDateOfBirth(), newDateOfBirth)) {
            userService.updateDateOfBirth(email,password,newDateOfBirth);
            session.setAttribute("user",userService.findUser(email,password));

        }
        return ResponseEntity.ok(session.getAttribute("user"));
    }


    @PutMapping("/change-celnumber")
    public ResponseEntity<?> updateCelNumber(
            HttpSession session,
            @RequestBody @Valid CelNumberDTO payload) throws InvalidDataException {
        String newCelNumber = (Character.getNumericValue(payload.getCelNumber().charAt(0))==0) ? payload.getCelNumber().substring(1) : payload.getCelNumber();;
        String newCelCountryCode = payload.getCelCountryCode();
        User user = (User) session.getAttribute("user");
        String email = user.getEmail();
        String password = user.getPassword();
        if (!Objects.equals(user.getCelCountryCode(), newCelCountryCode)) {
            userService.updateCelCountryCode(email,password,newCelCountryCode);
            session.setAttribute("user",userService.findUser(email,password));
        }
        if (!Objects.equals(user.getCelNumber(),newCelNumber)) {
            userService.updateCelNumber(email,password,newCelNumber);
            session.setAttribute("user",userService.findUser(email,password));
        }
        return ResponseEntity.ok(session.getAttribute("user"));
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> updatePassword(
            HttpSession session, @RequestBody @Valid PasswordChangeDTO payload) throws InvalidDataException {
        String email = ((User) session.getAttribute("user")).getEmail();
        String oldPassword = payload.getOldPassword();
        String newPassword = payload.getNewPassword();
        if (!Objects.equals(oldPassword, ((User) session.getAttribute("user")).getPassword())) {
            HashMap<String,String> errors = new HashMap<>();
            errors.put("oldPassword", "Contraseña incorrecta.");
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
        if(!Objects.equals(oldPassword,newPassword)) {
            userService.updatePassword(email, oldPassword, newPassword);
            session.setAttribute("user",userService.findUser(email,newPassword));
        }
        return ResponseEntity.ok(session.getAttribute("user"));
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