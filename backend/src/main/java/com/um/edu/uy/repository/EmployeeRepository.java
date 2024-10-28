package com.um.edu.uy.repository;

import com.um.edu.uy.entities.Customer;
import com.um.edu.uy.entities.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee,String> {
    Customer findByEmail(String email);
}
