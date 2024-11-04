package com.um.edu.uy.controllers;

import com.um.edu.uy.entities.DTOs.EmployeeDTO;
import com.um.edu.uy.entities.plainEntities.Customer;
import com.um.edu.uy.entities.plainEntities.Employee;
import com.um.edu.uy.enums.CountryCode;
import com.um.edu.uy.enums.IdDocumentType;
import com.um.edu.uy.services.EmployeeService;
import com.um.edu.uy.services.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;

@RestController("/api/employee")
public class EmployeeRestController {
    @Autowired
    private UserService userService;

    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/add")
    public ResponseEntity<?> addEmployee(@Valid @RequestBody EmployeeDTO employeeDTO, HttpSession session) {
        if (!Objects.equals((String) session.getAttribute("role"),"admin")) {
            return new ResponseEntity<>("Acción no permitida",HttpStatus.FORBIDDEN);
        }
        else {
            if (userService.ExistsById(employeeDTO.getEmail().toLowerCase())) {
                Map<String, String> errors = new HashMap<>();
                errors.put("email", "Ya existe una cuenta con ese e-mail.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }
            if (Objects.equals(employeeDTO.getIdType(), "CI") && !Objects.equals(employeeDTO.getIdCountry().toUpperCase(), "UY")) {
                Map<String, String> errors = new HashMap<>();
                errors.put("idType", "Solo se aceptan cédulas uruguayas. Si no posee una, utilice pasaporte.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }
            if ((Objects.equals(employeeDTO.getIdType(), "CI") && !Pattern.matches("^\\d{7,8}$", employeeDTO.getIdNumber())) ||
                    (Objects.equals(employeeDTO.getIdType(), "Pasaporte") && !Pattern.matches("^[A-Z]{1,2}[0-9]{6,7}$", employeeDTO.getIdNumber()))) {
                Map<String, String> errors = new HashMap<>();
                errors.put("idNumber", "Número de documento inválido. Ingrese sin puntos ni guiones y verifique que el tipo de documento seleccionado coincida.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            String realCelNumber = (Character.getNumericValue(employeeDTO.getCelNumber().charAt(0)) == 0) ? employeeDTO.getCelNumber().substring(1) : employeeDTO.getCelNumber();
            String realCelCountryCode = CountryCode.valueOf(employeeDTO.getCelCountryCode().toUpperCase()).getCelCode();
            String realIdType = IdDocumentType.valueOf(employeeDTO.getIdType()).getType();
            String realIdCountryCode = CountryCode.valueOf(employeeDTO.getIdCountry().toUpperCase()).getCountryName();

            Employee newEmployee = employeeService.addEmployee(
                    employeeDTO.getEmail().toLowerCase(),
                    employeeDTO.getFirstName(),
                    employeeDTO.getLastName(),
                    employeeDTO.getDateOfBirth(),
                    realCelCountryCode,
                    realCelNumber,
                    realIdType,
                    realIdCountryCode,
                    employeeDTO.getIdNumber(),
                    employeeDTO.getPassword(),
                    employeeDTO.getAddress()
            );

            // Set session attributes
            session.setAttribute("user", newEmployee);
            session.setAttribute("role", "employee");
            System.out.println("Session ID: " + session.getId());

            return ResponseEntity.ok(newEmployee);
        }
    }

}
