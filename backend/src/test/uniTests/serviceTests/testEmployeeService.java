package serviceTests;

import com.um.edu.uy.entities.plainEntities.Employee;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.EmployeeRepository;
import com.um.edu.uy.repository.UserRepository;
import com.um.edu.uy.services.EmployeeService;
import com.um.edu.uy.services.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class testEmployeeService {

    @Mock
    private EmployeeRepository employeeRepo;

    @Mock
    private UserRepository userRepo;

    @Mock
    private UserService userService;

    @InjectMocks
    private EmployeeService employeeService;

    public testEmployeeService() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void addEmployee_ValidData_ReturnsSavedEmployee() {
        // Preparación del objeto Employee
        Employee employee = Employee.employeeBuilder()
                .address("123 Main St")
                .email("test@example.com")
                .firstName("John")
                .lastName("Doe")
                .dateOfBirth(LocalDate.of(1990, 1, 1))
                .celCountryCode("+1")
                .celNumber("1234567890")
                .idType("Passport")
                .idCountry("USA")
                .idNumber("A1234567")
                .password("password123")
                .build();

        // Mocking para asegurarse de que el repositorio de Employee devuelve el empleado correctamente
        when(employeeRepo.save(any(Employee.class))).thenReturn(employee);

        // Llamada al método de servicio
        Employee result = employeeService.addEmployee(
                employee.getEmail(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getDateOfBirth(),
                employee.getCelCountryCode(),
                employee.getCelNumber(),
                employee.getIdType(),
                employee.getIdCountry(),
                employee.getIdNumber(),
                employee.getPassword(),
                employee.getAddress()
        );

        // Verificaciones
        assertNotNull(result, "El empleado guardado no debe ser nulo");
        assertEquals(employee.getEmail(), result.getEmail(), "El email del empleado guardado debe coincidir");
        assertEquals(employee.getFirstName(), result.getFirstName(), "El primer nombre del empleado guardado debe coincidir");
        assertEquals(employee.getLastName(), result.getLastName(), "El apellido del empleado guardado debe coincidir");

        // Verificando que el método save haya sido llamado
        verify(employeeRepo).save(any(Employee.class));
    }

    @Test
    void deleteEmployee_ValidData_DeletesEmployeeAndCallsDeleteUser() throws InvalidDataException {
        // Datos de prueba
        String email = "test@example.com";
        String password = "password123";

        // Crear un empleado simulado
        Employee employee = new Employee("123 Main St", email, "John", "Doe", LocalDate.of(1990, 1, 1),
                "+1", "1234567890", "Passport", "USA", "A1234567", password);

        // Mocking para que findEmployee devuelva el empleado
        when(employeeRepo.findById(email)).thenReturn(Optional.of(employee));

        // Mocking para evitar la eliminación real en el repositorio
        doNothing().when(employeeRepo).delete(employee);

        // Mocking para evitar el intento de eliminar un usuario real
        doNothing().when(userService).deleteUser(email, password);

        // Llamada al método deleteEmployee
        employeeService.deleteEmployee(email, password);

        // Verificaciones
        verify(employeeRepo).delete(employee); // Verifica que delete fue llamado en employeeRepo
        verify(userService).deleteUser(email, password); // Verifica que deleteUser fue llamado en userService
    }

    @Test
    void deleteEmployee_EmployeeNotFound_ThrowsException() throws InvalidDataException {
        String email = "nonexistent@example.com";
        String password = "password123";

        // Mocking para que no se encuentre el empleado
        when(employeeRepo.findById(email)).thenReturn(Optional.empty());

        // Asegúrate de que se lance la excepción cuando el empleado no exista
        assertThrows(InvalidDataException.class, () -> employeeService.deleteEmployee(email, password));

        // Verificaciones
        verify(employeeRepo, never()).delete(any(Employee.class)); // Asegura que no se haya llamado a delete en employeeRepo
        verify(userService, never()).deleteUser(anyString(), anyString()); // Asegura que no se haya llamado a deleteUser en userService
    }

}
