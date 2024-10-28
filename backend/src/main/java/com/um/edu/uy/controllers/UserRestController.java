package com.um.edu.uy.controllers;

import com.um.edu.uy.entities.User;
import com.um.edu.uy.entities.UserDTO;
import com.um.edu.uy.enums.CountryCode;
import com.um.edu.uy.enums.IdDocumentType;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.services.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("api/user")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserRestController {

    @Autowired
    private UserService userService;

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAll() {
        return ResponseEntity.ok(userService.getAll());
    }

    @PostMapping("/signup")
    public ResponseEntity<User> userSignUp(@RequestBody UserDTO userDTO, HttpSession session){
        System.out.println(userDTO.toString());

        String realCelCountryCode = CountryCode.valueOf(userDTO.getCelCountryCode().toUpperCase()).getCountryName();
        String realIdType = IdDocumentType.valueOf(userDTO.getIdType()).getType();
        String realIdCountryCode = CountryCode.valueOf(userDTO.getIdCountry().toUpperCase()).getCountryName();
        LocalDate realDateOfBirth = LocalDate.parse(userDTO.getDateOfBirth());


        User newUser = userService.addUser(
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

        session.setAttribute("user", newUser);
        return ResponseEntity.ok(newUser);
    }

    @GetMapping("/login")
    public ResponseEntity<User> userLogIn(@RequestBody String email, @RequestBody String password, HttpSession session) throws InvalidDataException {
        User user = userService.findUser(email, password);
        session.setAttribute("user", user);
        return ResponseEntity.ok(user);
    }

}
