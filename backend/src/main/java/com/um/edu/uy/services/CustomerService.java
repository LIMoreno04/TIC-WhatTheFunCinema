package com.um.edu.uy.services;

import com.um.edu.uy.entities.Customer;
import com.um.edu.uy.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {
    @Autowired
    CustomerRepository customerRepo;

    public List<Customer> getAll() {return customerRepo.findAll();}

}
