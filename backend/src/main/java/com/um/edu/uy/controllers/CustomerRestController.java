package com.um.edu.uy.controllers;

import com.um.edu.uy.entities.DTOs.*;
import com.um.edu.uy.entities.plainEntities.*;
import com.um.edu.uy.enums.CardType;
import com.um.edu.uy.enums.CountryCode;
import com.um.edu.uy.enums.IdDocumentType;
import com.um.edu.uy.exceptions.InvalidDataException;

import com.um.edu.uy.services.*;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.CachedIntrospectionResults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.regex.Pattern;

@RestController
@RequestMapping("api/customer")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CustomerRestController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private UserService userService;

    @Autowired
    private MovieService movieService;

    @Autowired
    private RoomService roomService;

    @Autowired
    private SnackService snackService;

//    @Autowired
//    private HomePageMoviesRepository homePageMoviesRepo;

    @PostMapping("/signup")
    public ResponseEntity<?> customerSignUp(@Valid @RequestBody UserDTO userDTO, HttpSession session) {
        if (userService.ExistsById(userDTO.getEmail().toLowerCase())) {
            Map<String, String> errors = new HashMap<>();
            errors.put("email", "Ya existe una cuenta con ese e-mail.");
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
        if (Objects.equals(userDTO.getIdType(), "CI") && !Objects.equals(userDTO.getIdCountry().toUpperCase(), "UY")) {
            Map<String, String> errors = new HashMap<>();
            errors.put("idType", "Solo se aceptan cédulas uruguayas. Si no posee una, utilice pasaporte.");
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
        if ((Objects.equals(userDTO.getIdType(), "CI") && !Pattern.matches("^\\d{7,8}$", userDTO.getIdNumber())) ||
                (Objects.equals(userDTO.getIdType(), "Pasaporte")
                        && !Pattern.matches("^[A-Z]{1,2}[0-9]{6,7}$", userDTO.getIdNumber()))) {
            Map<String, String> errors = new HashMap<>();
            errors.put("idNumber",
                    "Número de documento inválido. Ingrese sin puntos ni guiones y verifique que el tipo de documento seleccionado coincida.");
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        String realCelNumber = (Character.getNumericValue(userDTO.getCelNumber().charAt(0)) == 0)
                ? userDTO.getCelNumber().substring(1)
                : userDTO.getCelNumber();
        String realCelCountryCode = CountryCode.valueOf(userDTO.getCelCountryCode().toUpperCase()).getCelCode();
        String realIdType = IdDocumentType.valueOf(userDTO.getIdType()).getType();
        String realIdCountryCode = CountryCode.valueOf(userDTO.getIdCountry().toUpperCase()).getCountryName();

        Customer newCustomer = customerService.addCustomer(
                userDTO.getEmail().toLowerCase(),
                userDTO.getFirstName(),
                userDTO.getLastName(),
                userDTO.getDateOfBirth(),
                realCelCountryCode,
                realCelNumber,
                realIdType,
                realIdCountryCode,
                userDTO.getIdNumber(),
                userDTO.getPassword());
        try {
            session.setAttribute("user",
                    customerService.findCustomer(newCustomer.getEmail(), newCustomer.getPassword()));
            session.setAttribute("role", "customer");
            System.out.println("Session ID: " + session.getId());
        } catch (InvalidDataException e) {
            System.out.println("FATAL ERROR");
        }
        return ResponseEntity.ok(newCustomer);
    }

    @GetMapping("/current")
    public ResponseEntity<Customer> getCurrentAccount(HttpSession session) {
        Customer customer = (Customer) session.getAttribute("user");
        return ResponseEntity.ok(customer);
    }

    @PostMapping("/makeReservation/{col}/{row}")
    public ResponseEntity<?> makeReservation(
            @PathVariable Integer col,
            @PathVariable Integer row,
            @RequestBody ScreeningDTO screeningDTO,
            HttpSession session) {
        try {
            // Obtener el email desde la sesión
            User user = (User) session.getAttribute("user");
            if (user == null || user.getEmail() == null) {
                Map<String, String> errors = new HashMap<>();
                errors.put("error", "Usuario no autenticado.");
                return new ResponseEntity<>(errors, HttpStatus.UNAUTHORIZED);
            }
            System.out.println(screeningDTO.toString());
            String email = user.getEmail();
            Screening screening = roomService.findScreeningById(screeningDTO.getTheatre(), screeningDTO.getRoomNumber(),
                    screeningDTO.getDate_and_time());
            // Llamar al servicio para crear la reserva
            Reservation reservation = customerService.makeReservation(email, col, row, screening);
            return ResponseEntity.ok(reservation);
        } catch (InvalidDataException e) {
            Map<String, String> errors = new HashMap<>();
            errors.put("error", e.getMessage());
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            Map<String, String> errors = new HashMap<>();
            errors.put("error", "Ocurrió un error inesperado. Por favor, intente nuevamente.");
            return new ResponseEntity<>(errors, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/cancelReservation/{theatre}/{roomNumber}/{date_and_time}/{row}/{col}")
    public ResponseEntity<String> cancelReservation(HttpSession session,
            @PathVariable Integer col,
            @PathVariable Integer row,
            @PathVariable String theatre,
            @PathVariable int roomNumber,
            @PathVariable LocalDateTime date_and_time) {
        try {
            Customer customer = (Customer) session.getAttribute("user");

            Screening screening = roomService.findScreeningById(theatre, roomNumber, date_and_time);

            customerService.cancelReservation(customer.getEmail(), col, row, screening);
            return ResponseEntity.ok("Reservation canceled successfully.");
        } catch (InvalidDataException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/addCard")
    public ResponseEntity<?> addCard(@Valid @RequestBody CardDTO cardDTO, HttpSession session) {
        // Validate Card Number: must be numeric and 16 digits
        if (!cardDTO.getCardNumber().matches("\\d{16}")) {
            return new ResponseEntity<>("Número de tarjeta inválido. Debe tener 16 dígitos numéricos.",
                    HttpStatus.BAD_REQUEST);
        }

        // Validate CVV: must be numeric and either 3 or 4 digits
        if (!cardDTO.getCvv().matches("\\d{3,4}")) {
            return new ResponseEntity<>("CVV inválido. Debe ser un número de 3 o 4 dígitos.", HttpStatus.BAD_REQUEST);
        }

        // Validate Expiration Date: must be in the format MM/YY and not expired
        try {
            YearMonth expirationDate = YearMonth.parse(cardDTO.getExpirationDate(),
                    DateTimeFormatter.ofPattern("MM/yy"));
            if (YearMonth.now().isAfter(expirationDate)) {
                return new ResponseEntity<>("La tarjeta ha expirado. Por favor, use una tarjeta válida.",
                        HttpStatus.BAD_REQUEST);
            }
        } catch (DateTimeParseException e) {
            return new ResponseEntity<>("Fecha de vencimiento inválida. Use el formato MM/YY.", HttpStatus.BAD_REQUEST);
        }

        // Validate Holder Name: must not be empty
        if (cardDTO.getHolderName() == null || cardDTO.getHolderName().trim().isEmpty()) {
            return new ResponseEntity<>("El nombre del titular no puede estar vacío.", HttpStatus.BAD_REQUEST);
        }

        // Validate Card Type: must match a valid CardType enum value
        try {
            CardType.valueOf(cardDTO.getCardType()); // Throws exception if invalid
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Tipo de tarjeta inválido. Por favor, seleccione un tipo de tarjeta válido.",
                    HttpStatus.BAD_REQUEST);
        }

        try {
            // Retrieve the customer from session and add the card
            Customer customer = (Customer) session.getAttribute("user");
            YearMonth expirationDate = YearMonth.parse(cardDTO.getExpirationDate(),
                    DateTimeFormatter.ofPattern("MM/yy"));
            Card newCard = customerService.addCard(
                    customer.getEmail(),
                    CardType.valueOf(cardDTO.getCardType()).getType(),
                    cardDTO.getHolderName(),
                    cardDTO.getCardNumber(),
                    expirationDate,
                    cardDTO.getCvv());
            session.setAttribute("user", customerService.findCustomer(customer.getEmail(), customer.getPassword()));
            return ResponseEntity.ok(newCard);
        } catch (InvalidDataException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/removeCard")
    public ResponseEntity<?> removeCard(@RequestBody CardDTO cardDTO, HttpSession session) {
        try {
            Customer customer = (Customer) session.getAttribute("user");
            customerService.removeCard(customer.getEmail(), cardDTO.getCardNumber());
            session.setAttribute("user", customerService.findCustomer(customer.getEmail(), customer.getPassword()));
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (InvalidDataException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/seenMovies")
    public ResponseEntity<List<Object[]>> seenMovies(HttpSession session) {
        Customer customer = (Customer) session.getAttribute("user");

        List<Object[]> seenMovies = movieService.findSeenMoviesByCustomerId(customer.getEmail());

        if (seenMovies.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(seenMovies);
        }
    }

    @PostMapping("/rankMovie")
    public ResponseEntity<?> rankMovie(@RequestBody Long movieId, @RequestBody int rank, HttpSession session)
            throws InvalidDataException {
        Customer customer = (Customer) session.getAttribute("user");

        Movie movie = movieService.findById(movieId);

        MovieCustomerRank movieRank = customerService.rankMovie(movie, customer, rank);

        if (movieRank == null) {
            return ResponseEntity.badRequest().body("Esta pelicula ya fue rankeada.");
        } else {
            return ResponseEntity.ok(movieRank);
        }
    }

    // Exception handler for validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        // Collect all field validation errors
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }

        // Return error map with a BAD_REQUEST status
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/shoppingHistory")
    public ResponseEntity<?> shoppingHistory(HttpSession session) {
        Customer customer = (Customer) session.getAttribute("user");

        List<Object[]> reservations = customerService.getReservations(customer.getEmail());

        if (reservations.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<HashMap<String, Object>> history = new LinkedList<>();

        for (Object[] res : reservations) {

            HashMap<String, Object> reservation = new HashMap<>();
            reservation.put("theatre", res[0]);
            reservation.put("roomNumber", res[1]);
            reservation.put("date_and_time", res[2]);
            reservation.put("movieTitle", res[3]);
            reservation.put("row", res[4]);
            reservation.put("col", res[5]);
            reservation.put("price", res[6]);

            history.add(reservation);
        }

        return ResponseEntity.ok(history);
    }

    @PostMapping("/buySnack")
    public ResponseEntity<?> buySnack(@RequestBody SnackPurchaseDTO snackPurchaseDTO, HttpSession session) {
        Customer customer = (Customer) session.getAttribute("user");

        Snack snack = snackService.findById(snackPurchaseDTO.getSnackId());

        SnackPurchase snackPurchase = customerService.buySnack(customer, snack, snackPurchaseDTO.getQuantity());

        return ResponseEntity.ok(snackPurchase);
    }

//    @PostMapping("/{oMovie}/{nMovie}")
//    public ResponseEntity<?> swapHomePageMovies(@PathVariable long oMovie, @PathVariable long nMovie) throws InvalidDataException {
//        HomePageMovies o = homePageMoviesRepo.findById(oMovie).get();
//
//        homePageMoviesRepo.delete(o);
//
//        HomePageMovies n = homePageMoviesRepo.save(new HomePageMovies(movieService.findById(nMovie)));
//
//        return ResponseEntity.ok(n);
//
//    }
}