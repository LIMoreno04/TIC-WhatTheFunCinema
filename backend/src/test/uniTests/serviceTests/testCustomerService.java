package serviceTests;

import com.um.edu.uy.entities.ids.*;
import com.um.edu.uy.entities.plainEntities.*;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.*;
import com.um.edu.uy.services.CustomerService;
import com.um.edu.uy.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class testCustomerService {

    @Mock
    private CustomerRepository customerRepo;

    @Mock
    private UserService userService;

    @Mock
    private ScreeningRepository screeningRepo;

    @Mock
    private ReservationRepository reservationRepo;

    @Mock
    private CardRepository cardRepo;

    @Mock
    private MovieCustomerRankRepository movieCustomerRankRepo;

    @Mock
    private SnackPurchaseRepository customerSnackRepo;

    @InjectMocks
    private CustomerService customerService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void findCustomer_ValidEmailAndPassword_ReturnsCustomer() throws InvalidDataException {
        String email = "test@example.com";
        String password = "password";
        Customer mockCustomer = new Customer();
        mockCustomer.setEmail(email);
        mockCustomer.setPassword(password);

        when(customerRepo.findById(email)).thenReturn(Optional.of(mockCustomer));

        Customer result = customerService.findCustomer(email, password);

        assertNotNull(result);
        assertEquals(email, result.getEmail());
    }

    @Test
    void findCustomer_InvalidPassword_ThrowsException() {
        String email = "test@example.com";
        String password = "wrongPassword";
        Customer mockCustomer = new Customer();
        mockCustomer.setEmail(email);
        mockCustomer.setPassword("correctPassword");

        when(customerRepo.findById(email)).thenReturn(Optional.of(mockCustomer));

        InvalidDataException exception = assertThrows(InvalidDataException.class,
                () -> customerService.findCustomer(email, password));
        assertEquals("Wrong password.", exception.getMessage());
    }

    @Test
    void addCustomer_ValidData_ReturnsNewCustomer() {
        String email = "test@example.com";
        String password = "password";
        LocalDate dob = LocalDate.of(2000, 1, 1);

        Customer mockCustomer = Customer.customerBuilder()
                .email(email)
                .password(password)
                .dateOfBirth(dob)
                .build();

        when(customerRepo.save(any(Customer.class))).thenReturn(mockCustomer);

        Customer result = customerService.addCustomer(email, "First", "Last", dob,
                "+1", "123456789", "ID", "US", "12345", password);

        assertNotNull(result);
        assertEquals(email, result.getEmail());
    }

    @Test
    void testAddCard_NewCard_Success() throws InvalidDataException {
        // Datos simulados
        String email = "test@example.com";
        String cardNumber = "1234567890123456";
        YearMonth expirationDate = YearMonth.of(2025, 12);
        Customer mockCustomer = new Customer();
        mockCustomer.setEmail(email);
        mockCustomer.setPaymentMethods(new LinkedList<>());

        // Configurar el comportamiento del mock
        Mockito.when(customerRepo.findById(email)).thenReturn(Optional.of(mockCustomer));
        Mockito.when(cardRepo.existsByCardNumberAndCardTypeAndExpirationDateAndCvvAndHolderName(
                cardNumber, "VISA", expirationDate.toString(), "123", "Card Holder"
        )).thenReturn(false);
        Mockito.when(cardRepo.save(Mockito.any(Card.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Ejecutar el método bajo prueba
        Card result = customerService.addCard(email, "VISA", "Card Holder", cardNumber, expirationDate, "123");

        // Verificar el resultado
        assertNotNull(result);
        assertEquals(cardNumber, result.getCardNumber());
        assertEquals("VISA", result.getCardType());
        assertEquals("Card Holder", result.getHolderName());
        assertEquals(expirationDate.toString(), result.getExpirationDate());
        assertTrue(mockCustomer.getPaymentMethods().contains(result));

        // Verificar interacciones con los mocks
        Mockito.verify(customerRepo).findById(email);
        Mockito.verify(cardRepo).existsByCardNumberAndCardTypeAndExpirationDateAndCvvAndHolderName(
                cardNumber, "VISA", expirationDate.toString(), "123", "Card Holder"
        );
        Mockito.verify(cardRepo).save(Mockito.any(Card.class));
    }

    @Test
    void makeReservation_CustomerNotFound_ThrowsException() {
        String email = "nonexistent@example.com";

        when(customerRepo.findById(email)).thenReturn(Optional.empty());

        InvalidDataException exception = assertThrows(
                InvalidDataException.class,
                () -> customerService.makeReservation(email, 5, 3, new Screening())
        );

        assertEquals("Customer not found.", exception.getMessage());
        verify(customerRepo).findById(email);
    }

    @Test
    void makeReservation_ScreeningNotFound_ThrowsException() {
        String email = "test@example.com";
        int col = 5, row = 3;

        // Configuración del cliente
        Customer customer = new Customer();
        customer.setEmail(email);

        // Configuración de la sala
        Room room = new Room();
        room.setRows(10);
        room.setColumns(10);

        // Configuración del teatro
        Theatre theatre = new Theatre();
        theatre.setLocation("Theatre Location");
        room.setTheatre(theatre);
        room.setRoom_number(1);

        // Configuración de la proyección
        Screening screening = Screening.builder()
                .room(room)
                .date_and_time(LocalDateTime.now().plusDays(1))
                .build();

        ScreeningID screeningID = new ScreeningID(
                new RoomID(theatre.getLocation(), room.getRoom_number()),
                screening.getDate_and_time()
        );

        // Configurar mocks
        when(customerRepo.findById(email)).thenReturn(Optional.of(customer));
        when(screeningRepo.findById(screeningID)).thenReturn(Optional.empty());

        // Ejecutar y verificar la excepción
        InvalidDataException exception = assertThrows(
                InvalidDataException.class,
                () -> customerService.makeReservation(email, col, row, screening)
        );

        // Validaciones
        assertEquals("Screening not found.", exception.getMessage());
        verify(customerRepo).findById(email);
        verify(screeningRepo).findById(screeningID);
    }

    @Test
    void makeReservation_ValidData_ReturnsReservation() throws InvalidDataException {
        String email = "test@example.com";
        int col = 5, row = 3;

        // Configuración del cliente
        Customer customer = new Customer();
        customer.setEmail(email);

        // Configuración del teatro
        Theatre theatre = new Theatre();
        theatre.setLocation("Theatre Location");

        // Configuración de la sala
        Room room = new Room();
        room.setRows(10);
        room.setColumns(10);
        room.setRoom_number(1);
        room.setTheatre(theatre);

        // Configuración de la proyección
        LocalDateTime screeningDate = LocalDateTime.now().plusDays(1);
        Screening screening = Screening.builder()
                .room(room)
                .date_and_time(screeningDate)
                .build();

        ScreeningID screeningID = new ScreeningID(
                new RoomID(theatre.getLocation(), room.getRoom_number()),
                screeningDate
        );

        // Configuración del mock para la reserva
        when(customerRepo.findById(email)).thenReturn(Optional.of(customer));
        when(screeningRepo.findById(screeningID)).thenReturn(Optional.of(screening));
        when(reservationRepo.findByScreeningAndColAndRow(screening, col, row)).thenReturn(Optional.empty());

        // Ejecutar el método
        Reservation reservation = customerService.makeReservation(email, col, row, screening);

        // Verificaciones
        assertNotNull(reservation, "La reserva no debe ser nula");
        assertEquals(col, reservation.getCol(), "La columna de la reserva no coincide");
        assertEquals(row, reservation.getRow(), "La fila de la reserva no coincide");
        assertEquals(customer, reservation.getCustomer(), "El cliente de la reserva no coincide");
        assertEquals(screening, reservation.getScreening(), "La proyección de la reserva no coincide");

        // Verificar interacciones con los mocks
        verify(customerRepo).findById(email);
        verify(screeningRepo).findById(screeningID);
        verify(reservationRepo).findByScreeningAndColAndRow(screening, col, row);
    }

    @Test
    void cancelReservation_ValidData_CancelsReservation() throws InvalidDataException {
        String email = "test@example.com";
        int col = 5, row = 3;

        // Configuración del cliente
        Customer customer = new Customer();
        customer.setEmail(email);
        customer.setReservations(new ArrayList<>());

        // Configuración del teatro
        Theatre theatre = new Theatre();
        theatre.setLocation("Theatre Location");

        // Configuración de la sala
        Room room = new Room();
        room.setRows(10);
        room.setColumns(10);
        room.setRoom_number(1);
        room.setTheatre(theatre);

        // Configuración de la proyección
        LocalDateTime screeningDate = LocalDateTime.now().plusDays(1); // Screening en el futuro
        Screening screening = Screening.builder()
                .room(room)
                .date_and_time(screeningDate)
                .reservations(new ArrayList<>())
                .build();

        // Configuración de la reserva
        Reservation reservation = Reservation.builder()
                .customer(customer)
                .screening(screening)
                .col(col)
                .row(row)
                .build();

        customer.getReservations().add(reservation);
        screening.getReservations().add(reservation);

        // Configuración de los mocks
        when(customerRepo.findByEmail(email)).thenReturn(Optional.of(customer));
        when(reservationRepo.findByScreeningAndColAndRow(screening, col, row)).thenReturn(Optional.of(reservation));

        // Ejecutar el método
        customerService.cancelReservation(email, col, row, screening);

        // Verificaciones
        verify(reservationRepo).delete(reservation);
        verify(screeningRepo).save(screening);
        verify(customerRepo).save(customer);

        assertFalse(customer.getReservations().contains(reservation), "La reserva debería haber sido eliminada de las reservas del cliente.");
        assertFalse(screening.getReservations().contains(reservation), "La reserva debería haber sido eliminada de las reservas de la proyección.");
    }

    @Test
    void rankMovie_ValidData_ReturnsSavedRank() {
        // Datos de prueba
        Movie movie = new Movie();
        movie.setId(1L);

        Customer customer = new Customer();
        customer.setEmail("test@example.com");

        int rank = 5;

        CustomerRankID id = new CustomerRankID(customer.getEmail(), movie.getId());

        // Configuración de mocks
        when(movieCustomerRankRepo.findById(id)).thenReturn(Optional.empty()); // No existe ranking previo
        MovieCustomerRank newRank = MovieCustomerRank.builder()
                .movieId(movie)
                .customerEmail(customer)
                .rank(rank)
                .build();
        when(movieCustomerRankRepo.save(any(MovieCustomerRank.class))).thenReturn(newRank);

        // Llamada al método
        MovieCustomerRank result = customerService.rankMovie(movie, customer, rank);

        // Verificaciones
        assertNotNull(result);
        assertEquals(movie, result.getMovieId());
        assertEquals(customer, result.getCustomerEmail());
        assertEquals(rank, result.getRank());

        verify(movieCustomerRankRepo).findById(id);
        verify(movieCustomerRankRepo).save(any(MovieCustomerRank.class));
    }



    @Test
    void buySnack_ValidData_ReturnsSavedSnackPurchase() {
        // Datos de prueba
        Customer customer = new Customer();
        customer.setEmail("test@example.com");

        Snack snack = new Snack();
        snack.setSnackId(1L);
        snack.setSnackName("Popcorn");
        snack.setPrice((int) 10.0);

        int quantity = 3;
        double totalPrice = quantity * snack.getPrice();

        SnackPurchase snackPurchase = SnackPurchase.builder()
                .customerEmail(customer)
                .snackId(snack)
                .quantity(quantity)
                .purchasePrice((int) totalPrice)
                .build();

        // Configuración del mock
        when(customerSnackRepo.save(any(SnackPurchase.class))).thenReturn(snackPurchase);

        // Llamada al método
        SnackPurchase result = customerService.buySnack(customer, snack, quantity);

        // Verificaciones
        assertNotNull(result);
        assertEquals(customer, result.getCustomerEmail());
        assertEquals(snack, result.getSnackId());
        assertEquals(quantity, result.getQuantity());
        assertEquals(totalPrice, result.getPurchasePrice());

        verify(customerSnackRepo).save(any(SnackPurchase.class));
    }
}
