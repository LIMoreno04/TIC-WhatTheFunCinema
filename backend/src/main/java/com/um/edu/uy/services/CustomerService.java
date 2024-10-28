package com.um.edu.uy.services;

import com.um.edu.uy.entities.Customer;
import com.um.edu.uy.entities.User;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.CustomerRepository;
import com.um.edu.uy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {
    @Autowired
    CustomerRepository customerRepo;

    @Autowired
    UserRepository userRepo;

    public List<Customer> getAll() {return customerRepo.findAll();}

    public Customer addCustomer(String email) throws InvalidDataException {
        Optional<User> result = userRepo.findById(email);

        if (result.isPresent()) {
            User user = result.get();
            Customer customer = (Customer) user;

            return customerRepo.save(customer);
        } else {
            throw new InvalidDataException("Usuario no encontrado");
        }
    }

}
