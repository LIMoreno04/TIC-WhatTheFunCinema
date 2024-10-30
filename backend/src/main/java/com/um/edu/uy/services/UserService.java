package com.um.edu.uy.services;

import com.um.edu.uy.entities.User;
import com.um.edu.uy.enums.CountryCode;
import com.um.edu.uy.enums.IdDocumentType;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.UserRepository;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

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
                        String celCountryCode,
                        String celNumber,
                        String idType,
                        String idCountry,
                        String idNumber,
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

    public User findUser(String email, String password) throws InvalidDataException {
        Optional<User> result = userRepo.findById(email);

        if (result.isPresent()) {
            User user = result.get();
            if (user.getPassword().equals(password)) {
                return user;
            } else {
                throw new InvalidDataException("Wrong password.");
            }
        } else {
            throw new InvalidDataException("No account registered with this email.");
        }
    }
}
