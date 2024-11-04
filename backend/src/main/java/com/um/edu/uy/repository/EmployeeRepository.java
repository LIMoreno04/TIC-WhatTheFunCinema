package com.um.edu.uy.repository;

import com.um.edu.uy.entities.plainEntities.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee,String> {
    Optional<Employee> findByEmail(String email);
}
