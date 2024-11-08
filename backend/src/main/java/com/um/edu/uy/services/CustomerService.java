package com.um.edu.uy.services;

import com.um.edu.uy.entities.ids.ReservationId;
import com.um.edu.uy.entities.ids.RoomID;
import com.um.edu.uy.entities.ids.ScreeningID;
import com.um.edu.uy.entities.plainEntities.*;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.CustomerRepository;
import com.um.edu.uy.repository.ReservationRepository;
import com.um.edu.uy.repository.ScreeningRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepo;

    @Autowired
    private UserService userService;

    @Autowired
    private ScreeningRepository screeningRepo;

    @Autowired
    private ReservationRepository reservationRepo;


    public List<Customer> getAll() {return customerRepo.findAll();}

    public Customer findCustomer(String email, String password) throws InvalidDataException {
        Optional<Customer> result = customerRepo.findById(email);

        if (result.isPresent()) {
            Customer customer = result.get();
            if (customer.getPassword().equals(password)) {
                return customer;
            } else {
                throw new InvalidDataException("Wrong password.");
            }
        } else {
            throw new InvalidDataException("No account registered with this email.");
        }
    }

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

    public void cancelReservation(String email, Integer col, Integer row, Screening screening) throws InvalidDataException {
        Optional<Customer> customerOpt = customerRepo.findByEmail(email);
        if (customerOpt.isEmpty()) {
            throw new InvalidDataException("Customer not found.");
        }

        Customer customer = customerOpt.get();
        Optional<Reservation> reservationOpt = reservationRepo.findByScreeningAndColAndRow(screening, col, row);
        if (reservationOpt.isEmpty()) {
            throw new InvalidDataException("Reservation not found for the given screening and seat.");
        }

        Reservation reservation = reservationOpt.get();
        if (!customer.getReservations().contains(reservation)) {
            throw new InvalidDataException("Reservation not found in customer reservations.");
        }

        LocalDateTime screeningTime = screening.getDate_and_time();
        LocalDateTime currentTime = LocalDateTime.now();
        if (currentTime.isAfter(screeningTime.minusHours(2))) {
            throw new InvalidDataException("Reservations can only be canceled at least 2 hours before the screening.");
        }

        screening.getReservations().remove(reservation);
        customer.getReservations().remove(reservation);


        reservationRepo.delete(reservation);

        screeningRepo.save(screening);
        customerRepo.save(customer);
    }

    public void deleteCustomer(String email, String password) throws InvalidDataException {
        Customer customer = findCustomer(email, password);
        customerRepo.delete(customer);
        userService.deleteUser(email, password);
    }

}
