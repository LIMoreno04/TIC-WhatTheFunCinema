package serviceTests;

import com.um.edu.uy.entities.DTOs.MoviePreviewDTO;
import com.um.edu.uy.entities.DTOs.MovieRankingDTO;
import com.um.edu.uy.entities.DTOs.MovieRevenueDTO;
import com.um.edu.uy.entities.DTOs.ScreeningDTO;
import com.um.edu.uy.entities.plainEntities.Genre;
import com.um.edu.uy.entities.plainEntities.Movie;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.*;
import com.um.edu.uy.services.MovieService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class testMovieService {

    @Mock
    private MovieRepository movieRepo;

    @Mock
    private GenreRepository genreRepo;

    @Mock
    private MovieCustomerRankRepository movieCustomerRankRepo;

    @Mock
    private ScreeningRepository screeningRepo;

    @Mock
    private ReservationRepository reservationRepo;

    @InjectMocks
    private MovieService movieService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }


    @Test
    void testAddMovie_SavesMovieWithRelatedGenres() {
        // Crear géneros
        Genre action = Genre.builder()
                .genreName("Action")
                .movies(new LinkedList<>()) // Inicializar lista de películas
                .build();

        Genre comedy = Genre.builder()
                .genreName("Comedy")
                .movies(new LinkedList<>()) // Inicializar lista de películas
                .build();

        // Crear películas relacionadas con los géneros
        Movie relatedMovie1 = Movie.builder().genres(List.of(action)).build();
        Movie relatedMovie2 = Movie.builder().genres(List.of(comedy)).build();

        // Simular la combinación de géneros en la película resultante
        Movie mockMovie = Movie.builder()
                .title("Test Movie")
                .duration(LocalTime.of(2, 30))
                .genres(List.of(action, comedy)) // Ambos géneros combinados
                .build();

        // Mock del repositorio para simular el guardado
        when(movieRepo.save(any(Movie.class))).thenReturn(mockMovie);

        // Ejecutar el método bajo prueba
        Movie result = movieService.addMovie(
                "Test Movie",
                LocalTime.of(2, 30),
                "A test movie",
                LocalDate.now(),
                "Test Director",
                List.of(), // Películas relacionadas
                null,
                "PG-13"
        );

        // Validar resultados
        assertNotNull(result);
        assertEquals(2, result.getGenres().size()); // Se esperan 2 géneros
        verify(movieRepo, times(1)).save(any(Movie.class));
    }


    @Test
    void testFindById_ReturnsMovie() throws InvalidDataException {
        Movie mockMovie = Movie.builder().title("Test Movie").build();
        when(movieRepo.findById(1L)).thenReturn(Optional.of(mockMovie));

        Movie result = movieService.findById(1L);

        assertNotNull(result);
        assertEquals("Test Movie", result.getTitle());
        verify(movieRepo, times(1)).findById(1L);
    }

    @Test
    void testFindById_ThrowsInvalidDataException() {
        when(movieRepo.findById(1L)).thenReturn(Optional.empty());

        InvalidDataException exception = assertThrows(InvalidDataException.class, () -> movieService.findById(1L));

        assertEquals("Movie not found", exception.getMessage());
        verify(movieRepo, times(1)).findById(1L);
    }



    @Test
    void testGetPreview_ThrowsInvalidDataException() {
        when(movieRepo.getPreview(1L)).thenReturn(Optional.empty());

        InvalidDataException exception = assertThrows(InvalidDataException.class, () -> movieService.getPreview(1L));

        assertEquals("Movie not found", exception.getMessage());
        verify(movieRepo, times(1)).getPreview(1L);
    }

    @Test
    void testGetAllMovies_ReturnsMovies() {
        List<Movie> mockMovies = List.of(Movie.builder().title("Test Movie").build());
        when(movieRepo.findAll()).thenReturn(mockMovies);

        List<Movie> result = movieService.getAllMovies();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Movie", result.get(0).getTitle());
        verify(movieRepo, times(1)).findAll();
    }

    @Test
    void testFindByTitle_ReturnsMovies() {
        List<Movie> mockMovies = List.of(Movie.builder().title("Test Movie").build());
        when(movieRepo.findByTitleContainingIgnoreCase("Test")).thenReturn(Optional.of(mockMovies));

        List<Movie> result = movieService.findByTitle("Test");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Movie", result.get(0).getTitle());
        verify(movieRepo, times(1)).findByTitleContainingIgnoreCase("Test");
    }

    @Test
    void testGetDurationByID_ReturnsDuration() throws InvalidDataException {
        LocalTime mockDuration = LocalTime.of(2, 30);
        when(movieRepo.getDurationById(1L)).thenReturn(Optional.of(mockDuration));

        Duration result = movieService.getDurationByID(1L);

        assertNotNull(result);
        assertEquals(150, result.toMinutes());
        verify(movieRepo, times(1)).getDurationById(1L);
    }

    @Test
    void testGetDurationByID_ThrowsInvalidDataException() {
        when(movieRepo.getDurationById(1L)).thenReturn(Optional.empty());

        InvalidDataException exception = assertThrows(InvalidDataException.class, () -> movieService.getDurationByID(1L));

        assertEquals("Movie not found.", exception.getMessage());
        verify(movieRepo, times(1)).getDurationById(1L);
    }

    @Test
    void testFindScreenings_ReturnsScreeningDTOs() {
        // Configurar un ScreeningDTO de ejemplo
        ScreeningDTO mockScreening = new ScreeningDTO(
                1L, // movieId
                100, // screeningPrice
                LocalDateTime.of(2024, 11, 18, 15, 0), // date_and_time
                5, // roomNumber
                "Test Theatre", // theatre
                "English" // language
        );

        // Configurar el mock del repositorio
        when(screeningRepo.findByMovie(eq(1L), any(LocalDateTime.class)))
                .thenReturn(Optional.of(List.of(mockScreening)));

        // Ejecutar el método bajo prueba
        List<ScreeningDTO> result = movieService.findScreenings(1L);

        // Validar resultados
        assertNotNull(result);
        assertEquals(1, result.size()); // Validar el tamaño de la lista
        ScreeningDTO resultScreening = result.get(0);
        assertEquals("Test Theatre", resultScreening.getTheatre()); // Validar valores específicos
        assertEquals(5, resultScreening.getRoomNumber());
        assertEquals(100, resultScreening.getScreeningPrice());

        // Verificar la interacción con el repositorio
        verify(screeningRepo, times(1)).findByMovie(eq(1L), any(LocalDateTime.class));
    }


    @Test
    void testGetHighestRevenue_ReturnsMovieRevenueDTOs() {
        // Crear una lista de MovieRevenueDTO con valores de ejemplo
        List<MovieRevenueDTO> mockRevenues = List.of(
                new MovieRevenueDTO(1L, "Test Movie", null, "PG-13", 50000L)
        );

        // Configurar el mock del repositorio
        when(reservationRepo.findMoviesWithHighestRevenue()).thenReturn(mockRevenues);

        // Ejecutar el método bajo prueba
        List<MovieRevenueDTO> result = movieService.getHighestRevenue();

        // Validar los resultados
        assertNotNull(result);
        assertEquals(1, result.size());
        MovieRevenueDTO dto = result.get(0);
        assertEquals(1L, dto.getId());
        assertEquals("Test Movie", dto.getTitle());
        assertEquals("PG-13", dto.getPGRating());
        assertEquals(50000L, dto.getRevenue());

        // Verificar la interacción con el repositorio
        verify(reservationRepo, times(1)).findMoviesWithHighestRevenue();
    }

}

