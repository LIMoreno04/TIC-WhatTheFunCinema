package com.um.edu.uy.repository;

import com.um.edu.uy.entities.plainEntities.Screening;
import com.um.edu.uy.entities.ids.ScreeningID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScreeningRepository extends JpaRepository<Screening, ScreeningID> {
}
