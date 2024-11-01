package com.um.edu.uy.services;

import com.um.edu.uy.entities.plainEntities.*;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.CustomerRepository;
import com.um.edu.uy.repository.ReservationRepository;
import com.um.edu.uy.repository.ScreeningRepository;
import com.um.edu.uy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

//    public Customer addCustomer(String email) throws InvalidDataException {
//        Optional<User> result = userRepo.findById(email);
//
//        if (result.isPresent()) {
//            User user = result.get();
//            Customer customer = (Customer) user;
//
//            return customerRepo.save(customer);
//        } else {
//            throw new InvalidDataException("User not found.");
//        }
//    }

    public Customer addCustomer(String email,
                        String firstName,
                        String lastName,
                        LocalDate dateOfBirth,
                        String celCountryCode,
                        String celNumber,
                        String idType,
                        String idCountry,
                        String idNumber,
                        String password) {

        Customer newCustomer = Customer.customerBuilder()
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .dateOfBirth(dateOfBirth)
                .celCountryCode(celCountryCode)
                .celNumber(celNumber)
                .idType(idType)
                .idCountry(idCountry)
                .idNumber(idNumber)
                .password(password)
                .build();

        return customerRepo.save(newCustomer);
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

    public void cancelReservation(String email, Reservation reservation) throws InvalidDataException {
        Optional<Customer> customerOpt = customerRepo.findById(email);
        if (customerOpt.isEmpty()) {
            throw new InvalidDataException("Customer not found.");
        }

        Customer customer = customerOpt.get();
        List<Reservation> customerReservations = customer.getReservations();

        if (customerReservations.contains(reservation)) {
            Screening screening = reservation.getScreening();
            LocalDateTime screeningTime = screening.getDate_and_time();
            LocalDateTime currentTime = LocalDateTime.now();

            if (currentTime.isAfter(screeningTime.minusHours(2))) {
                throw new InvalidDataException("Reservations can only be canceled at least 2 hours before the screening.");
            }

            int row = reservation.getRow();
            int col = reservation.getCol();
            int[] seat = new int[]{row, col};

            if (screening.getReservedSeats().contains(seat)) {
                screening.getReservedSeats().removeIf(s -> s[0] == row && s[1] == col);
            } else {
                throw new InvalidDataException("The seat is already free.");
            }
            screeningRepo.save(screening);
            customerReservations.remove(reservation);
            customerRepo.save(customer);
        } else {
            throw new InvalidDataException("Reservation not found in customer reservations.");
        }
    }


}
