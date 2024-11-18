package serviceTests;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.um.edu.uy.entities.plainEntities.*;
import com.um.edu.uy.entities.DTOs.ReservationDTO;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.*;
import com.um.edu.uy.services.TheatreService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.*;

class testTheatreService {

    @Mock
    private TheatreRepository theatreRepo;

    @Mock
    private RoomRepository roomRepo;

    @Mock
    private ScreeningRepository screeningRepo;

    @InjectMocks
    private TheatreService theatreService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);  // Inicializa los mocks antes de cada prueba
    }

    @Test
    void testFindByLocation_TheatreNotFound() {
        // Caso donde no se encuentra el teatro
        when(theatreRepo.findById("Location1")).thenReturn(Optional.empty());

        // Prueba: debe lanzar InvalidDataException
        InvalidDataException exception = assertThrows(InvalidDataException.class, () -> {
            theatreService.findByLocation("Location1");
        });

        // Verificación: mensaje de la excepción
        assertEquals("Theatre not found.", exception.getMessage());
    }

    @Test
    void testFindAll() {
        // Caso donde se buscan todos los teatros
        Theatre theatre1 = mock(Theatre.class);
        Theatre theatre2 = mock(Theatre.class);
        List<Theatre> theatres = Arrays.asList(theatre1, theatre2);

        when(theatreRepo.findAll()).thenReturn(theatres);

        // Prueba: debe devolver la lista de teatros
        List<Theatre> result = theatreService.findAll();

        // Verificación
        assertNotNull(result);
        assertEquals(2, result.size());
    }

    @Test
    void testFindAllLocations() {
        // Caso donde se buscan todas las ubicaciones
        List<String> locations = Arrays.asList("Location1", "Location2");
        when(theatreRepo.findAllLocations()).thenReturn(locations);

        // Prueba: debe devolver la lista de ubicaciones
        List<String> result = theatreService.findAllLocations();

        // Verificación
        assertNotNull(result);
        assertEquals(2, result.size());
    }

    @Test
    void testAddTheatre_LocationAlreadyExists() {
        // Caso donde el teatro ya existe
        when(theatreRepo.findByLocationIgnoreCase("Location1")).thenReturn(Optional.of(mock(Theatre.class)));

        // Prueba: debe lanzar InvalidDataException
        InvalidDataException exception = assertThrows(InvalidDataException.class, () -> {
            theatreService.addTheatre("Location1");
        });

        // Verificación
        assertEquals("Ya se tiene registro de esa sucursal.", exception.getMessage());
    }

    @Test
    void testAddTheatre_LocationIsNull() {
        // Caso donde la ubicación es nula
        InvalidDataException exception = assertThrows(InvalidDataException.class, () -> {
            theatreService.addTheatre(null);
        });

        // Verificación
        assertEquals("Ingrese la localidad.", exception.getMessage());
    }

    @Test
    void testAddRoomToTheatre_TheatreNotFound() {
        // Caso donde el teatro no existe
        when(theatreRepo.findByLocationIgnoreCase("Location1")).thenReturn(Optional.empty());

        // Prueba: debe lanzar InvalidDataException
        InvalidDataException exception = assertThrows(InvalidDataException.class, () -> {
            theatreService.addRoomToTheatre("Location1", 10, 15);
        });

        // Verificación
        assertEquals("Sucursal no existe.", exception.getMessage());
    }

    @Test
    void testAddRoomToTheatre_Success() throws InvalidDataException {
        // Caso donde se agrega una sala correctamente
        Theatre theatre = mock(Theatre.class);
        when(theatreRepo.findByLocationIgnoreCase("Location1")).thenReturn(Optional.of(theatre));
        when(theatre.getRooms()).thenReturn(new LinkedList<>());

        theatreService.addRoomToTheatre("Location1", 10, 15);

        // Verificación
        verify(theatreRepo, times(1)).save(theatre);
    }



    @Test
    void testGetReservations_ScreeningNotFound() {
        // Caso donde no se encuentra la proyección
        when(screeningRepo.findById(any())).thenReturn(Optional.empty());

        // Prueba: debe lanzar InvalidDataException
        InvalidDataException exception = assertThrows(InvalidDataException.class, () -> {
            theatreService.getReservations("Location1", 1, LocalDateTime.now());
        });

        // Verificación
        assertEquals("screening not found.", exception.getMessage());
    }

    @Test
    void testGetReservations_Success() throws InvalidDataException {
        // Crear una proyección de ejemplo (Screening)
        Screening screening = mock(Screening.class);

        // Crear un objeto Room mockeado
        Room room = mock(Room.class);
        when(screening.getRoom()).thenReturn(room);  // Mockear la relación Room dentro de Screening

        // Establecer valores mockeados para las propiedades de Room
        when(room.getRows()).thenReturn(10);
        when(room.getColumns()).thenReturn(10);

        // Simular que el screening está en el repositorio
        when(screeningRepo.findById(any())).thenReturn(Optional.of(screening));

        // Crear una reserva ficticia (de tipo Reservation)
        Reservation reservation = mock(Reservation.class);
        when(screening.getReservations()).thenReturn(Arrays.asList(reservation));  // Devuelve una lista de reservas

        // Llamar al método
        Object[] result = theatreService.getReservations("Location1", 1, LocalDateTime.now());

        // Verificación
        assertNotNull(result);
        assertTrue(result.length > 0);  // Verifica que el array no esté vacío
        assertEquals(4, result.length);  // Verifica que el array tiene 4 elementos
        // Verifica que el número de filas y columnas de la sala es correcto
        assertEquals(10, result[0]);
        assertEquals(10, result[1]);
    }


}
