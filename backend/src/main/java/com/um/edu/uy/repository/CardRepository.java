package com.um.edu.uy.repository;

import com.um.edu.uy.entities.plainEntities.Card;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CardRepository extends JpaRepository<Card, String> {
    public Optional<Card> findByCardNumber(String cardNumber);
    public Boolean existsByCardNumberAndCardTypeAndExpirationDateAndCvvAndHolderName(String cardNumber, @NotNull String cardType, @NotNull String expirationDate, String cvv, @NotNull String holderName);
}
