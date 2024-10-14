package com.um.edu.uy.services;

import com.um.edu.uy.entities.Card;
import com.um.edu.uy.entities.Customer;
import com.um.edu.uy.entities.User;
import com.um.edu.uy.enums.CardType;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.CardRepository;
import com.um.edu.uy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.YearMonth;
import java.util.Optional;

import static com.um.edu.uy.entities.FieldValidation.*;

public class CardService {

    @Autowired
    private CardRepository cardRepo;

    public Card addCard(CardType cardType, String holderName, long cardNumber, YearMonth expirationDate, int cvv) throws InvalidDataException {
        Card card = Card.builder()
                .cardType(cardType)
                .cardNumber(cardNumber)
                .cvv(cvv)
                .expirationDate(expirationDate)
                .holderName(holderName)
                .build();

        return cardRepo.save(card);
    }

}
