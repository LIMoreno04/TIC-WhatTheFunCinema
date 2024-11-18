package serviceTests;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.CustomerRepository;
import com.um.edu.uy.repository.EmployeeRepository;
import com.um.edu.uy.repository.UserRepository;
import com.um.edu.uy.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.time.LocalDate;
import java.util.Optional;

import com.um.edu.uy.entities.plainEntities.User;

public class testUserService {

    @Mock
    private UserRepository userRepo;

    @Mock
    private CustomerRepository customerRepo;

    @Mock
    private EmployeeRepository employeeRepo;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this); // Inicializa los mocks y realiza la inyección
    }

    @Test
    void testAddUser_Success() {
        // Datos de entrada
        String email = "test@example.com";
        String firstName = "John";
        String lastName = "Doe";
        LocalDate dateOfBirth = LocalDate.of(1990, 1, 1);
        String celCountryCode = "+1";
        String celNumber = "5551234";
        String idType = "ID";
        String idCountry = "US";
        String idNumber = "1234567890";
        String password = "password123";

        // Configuración del mock
        User mockUser = User.builder()
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

        when(userRepo.save(any(User.class))).thenReturn(mockUser); // Simula el comportamiento del repositorio

        // Llamada al método del servicio
        User result = userService.addUser(email, firstName, lastName, dateOfBirth, celCountryCode, celNumber, idType, idCountry, idNumber, password);

        // Verificaciones
        assertNotNull(result);
        assertEquals(email, result.getEmail());
        assertEquals(firstName, result.getFirstName());
        assertEquals(lastName, result.getLastName());
        verify(userRepo, times(1)).save(any(User.class)); // Asegura que el método save se llamó una vez
    }

    @Test
    void testFindUser_Success() throws InvalidDataException {
        // Datos de prueba
        String email = "test@example.com";
        String password = "password123";

        User mockUser = User.builder()
                .email(email)
                .password(password)
                .build();

        when(userRepo.findById(email.toLowerCase())).thenReturn(Optional.of(mockUser));

        // Llamar al método
        User result = userService.findUser(email, password);

        // Verificaciones
        assertNotNull(result);
        assertEquals(email, result.getEmail());
        verify(userRepo, times(1)).findById(email.toLowerCase());
    }

    @Test
    void testFindUser_InvalidPassword() {
        // Datos de prueba
        String email = "test@example.com";
        String password = "wrongPassword";

        User mockUser = User.builder()
                .email(email)
                .password("password123")
                .build();

        when(userRepo.findById(email.toLowerCase())).thenReturn(Optional.of(mockUser));

        // Verificar excepción
        InvalidDataException exception = assertThrows(InvalidDataException.class, () -> {
            userService.findUser(email, password);
        });

        assertEquals("Wrong password.", exception.getMessage());
        verify(userRepo, times(1)).findById(email.toLowerCase());
    }

    @Test
    void testFindUser_UserNotFound() {
        // Datos de prueba
        String email = "nonexistent@example.com";
        String password = "password123";

        when(userRepo.findById(email.toLowerCase())).thenReturn(Optional.empty());

        // Verificar excepción
        InvalidDataException exception = assertThrows(InvalidDataException.class, () -> {
            userService.findUser(email, password);
        });

        assertEquals("No account registered with this email.", exception.getMessage());
        verify(userRepo, times(1)).findById(email.toLowerCase());
    }




    @Test
    void testGetRole_UserNotFound() {
        String email = "unknown@example.com";

        when(userRepo.findById(email)).thenReturn(Optional.empty());

        InvalidDataException exception = assertThrows(InvalidDataException.class, () -> {
            userService.getRole(email);
        });

        assertEquals("User not found.", exception.getMessage());
        verify(userRepo, times(1)).findById(email);
    }

    @Test
    void testUpdateFirstName_Success() throws InvalidDataException {
        String email = "test@example.com";
        String password = "password123";
        String newFirstName = "UpdatedName";

        User mockUser = User.builder()
                .email(email)
                .password(password)
                .firstName("OldName")
                .build();

        when(userRepo.findById(email.toLowerCase())).thenReturn(Optional.of(mockUser));
        when(userRepo.save(any(User.class))).thenReturn(mockUser);

        User updatedUser = userService.updateFirstName(email, password, newFirstName);

        assertNotNull(updatedUser);
        assertEquals(newFirstName, updatedUser.getFirstName());
        verify(userRepo, times(1)).save(any(User.class));
    }

    @Test
    void testUpdateLastName_Success() throws InvalidDataException {
        String email = "test@example.com";
        String password = "password123";
        String newLastName = "UpdatedLastName";

        User mockUser = User.builder()
                .email(email)
                .password(password)
                .lastName("OldLastName")
                .build();

        when(userRepo.findById(email.toLowerCase())).thenReturn(Optional.of(mockUser));
        when(userRepo.save(any(User.class))).thenReturn(mockUser);

        User updatedUser = userService.updateLastName(email, password, newLastName);

        assertNotNull(updatedUser);
        assertEquals(newLastName, updatedUser.getLastName());
        verify(userRepo, times(1)).save(any(User.class));
    }

}
