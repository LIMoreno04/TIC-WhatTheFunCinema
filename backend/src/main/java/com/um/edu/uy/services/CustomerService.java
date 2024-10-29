package com.um.edu.uy.services;

import com.um.edu.uy.entities.Customer;
import com.um.edu.uy.entities.Reservation;
import com.um.edu.uy.entities.Screening;
import com.um.edu.uy.entities.User;
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
            throw new InvalidDataException("Usuario no encontrado");
        }
    }
    public Reservation makeReservation(String email, Integer col, Integer row, Screening screening) throws InvalidDataException {
        Optional<Customer> customerOpt = customerRepo.findById(email);
        if (customerOpt.isEmpty()) {
            throw new InvalidDataException("Cliente no encontrado");
        }
        Customer customer = customerOpt.get();

        Optional<Screening> screeningOpt = screeningRepo.findById(screening. /////);
        if (screeningOpt.isEmpty()) {
            throw new InvalidDataException("La función especificada no existe");
        }

        Optional<Reservation> existingReservation = reservationRepo.findByScreeningAndColAndRow(screening, col, row);
        if (existingReservation.isPresent()) {
            throw new InvalidDataException("El asiento ya está reservado");
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

}
