package com.um.edu.uy.services;

import com.um.edu.uy.controllers.EmployeeRestController;
import com.um.edu.uy.entities.plainEntities.Customer;
import com.um.edu.uy.entities.plainEntities.Employee;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.EmployeeRepository;
import com.um.edu.uy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {
    @Autowired
    private UserRepository userRepo;

    @Autowired
    private UserService userService;

    @Autowired
    private EmployeeRepository employeeRepo;

    public List<Employee> findAll() { return employeeRepo.findAll(); }

    public Employee findEmployee(String email) throws InvalidDataException {
        Optional<Employee> result = employeeRepo.findById(email);

        if (result.isPresent()) {
            Employee emplyee = result.get();
            return emplyee;
        } else {
            throw new InvalidDataException("No account registered with this email.");
        }
    }


    public Employee addEmployee(String email,
                                String firstName,
                                String lastName,
                                LocalDate dateOfBirth,
                                String celCountryCode,
                                String celNumber,
                                String idType,
                                String idCountry,
                                String idNumber,
                                String password,
                                String address) {

        Employee newEmployee = Employee.employeeBuilder()
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
                .address(address)
                .build();

        return employeeRepo.save(newEmployee);
    }

    public void deleteEmployee(String email, String password) throws InvalidDataException {
        Employee employee = findEmployee(email);
        employeeRepo.delete(employee);
        userService.deleteUser(email, password);
    }




}
