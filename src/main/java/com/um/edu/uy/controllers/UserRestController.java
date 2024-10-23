package com.um.edu.uy.controllers;

import com.um.edu.uy.entities.User;
import com.um.edu.uy.enums.CountryCode;
import com.um.edu.uy.enums.IdDocumentType;
import com.um.edu.uy.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("api/v1/user")
public class UserRestController {

    @Autowired
    private UserService userService;

    @GetMapping("/")
    public ResponseEntity<List<User>> getAll() {
        return ResponseEntity.ok(userService.getAll());
    }

    @PostMapping("/signup")
    public ResponseEntity<User> addFuncionario(@RequestParam String email,
                                               @RequestParam String firstName,
                                               @RequestParam String lastName,
                                               @RequestParam LocalDate dateOfBirth,
                                               @RequestParam CountryCode celCountryCode,
                                               @RequestParam long celNumber,
                                               @RequestParam IdDocumentType idType,
                                               @RequestParam CountryCode idCountry,
                                               @RequestParam long idNumber,
                                               @RequestParam String password)
    {
        User newUser = userService.addUser(email, firstName, lastName, dateOfBirth, celCountryCode, celNumber, idType, idCountry, idNumber, password);
        return ResponseEntity.ok(newUser);
    }


}
