package serviceTests;

import com.um.edu.uy.entities.plainEntities.*;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.*;
import com.um.edu.uy.services.MovieService;
import com.um.edu.uy.services.RoomService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import static jdk.internal.org.objectweb.asm.util.CheckClassAdapter.verify;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class testRoomService {

    @Mock
    private RoomRepository roomRepo;
    @Mock
    private MovieRepository movieRepo;
    @Mock
    private TheatreRepository theatreRepo;
    @Mock
    private ScreeningRepository screeningRepo;
    @Mock
    private ReservationRepository reservationRepo;
    @Mock
    private MovieService movieService;

    @InjectMocks
    private RoomService roomService;

    @Test
    void testAddScreening_Successful() throws InvalidDataException {
        // Datos de prueba
        long movieId = 1L;
        String theatreLocation = "Test Theatre";
        int roomNumber = 1;
        LocalDateTime dateTime = LocalDateTime.now();
        int screeningPrice = 100;
        String language = "EN";

        // Crear un mock para la película
        Movie movie = new Movie();
        movie.setId(movieId);

        // Crear un mock para la sala
        Room room = new Room();
        room.setRoom_number(roomNumber);
        room.setScreenings(new LinkedList<>()); // Inicializa la lista screenings

        // Crear un mock para el teatro
        Theatre theatre = new Theatre();
        theatre.setLocation(theatreLocation);

        // Mock de servicios
        when(movieService.findById(movieId)).thenReturn(movie);
        when(theatreRepo.findById(theatreLocation)).thenReturn(Optional.of(theatre));  // Mock para el teatro
        when(roomRepo.findByTheatreAndRoomNumber(any(), eq(roomNumber))).thenReturn(Optional.of(room));  // Mock de la sala (debe devolver Optional.of(room) y no Optional.empty())
        when(screeningRepo.findById(any())).thenReturn(Optional.empty());

        // Ejecutar el método
        roomService.addScreening(movieId, screeningPrice, dateTime, roomNumber, theatreLocation, language);

        // Verificar que la película se añadió a la lista de proyecciones de la sala
        assertNotNull(room.getScreenings());
        assertEquals(1, room.getScreenings().size());

        // Verificar que la película se añadió a la lista de proyecciones de la película
        assertNotNull(movie.getScreenings());
        assertEquals(1, movie.getScreenings().size());
    }

    @Test
    void testIsRoomAvailable_NoScreenings() {
        // Caso en que no hay screenings (Optional.empty())
        when(screeningRepo.isRoomAvailable(any(), any(), any(), anyInt())).thenReturn(Optional.empty());

        // Prueba
        Boolean result = roomService.isRoomAvailable(LocalDateTime.now(), LocalDateTime.now().plusHours(1), "Test Theatre", 1);

        // Verificación: se espera que devuelva true porque no hay screenings
        assertTrue(result);
    }

    @Test
    void testIsRoomAvailable_RoomHasNoScreenings() {
        // Caso en que hay screenings pero la lista está vacía
        when(screeningRepo.isRoomAvailable(any(), any(), any(), anyInt())).thenReturn(Optional.of(new ArrayList<>()));

        // Prueba
        Boolean result = roomService.isRoomAvailable(LocalDateTime.now(), LocalDateTime.now().plusHours(1), "Test Theatre", 1);

        // Verificación: se espera que devuelva true porque la lista de screenings está vacía
        assertTrue(result);
    }

    @Test
    void testIsRoomAvailable_RoomHasScreenings() {
        // Caso en que hay screenings (la lista no está vacía)
        List<Object[]> screenings = new ArrayList<>();
        screenings.add(new Object[] { "Test Screening" });  // Simulamos un screening
        when(screeningRepo.isRoomAvailable(any(), any(), any(), anyInt())).thenReturn(Optional.of(screenings));

        // Prueba
        Boolean result = roomService.isRoomAvailable(LocalDateTime.now(), LocalDateTime.now().plusHours(1), "Test Theatre", 1);

        // Verificación: se espera que devuelva false porque hay screenings en la sala
        assertFalse(result);
    }

}

