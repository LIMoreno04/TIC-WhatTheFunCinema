package com.um.edu.uy.controllers;

import com.um.edu.uy.entities.User;
import com.um.edu.uy.enums.CountryCode;
import com.um.edu.uy.enums.IdDocumentType;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Optional;

import static com.um.edu.uy.entities.FieldValidation.*;

@RestController
@RequestMapping("api/v1/user")
public class UserRestController {

    @Autowired
    private UserRepository userRepo;

    @PostMapping("/signup")
    public ResponseEntity<String> customerSignUp(@RequestParam String email, @RequestParam String firstName, @RequestParam String lastName, @RequestParam LocalDate dateOfBirth, @RequestParam CountryCode celCountryCode, @RequestParam long celNumber, @RequestParam IdDocumentType idType, @RequestParam CountryCode idCountry, @RequestParam long idNumber, @RequestParam String password, HttpSession session) {
        if (userRepo.findByEmail(email) != null) {
            return ResponseEntity.badRequest().body("El nombre de usuario ya está en uso.");
        }
        if (!isEmailValid(email) || !isPasswordValid(password) || firstName == null || lastName == null ||  isBirthDateValid(dateOfBirth) || celCountryCode == null || celNumber == 0 || idType == null || idCountry == null || celCountryCode == null || idNumber == 0) {
            return ResponseEntity.badRequest().body("Los datos no son validos.");
        } else {
            User newUser = User.builder()
                    .email(email)
                    .password(password)
                    .firstName(firstName)
                    .lastName(lastName)
                    .dateOfBirth(dateOfBirth)
                    .celCountryCode(celCountryCode)
                    .celNumber(celNumber)
                    .idType(idType)
                    .idCountry(idCountry)
                    .idCountry(idCountry)
                    .build();
            session.setAttribute("user", newUser);
            userRepo.save(newUser);
        }
        return ResponseEntity.ok("Usuario registrado con éxito.");
    }

    @PostMapping("/login")
    public boolean logIn(@RequestParam String email, @RequestParam String password, HttpSession session) throws InvalidDataException {
        User user = authenticate(email, password);
        if (user != null) {
            session.setAttribute("user", user);
            return true;
        } else {
            return false;
        }
    }

    @PostMapping("/logout")
    public boolean logOut(HttpSession session) {
        session.invalidate();
        return true;
    }

    private User authenticate(String email, String password) {
        Optional<User> result = userRepo.findById(email);
        if(result.isPresent()){
            if(result.get().getPassword().equals(password)){
                return result.get();
            }
            else{
                System.out.println("Invalid password");
                return null;
            }
        }
        else{
            System.out.println("Invalid user");
            return null;
        }
    }


}
