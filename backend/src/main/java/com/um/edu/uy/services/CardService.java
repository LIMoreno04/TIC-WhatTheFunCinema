package com.um.edu.uy.services;

import com.um.edu.uy.entities.plainEntities.Card;
import com.um.edu.uy.enums.CardType;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.CardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.YearMonth;

@Service
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

    public void removeCard(long cardNumber) {
        cardRepo.deleteById(cardNumber);
    }

}
