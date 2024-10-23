package com.um.edu.uy.services;

import com.um.edu.uy.entities.User;
import com.um.edu.uy.enums.CountryCode;
import com.um.edu.uy.enums.IdDocumentType;
import com.um.edu.uy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepo;

    public List<User> getAll()
    {
        return userRepo.findAll();
    }

    public User addUser(String email,
                        String firstName,
                        String lastName,
                        LocalDate dateOfBirth,
                        CountryCode celCountryCode,
                        long celNumber,
                        IdDocumentType idType,
                        CountryCode idCountry,
                        long idNumber,
                        String password) {

        User newUser = User.builder()
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .dateOfBirth(dateOfBirth)
                .celCountryCode(celCountryCode)
                .celNumber(celNumber)
                .idType(idType)
                .idCountry(idCountry)
                .idNumber(idNumber)
                .password(password)
                .build();
        return userRepo.save(newUser);
    }

}
