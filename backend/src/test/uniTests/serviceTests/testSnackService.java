package serviceTests;

import com.um.edu.uy.entities.DTOs.FullSnackDTO;
import com.um.edu.uy.entities.DTOs.SnackDTO;
import com.um.edu.uy.entities.DTOs.SnackPreviewDTO;
import com.um.edu.uy.entities.plainEntities.Snack;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.SnackRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.um.edu.uy.services.SnackService;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SnackServiceTest {

    @Mock
    private SnackRepository snackRepo;

    @InjectMocks
    private SnackService snackService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAllSnacks_ReturnsSnackDTOList() {
        List<SnackDTO> mockSnacks = List.of(new SnackDTO(1L, "Chips", 50));
        when(snackRepo.findAllDto()).thenReturn(Optional.of(mockSnacks));

        List<SnackDTO> result = snackService.allSnacks();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Chips", result.get(0).getSnackName());
        verify(snackRepo, times(1)).findAllDto();}



    @Test
    void testFindByExactName_ReturnsSnack() {
        Snack mockSnack = new Snack();
        when(snackRepo.findBySnackName("Chips")).thenReturn(Optional.of(mockSnack));

        Snack result = snackService.findByExactName("Chips");

        assertNotNull(result);
        verify(snackRepo, times(1)).findBySnackName("Chips");
    }

    @Test
    void testAddSnack_SavesSnack() {
        Snack mockSnack = Snack.builder().snackName("Chips").snackDescription("Tasty").price(100).build();
        when(snackRepo.save(any(Snack.class))).thenReturn(mockSnack);

        Snack result = snackService.addSnack("Chips", "Tasty", null, 100);

        assertNotNull(result);
        assertEquals("Chips", result.getSnackName());
        verify(snackRepo, times(1)).save(any(Snack.class));
    }

    @Test
    void testFindSnackByName_ReturnsSnackList() {
        List<Snack> mockSnacks = List.of(new Snack());
        when(snackRepo.findBySnackNameContainingIgnoreCase("chips")).thenReturn(Optional.of(mockSnacks));

        List<Snack> result = snackService.findSnackByName("chips");

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(snackRepo, times(1)).findBySnackNameContainingIgnoreCase("chips");
    }

    @Test
    void testFindSnackByPrice_ReturnsSnackList() {
        List<Snack> mockSnacks = List.of(new Snack());
        when(snackRepo.findByPriceLessThanEqual(50)).thenReturn(Optional.of(mockSnacks));

        List<Snack> result = snackService.findSnackByPrice(50);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(snackRepo, times(1)).findByPriceLessThanEqual(50);
    }

    @Test
    void testDeleteSnack_DeletesSnack() {
        Snack mockSnack = new Snack();

        snackService.deleteSnack(mockSnack);

        verify(snackRepo, times(1)).delete(mockSnack);
    }

    @Test
    void testFindById_ReturnsSnack() {
        Snack mockSnack = new Snack();
        when(snackRepo.findById(1L)).thenReturn(Optional.of(mockSnack));

        Snack result = snackService.findById(1L);

        assertNotNull(result);
        verify(snackRepo, times(1)).findById(1L);
    }

    

    @Test
    void testGetPreview_ThrowsInvalidDataException() {
        when(snackRepo.getPreview(1L)).thenReturn(Optional.empty());

        InvalidDataException exception = assertThrows(InvalidDataException.class, () -> snackService.getPreview(1L));

        assertEquals("Snack not found", exception.getMessage());
        verify(snackRepo, times(1)).getPreview(1L);
    }
}
