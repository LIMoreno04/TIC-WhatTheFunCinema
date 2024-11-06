package com.um.edu.uy.services;

import com.um.edu.uy.entities.plainEntities.Employee;
import com.um.edu.uy.entities.plainEntities.User;
import com.um.edu.uy.entities.validators.PasswordValidator;
import com.um.edu.uy.entities.validators.BirthDateValidator;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.CustomerRepository;
import com.um.edu.uy.repository.EmployeeRepository;
import com.um.edu.uy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.springframework.boot.context.properties.source.ConfigurationPropertyName.isValid;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepo;

    @Autowired
    private CustomerRepository customerRepo;
    @Autowired
    private EmployeeRepository employeeRepo;

    public List<User> getAll()
    {
        return userRepo.findAll();
    }

    public Boolean ExistsById(String email) { return userRepo.existsById(email); }
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
        Optional<User> result = userRepo.findById(email.toLowerCase());

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

    public String getRole(String email) throws InvalidDataException {
        Optional<User> result = userRepo.findById(email);
        if (result.isEmpty()) { throw new InvalidDataException("User not found."); }
        else {
            if (customerRepo.findByEmail(email).isPresent()) { return "customer"; }
            else if (employeeRepo.findByEmail(email).isPresent()) { return "employee"; }
            else { throw new RuntimeException("Fatal error: User not registered as neither customer nor employee."); }

            }
    }

    public User updateFirstName(String email, String password, String nFirstname) throws InvalidDataException {
        User user = findUser(email, password);
        user.setFirstName(nFirstname);
        return userRepo.save(user);
    }

    public User updateLastName(String email, String password, String nLastName) throws InvalidDataException {
        User user = findUser(email, password);
        user.setLastName(nLastName);
        return userRepo.save(user);
    }

    public User updateDateOfBirth(String email, String password, LocalDate nDateOfBirth) throws InvalidDataException {
        User user = findUser(email, password);
        user.setDateOfBirth(nDateOfBirth);
        return userRepo.save(user);
    }

    public User updateCelCountryCode(String email, String password, String nCelCountryCode) throws InvalidDataException {
        User user = findUser(email, password);
        user.setCelCountryCode(nCelCountryCode);
        return userRepo.save(user);
    }

    public User updateCelNumber(String email, String password, String nCelNumber) throws InvalidDataException {
        User user = findUser(email, password);
        user.setCelNumber(nCelNumber);
        return userRepo.save(user);
    }
    public User updatePassword(String email, String oPassword, String nPassword) throws InvalidDataException {
        User user = findUser(email, oPassword);
        user.setPassword(nPassword);
        return userRepo.save(user);
    }

    public void deleteUser(String email, String password) throws InvalidDataException {
        User user = findUser(email, password);
        userRepo.delete(user);
    }
}