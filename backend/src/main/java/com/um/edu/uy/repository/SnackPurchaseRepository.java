package com.um.edu.uy.repository;

import com.um.edu.uy.entities.ids.SnackPurchaseID;
import com.um.edu.uy.entities.plainEntities.SnackPurchase;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SnackPurchaseRepository extends JpaRepository<SnackPurchase, SnackPurchaseID> {

}
