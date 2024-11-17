package com.um.edu.uy.services;

import com.um.edu.uy.entities.DTOs.MoviePreviewDTO;
import com.um.edu.uy.entities.DTOs.SnackPreviewDTO;
import com.um.edu.uy.entities.plainEntities.Snack;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.SnackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Service
public class SnackService {

    @Autowired
    private SnackRepository snackRepo;

    public List<Snack> allSnacks() {
        return snackRepo.findAll();
    }

    public Snack findByExactName(String name) {
        return snackRepo.findBySnackName(name).orElse(null);
    }

    public Snack addSnack(String name, String description, byte[] picture, int price) {

        Snack newSnack = Snack.builder().
                snackName(name).
                snackDescription(description).
                snackPicture(picture).
                price(price).build();

        return snackRepo.save(newSnack);
    }

    public List<Snack> findSnackByName(String snackName) {
        return snackRepo.findBySnackNameContainingIgnoreCase(snackName).orElse(new LinkedList<>());
    }

    public List<Snack> findSnackByPrice(int price) {
        return snackRepo.findByPriceLessThanEqual(price).orElse(new LinkedList<>());
    }

    public void deleteSnack(Snack snack) {
        snackRepo.delete(snack);

    }

    public Snack findById(long id) {
        return snackRepo.findById(id).orElse(null);
    }

    @Transactional
    public SnackPreviewDTO getPreview(long id) throws InvalidDataException {
        return snackRepo.getPreview(id).orElseThrow(()->new InvalidDataException("Snack not found"));
    }
}
