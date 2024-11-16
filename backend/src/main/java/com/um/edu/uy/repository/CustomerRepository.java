package com.um.edu.uy.repository;

import com.um.edu.uy.entities.plainEntities.Customer;
import com.um.edu.uy.entities.plainEntities.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer,String> {
    Optional<Customer> findByEmail(String email);

}
