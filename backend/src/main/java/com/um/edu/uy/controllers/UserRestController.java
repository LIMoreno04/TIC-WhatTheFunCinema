package com.um.edu.uy.controllers;

import com.um.edu.uy.entities.User;
import com.um.edu.uy.entities.UserDTO;
import com.um.edu.uy.enums.CountryCode;
import com.um.edu.uy.enums.IdDocumentType;
import com.um.edu.uy.services.UserService;
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
    public ResponseEntity<User> addFuncionario(@RequestBody UserDTO userDTO) {
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

        return ResponseEntity.ok(newUser);
    }


}
