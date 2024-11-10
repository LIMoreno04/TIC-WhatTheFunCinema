package com.um.edu.uy.controllers;

import com.um.edu.uy.entities.plainEntities.User;
import com.um.edu.uy.entities.DTOs.UserDTO;
import com.um.edu.uy.enums.CountryCode;
import com.um.edu.uy.enums.IdDocumentType;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.services.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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

    @GetMapping("/current")
    public ResponseEntity<User> getCurrentAccount(HttpSession session) {
        User user = (User)session.getAttribute("user");
        System.out.println(user);
        return ResponseEntity.ok(Objects.requireNonNullElse(user, new User()));
    }

    @PutMapping("/change-firstname")
    public User updateFirstName(
            HttpSession session,
            @RequestBody Map<String,String> payload) throws InvalidDataException {
        String email = ((User) session.getAttribute("user")).getEmail();
        String password = ((User) session.getAttribute("user")).getPassword();
        return userService.updateFirstName(email, password, payload.get("newFirstName"));
    }

    @PutMapping("/change-lastname")
    public User updateLastName(
            HttpSession session,
            @RequestBody Map<String,String> payload) throws InvalidDataException {
        String email = ((User) session.getAttribute("user")).getEmail();
        String password = ((User) session.getAttribute("user")).getPassword();
        return userService.updateLastName(email, password, payload.get("newLastName"));
    }

    @PutMapping("/change-dateofbirth")
    public User updateDateOfBirth(
            HttpSession session,
            @RequestBody Map<String,String> payload) throws InvalidDataException {
        String email = ((User) session.getAttribute("user")).getEmail();
        String password = ((User) session.getAttribute("user")).getPassword();
        return userService.updateDateOfBirth(email, password, LocalDate.parse(payload.get("newDateOfBirth")));
    }

    @PutMapping("/change-celcountrycode")
    public User updateCelCountryCode(
            HttpSession session,
            @RequestBody Map<String,String> payload) throws InvalidDataException {
        String email = ((User) session.getAttribute("user")).getEmail();
        String password = ((User) session.getAttribute("user")).getPassword();
        return userService.updateCelCountryCode(email, password, payload.get("newCelCountryCode"));
    }

    @PutMapping("/change-celnumber")
    public User updateCelNumber(
            HttpSession session,
            @RequestBody Map<String,String> payload) throws InvalidDataException {
        String email = ((User) session.getAttribute("user")).getEmail();
        String password = ((User) session.getAttribute("user")).getPassword();
        return userService.updateCelNumber(email, password, payload.get("newCelNumber"));
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> updatePassword(
            HttpSession session, @RequestParam String oldPassword,
            @RequestParam String newPassword) throws InvalidDataException {
        String email = ((User) session.getAttribute("user")).getEmail();
        if (!Objects.equals(oldPassword, ((User) session.getAttribute("user")).getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "password"));
        }
        return ResponseEntity.ok(userService.updatePassword(email, oldPassword, newPassword));
    }
}