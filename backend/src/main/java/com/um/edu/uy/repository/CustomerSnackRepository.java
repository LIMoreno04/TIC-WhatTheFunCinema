package com.um.edu.uy.repository;

import com.um.edu.uy.entities.ids.CustomerSnackID;
import com.um.edu.uy.entities.plainEntities.CustomerSnack;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerSnackRepository extends JpaRepository<CustomerSnack, CustomerSnackID> {

}
