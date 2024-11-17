package com.um.edu.uy.services;

import com.um.edu.uy.entities.ids.CustomerRankID;
import com.um.edu.uy.entities.ids.ReservationId;
import com.um.edu.uy.entities.ids.RoomID;
import com.um.edu.uy.entities.ids.ScreeningID;
import com.um.edu.uy.entities.plainEntities.*;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.LinkedList;
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

    @Autowired
    private CardRepository cardRepo;

    @Autowired
    private MovieCustomerRankRepository movieCustomerRankRepo;

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
        newCustomer.setPaymentMethods(new LinkedList<>());
        return customerRepo.save(newCustomer);
    }

    public Card addCard(String email, String cardType, String holderName, String cardNumber, YearMonth expirationDate, String cvv) throws InvalidDataException {
        Optional<Customer> customerOpt = customerRepo.findById(email);
        if (customerOpt.isEmpty()) {
            throw new InvalidDataException("Customer not found.");
        }
        Customer customer = customerOpt.get();
        if (cardRepo.existsByCardNumberAndCardTypeAndExpirationDateAndCvvAndHolderName(cardNumber,cardType,expirationDate.toString(),cvv,holderName)) {
            Card card = cardRepo.findByCardNumber(cardNumber).get();
            if (customer.getPaymentMethods().contains(card)) {
                return card;
            } else {
                customer.getPaymentMethods().add(card);
                card.getCustomerList().add(customer);
                cardRepo.save(card);
                return card;
            }
        }
        else {
            List<Customer> customerList = new LinkedList<>();
            Card card = Card.builder()
                .cardType(cardType)
                .cardNumber(cardNumber)
                .cvv(cvv)
                .expirationDate(expirationDate.toString())
                .holderName(holderName)
                .customerList(customerList)
                .build();

            card.getCustomerList().add(customer);
            customer.getPaymentMethods().add(card);
            card = cardRepo.save(card);


            return card;
        }

    }
    public void removeCard(String email, String cardNumber) throws InvalidDataException {
        Optional<Customer> customerOpt = customerRepo.findById(email);
        if (customerOpt.isEmpty()) {
            throw new InvalidDataException("Customer not found.");
        }
        Customer customer = customerOpt.get();
        Optional<Card> cardOpt = cardRepo.findByCardNumber(cardNumber);
        if (cardOpt.isEmpty()) {
            throw new InvalidDataException("Card not found.");
        }
        Card card = cardOpt.get();
        customer.getPaymentMethods().remove(card);
        card.getCustomerList().remove(customer);
        if(card.getCustomerList().isEmpty()) {
            cardRepo.delete(card);
        }
        customerRepo.save(customer);
    }

    @Transactional
    @jakarta.transaction.Transactional
    public Reservation makeReservation(String email, Integer col, Integer row, Screening screening) throws InvalidDataException {
        // Validar que el cliente exista
        Optional<Customer> customerOpt = customerRepo.findById(email);
        if (customerOpt.isEmpty()) {
            throw new InvalidDataException("Customer not found.");
        }
        Customer customer = customerOpt.get();

        // Validar que la proyección exista
        Optional<Screening> screeningOpt = screeningRepo.findById(
                new ScreeningID(
                        new RoomID(screening.getRoom().getTheatre().getLocation(), screening.getRoom().getRoom_number()),
                        screening.getDate_and_time()
                )
        );
        if (screeningOpt.isEmpty()) {
            throw new InvalidDataException("Screening not found.");
        }
        Screening validScreening = screeningOpt.get();

        // Validar que la fila y columna sean válidas según la capacidad de la sala
        Room room = validScreening.getRoom();
        if (row < 0 || col < 0) {
            throw new InvalidDataException("Row and column must be non-negative.");
        }
        if (row >= room.getRows()) {
            throw new InvalidDataException("Row exceeds the room's capacity.");
        }
        if (col >= room.getColumns()) {
            throw new InvalidDataException("Column exceeds the room's capacity.");
        }

        // Verificar que el asiento no esté reservado
        Optional<Reservation> existingReservation = reservationRepo.findByScreeningAndColAndRow(validScreening, col, row);
        if (existingReservation.isPresent()) {
            throw new InvalidDataException("Seat is already reserved.");
        }

        // Crear y guardar la reserva
        Reservation reservation = Reservation.builder()
                .customer(customer)
                .screening(validScreening)
                .col(col)
                .row(row)
                .build();

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

    public MovieCustomerRank rankMovie(Movie movieId, Customer customerEmail, int rank) {
        CustomerRankID id = new CustomerRankID(customerEmail.getEmail(), movieId.getId());
        MovieCustomerRank movieCustomerRank = movieCustomerRankRepo.findById(id).orElse(null);

        if (movieCustomerRank != null) {
            return null;
        }

        MovieCustomerRank movieRank = MovieCustomerRank.builder()
                .movieId(movieId)
                .customerEmail(customerEmail)
                .rank(rank)
                .build();

        return movieCustomerRankRepo.save(movieRank);
    }

}
