package com.um.edu.uy.controllers;


import com.um.edu.uy.entities.DTOs.FullSnackDTO;
import com.um.edu.uy.entities.DTOs.MoviePreviewDTO;
import com.um.edu.uy.entities.DTOs.SnackDTO;
import com.um.edu.uy.entities.DTOs.SnackPreviewDTO;
import com.um.edu.uy.entities.plainEntities.Genre;
import com.um.edu.uy.entities.plainEntities.Movie;
import com.um.edu.uy.entities.plainEntities.Snack;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.services.SnackService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.regex.Pattern;

@RestController
@RequestMapping("api/snacks")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")

public class SnackRestController {
    @Autowired
    private SnackService snackService;



    @PostMapping(value = "/addSnack", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addSnack( HttpSession session,
                                       @RequestParam("name") String name,
                                       @RequestParam("price") int price,
                                       @RequestParam("description") String description,
                                       @RequestParam("picture") MultipartFile picture) {
        if (session.getAttribute("role").equals("employee")) {

            Map<String, String> errors = new HashMap<>();

            if (name.isEmpty()) {
                errors.put("name", "El nombre no es valido.");
            }

            if (description.isEmpty()) {
                errors.put("description", "La descripcion no es valido.");
            }

            if (price < 0) {
                errors.put("price", "Precio invalido.");
            }

            byte[] posterBytes;
            try {
                posterBytes = picture.getBytes();
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error reading file.");
            }
            Snack newSnack = snackService.addSnack(name, description, posterBytes, price);
            return ResponseEntity.ok("Snack agregado.");
        } else { return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Sin permisos."); }
    }

    @GetMapping("/all")
    public ResponseEntity<List<SnackDTO>> showAllSnacks() {
        List<SnackDTO> allSnacks = snackService.allSnacks();

        if (allSnacks.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(allSnacks);
        }
    }

    @GetMapping("/snackName")
    public ResponseEntity<List<Snack>> showAllSnacksByName(@RequestBody String name) {
        List<Snack> snacksFound = snackService.findSnackByName(name);

        if (snacksFound.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(snacksFound);
        }
    }

    @GetMapping("/price")
    public ResponseEntity<List<Snack>> showAllSnacksByPrice(@RequestBody int price) {
        List<Snack> snacksFound = snackService.findSnackByPrice(price);

        if (snacksFound.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(snacksFound);
        }
    }

    @PostMapping("/deleteSnack")
    public ResponseEntity<Snack> deleteSnack(@RequestBody long snackID) {
        Snack snack = snackService.findById(snackID);

        if (snack == null) {
            return ResponseEntity.notFound().build();
        } else {
            snackService.deleteSnack(snack);
            return ResponseEntity.ok(snack);
        }
    }
    @GetMapping("/preview/{snackId}")
    public ResponseEntity<?> getSnackById(@PathVariable Long snackId) {

        try {
            FullSnackDTO snackPreview = snackService.getPreview(snackId);
            String pictureBase64 = Base64.getEncoder().encodeToString((byte[]) snackPreview.getImage());
            HashMap<String,String> snack = new HashMap<>();
            snack.put("id",String.valueOf(snackPreview.getId()));
            snack.put("name",snackPreview.getName());
            snack.put("image","data:image/jpeg;base64,"+ pictureBase64);
            snack.put("price", String.valueOf(snackPreview.getPrice()));
            snack.put("description",snackPreview.getDescription());
            return ResponseEntity.ok(snack);
        } catch (InvalidDataException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new HashMap<String,String>().put("snackId","Snack con id "+snackId+" no encontrado."));
        }
    }

    @GetMapping("/preview/all")
    public ResponseEntity<?> allPreviews() {
        List<FullSnackDTO> snacks = snackService.allPreviews();
        List<HashMap<String,String>> Snacks = new LinkedList<>();
        for(FullSnackDTO snack : snacks) {
            HashMap<String,String> Snack = new HashMap<>();
            Snack.put("id",""+snack.getId());
            Snack.put("name",snack.getName());
            Snack.put("image","data:image/jpeg;base64,"+Base64.getEncoder().encodeToString((byte[]) snack.getImage()));
            Snack.put("price",""+snack.getPrice());
            Snack.put("description",snack.getDescription());
            Snacks.add(Snack);
        }

        return ResponseEntity.ok(Snacks);
    }

    @GetMapping("/AllIds")
    public ResponseEntity<?> allIds() {
        List<Long> snackIds = snackService.allIds();
        return ResponseEntity.ok(snackIds);
    }

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

}

