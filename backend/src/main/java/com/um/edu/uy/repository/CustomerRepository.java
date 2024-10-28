package com.um.edu.uy.repository;

import com.um.edu.uy.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer,String> {
    Customer findByEmail(String email);
}
