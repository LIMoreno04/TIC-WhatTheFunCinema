package com.um.edu.uy.services;

import com.um.edu.uy.entities.*;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.CustomerRepository;
import com.um.edu.uy.repository.ReservationRepository;
import com.um.edu.uy.repository.ScreeningRepository;
import com.um.edu.uy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {
    @Autowired
    CustomerRepository customerRepo;

    @Autowired
    UserRepository userRepo;
    @Autowired
    private ScreeningRepository screeningRepo;

    @Autowired
    private ReservationRepository reservationRepo;


    public List<Customer> getAll() {return customerRepo.findAll();}

    public Customer addCustomer(String email) throws InvalidDataException {
        Optional<User> result = userRepo.findById(email);

        if (result.isPresent()) {
            User user = result.get();
            Customer customer = (Customer) user;

            return customerRepo.save(customer);
        } else {
            throw new InvalidDataException("User not found.");
        }
    }
    public Reservation makeReservation(String email, Integer col, Integer row, Screening screening) throws InvalidDataException {
        Optional<Customer> customerOpt = customerRepo.findById(email);
        if (customerOpt.isEmpty()) {
            throw new InvalidDataException("Customer not found.");
        }
        Customer customer = customerOpt.get();

        Optional<Screening> screeningOpt = screeningRepo.findById(new ScreeningID(new RoomID(screening.getRoom().getTheatre().getLocation(),screening.getRoom().getRoom_number()),screening.getDate_and_time()));
        if (screeningOpt.isEmpty()) {
            throw new InvalidDataException("Screening not found.");
        }

        Optional<Reservation> existingReservation = reservationRepo.findById(new ReservationId(row,col,new ScreeningID(new RoomID(screening.getRoom().getTheatre().getLocation(),screening.getRoom().getRoom_number()),screening.getDate_and_time())));
        if (existingReservation.isPresent()) {
            throw new InvalidDataException("Seat already reserved.");
        }

        Reservation reservation = Reservation.builder()
                .customer(customer)
                .screening(screening)
                .col(col)
                .row(row)
                .build();

        reservationRepo.save(reservation);
        customer.getReservations().add(reservation);
        customerRepo.save(customer);

        return reservation;
    }

    public void CancelReservation(String email, Reservation reservation) {
        if () {}
    }

}
