package com.um.edu.uy.controllers;


import com.um.edu.uy.entities.DTOs.SnackDTO;
import com.um.edu.uy.entities.plainEntities.Snack;
import com.um.edu.uy.services.SnackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/snacks")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")

public class SnackRestController {
    @Autowired
    private SnackService snackService;

    @PostMapping("/addSnack")
    public ResponseEntity<Snack> addSnack(@RequestBody SnackDTO snackDTO) {

        if (snackDTO.getPrice() <= 0) {
            return ResponseEntity.badRequest().build();
        }
        Snack snack = Snack.builder()
                .snackName(snackDTO.getSnackName())
                .snackDescription(snackDTO.getSnackDescription())
                .price(snackDTO.getPrice())
                .build();

        return ResponseEntity.ok(snackService.addSnack(snack));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Snack>> showAllSnacks() {
        List<Snack> allSnacks = snackService.allSnacks();

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
    public ResponseEntity<Snack> deleteSnack(@RequestBody String snackName) {
        Snack snack = snackService.findByExactName(snackName);

        if (snack == null) {
            return ResponseEntity.notFound().build();
        } else {
            snackService.deleteSnack(snack);
            return ResponseEntity.ok(snack);
        }
    }
}
