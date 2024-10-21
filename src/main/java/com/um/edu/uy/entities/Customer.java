package com.um.edu.uy.entities;

import com.um.edu.uy.enums.CountryCode;
import com.um.edu.uy.enums.IdDocumentType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
//@Builder
@Entity
//@PrimaryKeyJoinColumn(name = "email")
public class Customer extends User{
    @NotNull
    @ManyToMany
    @JoinTable(
            name = "customer_card",
            joinColumns = @JoinColumn(name = "email"),
            inverseJoinColumns = @JoinColumn(name = "cardNumber")
    )
    private List<Card> paymentMethods;


    public Customer(String email, String firstName, String lastName, LocalDate dateOfBirth, CountryCode celCountryCode, long celNumber, IdDocumentType idType, CountryCode idCountry, long idNumber, String password) {
        super(email, firstName, lastName, dateOfBirth, celCountryCode, celNumber, idType, idCountry, idNumber, password);
    }

    public List<Card> getPaymentMethods() {
        return paymentMethods;
    }

    public void setPaymentMethods(List<Card> paymentMethods) {
        this.paymentMethods = paymentMethods;
    }
}