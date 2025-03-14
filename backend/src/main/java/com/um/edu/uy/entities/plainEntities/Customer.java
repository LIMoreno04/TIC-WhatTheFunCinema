package com.um.edu.uy.entities.plainEntities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Customer extends User {

    @JsonManagedReference
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "customer_card",
            joinColumns = @JoinColumn(name = "email"),
            inverseJoinColumns = @JoinColumn(name = "cardNumber")
    )
    private List<Card> paymentMethods;

    @Builder(builderMethodName = "customerBuilder")
    public Customer(String email, String firstName, String lastName, LocalDate dateOfBirth, String celCountryCode, String celNumber, String idType, String idCountry, String idNumber, String password) {
        super(email, firstName, lastName, dateOfBirth, celCountryCode, celNumber, idType, idCountry, idNumber, password);
    }

    @JsonManagedReference
    @OneToMany(fetch = FetchType.EAGER,mappedBy = "customer",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reservation> reservations = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(fetch = FetchType.EAGER,mappedBy = "customerEmail", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MovieCustomerRank> ratings;

}