package com.um.edu.uy.repository;

import com.um.edu.uy.entities.plainEntities.Card;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CardRepository extends JpaRepository<Card, Long> {
    public Optional<Card> findByCardNumber(long cardNumber);
}
